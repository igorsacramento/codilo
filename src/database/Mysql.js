const connect = async () => {
  if (global.connection && global.connection.state !== "disconnected")
    return global.connection;

  const mysql = require("mysql2/promise");
  const connection = await mysql.createConnection(
    process.env.CONNECT_MYSQL_DB_KEY
  );
  global.connection = connection;
  //console.log(connection)
  return connection;
};

module.exports = { connect };
