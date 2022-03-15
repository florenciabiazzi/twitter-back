const express = require("express");
const publicRouter = express.Router();
const { show, create, edit, store, update, destroy } = require("../controllers/userController");

// Rutas del Públicas:
publicRouter.get("/usuarios", show);

publicRouter.get("/usuarios/crear", create);

publicRouter.get("/usuarios/editar/:id", edit);

publicRouter.post("/usuarios", store);

publicRouter.post("/usuarios/editar/:id", update);

publicRouter.delete("/usuarios/:id", destroy);
// ...

module.exports = publicRouter;
