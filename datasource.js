const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
  type: "postgres",
  port: 5432,
  username: "medusa_plugin_ultimate_user",
  password: "clLk2dx4ORa8GPb1MpOdaaX3mbhMcSsK",
  database: "medusa_plugin_ultimate",
  host: "dpg-ckg3936ct0pc73a6mobg-a.frankfurt-postgres.render.com",
  entities: ["dist/models/*.js"],
  migrations: ["dist/migrations/*.js"],
  extra: {
    ssl: true,
  },
});

module.exports = {
  datasource: AppDataSource,
};
