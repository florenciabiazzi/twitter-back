const express = require("express");
const tokenController = require("../controllers/tokenController");
const apiRouter = express.Router();

//Crea un tweet--create
apiRouter.post("/tweets");

// Borra un tweet en específico--destroy
apiRouter.delete("/tweets/:id");

// Da like a un tweet en específico--like
apiRouter.post("/tweets/:id");

// Da dislike a un tweet en específico--dislike
apiRouter.delete("/tweets/:id");

//Trae los tweets de un usuario especifico--show
apiRouter.get("/tweets/:username");

//Genera un nuevo token--createToken
apiRouter.post("/token", tokenController.login);

//Crea un nuevo usuario--create
apiRouter.post("/users");

//Trae toda la informacion de un usuario.--show
apiRouter.get("/users/:username");

//Trae los usuarios que sigue un usuario--showFollowing
apiRouter.get("/users/:username/following");

//Agrega un usuario a la lista de seguidos. El id corresponde al usuario que quiero seguir --follow
apiRouter.post("/users/follow/:id");

//Elimina un usuario de la lista de seguidos. El id corresponde al usuario que quiero dejar de seguir --unfollow
apiRouter.delete("/users/follow/:id");

//Trae los usuarios que sigue un usuario--showFollowers
apiRouter.get("/users/:username/followers");

module.exports = apiRouter;
