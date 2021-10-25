const express = require("express");

const router = express.Router();

const Github = require("../models/Github");
const Filters = require("../Filters/GithubFilters");

router.get("/", async (req, res) => {
  try {
    const data = await Filters.selectMysqAll()

    res.send(data);
  } catch (err) {
    res.status(400).send({ error: "" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await Filters.selectMysqlById(req.params.id);
    if(!data) {
      res.status(400).send({ error: "Resquest nou found" });
    }
    if(data.finalized == 0) {
      res.status(400).send({ error: "Request not completed" });
    }
    const dataResponse = JSON.parse(decodeURI(data.response))

    res.send(dataResponse);
  } catch (err) {
    res.status(400).send({ error: "" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const urlGithub = "https://github.com";
  
    const initFilters = await Filters.createdBase(urlGithub, name, 'POST');
    res.send({ ID: initFilters });
  } catch (err) {
    res.status(400).send({ error: "Erro no init crawler" });
  }
});

module.exports = (app) => app.use("/api", router);
