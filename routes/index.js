const publicRoutes = require("./publicRoutes");

module.exports = (app) => {
  app.use(publicRoutes);
};
