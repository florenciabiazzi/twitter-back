const db = require("./models");

module.exports = async () => {
  // Ejecutar seeders (datos de prueba):
  await require("./seeders/userSeeder")();
  console.log("[Database] ¡Los datos de prueba fueron insertados!");
};
