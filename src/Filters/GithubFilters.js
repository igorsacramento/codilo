const rp = require("request-promise");
const cheerio = require("cheerio");

const Github = require("../models/Github");
const Repositories = require("../models/Repositories");
const Pinned = require("../models/Pinned");
const Header = require("../models/Header");

const Mysql = require("../database/Mysql");

const createdBase = async (url, name, request_type) => {
  const github = await Github.create({ url: url });
  const data = await createMysql(request_type, name);
  initCrawler(url, name, github, data.insertId);

  return data.insertId;
};

const initCrawler = async (url, name, github, id) => {
  await createdHeader(url, name, github);
  await createdPinned(url, name, github);
  await createdRepositories(url, name, github);
  const data = await github.save();

  const responseMongo = await filterResturnMongo(data);
  const update = await updateMysql(id, responseMongo);
};

const filterResturnMongo = async (data) => {
  const dados = await data.populate(["repositories"]);
  return {
    header: dados.header,
    pinned: dados.pinned,
    repositories: dados.repositories,
  };
};

const selectMysqAll = async () => {
  const conn = await Mysql.connect();
  const sql = "SELECT r.ID, r.request_type, r.finalized, r.created_at FROM resquests as r";
  const [results] = await conn.execute(sql);
	return results;
	
};

const selectMysqlById = async (id) => {
  const conn = await Mysql.connect();
  const sql = "SELECT * FROM resquests WHERE id = ?";
  const [results] = await conn.execute(sql, [id]);
	return results[0];
	
};

const updateMysql = async (id, response) => {
  const conn = await Mysql.connect();
  const sql =
    "UPDATE resquests SET response = ?, finalized = 1, finalized_at = NOW() WHERE ID=?";
  const values = [encodeURI(JSON.stringify(response)), id];
  const [results] = await conn.execute(sql, values);
  return results;
};

const createMysql = async (request_type, param_request) => {
  const conn = await Mysql.connect();
  const sql =
    "INSERT INTO resquests (request_type, param_request, created_at) VALUES (?, ?, NOW())";
  const [results] = await conn.execute(sql, [request_type, param_request]);
  return results;
};

const createdRepositories = async (url, name, github) => {
  var pauseRepo = false;
  var repositories = [];
  for (var x = 1; pauseRepo === false; x++) {
    var repo = await rp(`${url}/orgs/${name}/repositories?page=${x}`)
      .then(async function (html) {
        var $ = cheerio.load(html);
        var response = [];

        if ($(".repo-list ul li").length) {
          $(".repo-list ul li").each(async function (i, e) {
            const tags = [];
            $(e)
              .find("a.topic-tag, a.topic-tag-link")
              .each(function (i, e) {
                tags.push($(e).text().trim());
              });

            const repo = new Repositories({
              repository: $(e)
                .find("[data-hovercard-type=repository]")
                .html()
                .trim(),
              status: $(e).find("[itemprop=owns]").hasClass("archived")
                ? "Archived"
                : "",
              url:
                url +
                $(e).find("[data-hovercard-type=repository]").attr("href"),
              description: $(e).find("[itemprop=description]").text().trim(),
              tags,
              language: $(e)
                .find("[itemprop=programmingLanguage]")
                .text()
                .trim(),
              forks: $(e)
                .find("svg[aria-label=fork]")
                .closest("a")
                .text()
                .trim(),
              stars: $(e).find("svg.octicon-star").closest("a").text().trim(),
              issues: $(e)
                .find("svg.octicon-issue-opened")
                .closest("a")
                .text()
                .trim(),
              pullRequests: $(e)
                .find("svg.octicon-git-pull-request")
                .closest("a")
                .text()
                .trim(),
              lastUpdate: $(e).find("relative-time").attr("datetime"),
            });

            await repo.save();
            github.repositories.push(repo._id);
          });
          //await github.save();
          return response;
        } else {
          return false;
        }
      })
      .catch(function (err) {
        console.log({ error: "Error inserting repositories" });
        return false;
      });

    if (repo) {
      repositories = [...repositories, repo];
    } else {
      pauseRepo = true;
    }
  }
  console.log("Finalize Repositories");
  return true;
};

const createdPinned = async (url, name, github) => {
  var pinned = await rp(`${url}/${name}`)
    .then(function (html) {
      var $ = cheerio.load(html);
      $(".pinned-item-list-item-content").each(async function (i, e) {
        const pinned = new Pinned({
          repository: $(e).find(".repo").attr("title"),
          url: $(e).find("div>a").attr("href"),
          description: $(e).find("p.pinned-item-desc").text().trim(),
          language: $(e)
            .find("span[itemprop=programmingLanguage]")
            .text()
            .trim(),
          stars: $(e).find("svg[aria-label=stars]").closest("a").text().trim(),
          forks: $(e).find("svg[aria-label=forks]").closest("a").text().trim(),
        });

        await pinned.save();
        github.pinned.push(pinned);
      });
    })
    .catch(function (err) {
      console.log({ error: "Error inserting pinneds" });
      return false;
    });
  console.log("Finalize Pinneds");
  return true;
};

const createdHeader = async (url, name, github) => {
  var pinned = await rp(`${url}/${name}`)
    .then(async function (html) {
      var $ = cheerio.load(html);
      const pagehead = $(".pagehead");

      var topLanguages = [];
      $("a.color-fg-muted>span>span[itemprop=programmingLanguage]").each(
        function (i, e) {
          topLanguages.push($(e).html().trim());
        }
      );

      var topTags = [];
      $(".topic-tag").each(function (i, e) {
        topTags.push($(e).html().trim());
      });

      var topUsers = [];
      $(".member-avatar img").each(function (i, e) {
        topUsers.push($(e).attr("alt").replace("@", "").trim());
      });

      const urls = [];
      $("ul.has-blog>li>a").each(async function (i, e) {
        urls.push({
          url: url + $(e).attr("href").trim(),
          description: $(e).html().trim(),
        });
      });

      var header = new Header({
        title: pagehead.find(".lh-condensed").html().trim(),
        avatar: pagehead.find(".avatar").attr("src").trim(),
        urls,
        topLanguages,
        topTags,
        topUsers,
      });

      await header.save();

      github.header = header;
    })
    .catch(function (err) {
      console.log({ error: "Error inserting headers" });
      return false;
    });
  console.log("Finalize Header");
  return true;
};

module.exports = {
  createdBase,
	selectMysqlById,
	selectMysqAll,
};
