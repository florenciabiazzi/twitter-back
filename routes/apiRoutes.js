const express = require("express");
const tokenController = require("../controllers/tokenController");
const apiRouter = express.Router();
const tweetController = require("../controllers/tweetController");
const userController = require("../controllers/userController");
const checkJwt = require("express-jwt");
const userController = require("../controllers/userController");

require("dotenv").config();

//Genera un nuevo token--createToken
apiRouter.post("/token", tokenController.login);

//Crea un nuevo usuario--store
apiRouter.post("/users", userController.store);

//Trae los tweets de un usuario especifico--show
apiRouter.get("/tweets/:username", tweetController.show);

//Trae toda la informacion de un usuario.--show
apiRouter.get("/users/:username", userController.getUser);

apiRouter.use(
  checkJwt({
    secret: process.env.ACCESS_TOKEN,
    algorithms: ["HS256"],
  }),
);
//Crea un tweet--create
apiRouter.post("/tweets", tweetController.store);

// Borra un tweet en específico--destroy
apiRouter.delete("/tweets/:id", tweetController.destroy);

// Da like a un tweet en específico--like
apiRouter.post("/tweets/like/:id", tweetController.like);

// Da dislike a un tweet en específico--dislike
apiRouter.delete("/tweets/like/:id", tweetController.dislike);

//Trae los usuarios que sigue un usuario--showFollowing
apiRouter.get("/following", userController.showFollowing); //real path:/users/:username/following

//Agrega un usuario a la lista de seguidos. El id corresponde al usuario que quiero seguir --follow
apiRouter.post("/add", userController.follow); //real path:/users/follow/:id

//Elimina un usuario de la lista de seguidos. El id corresponde al usuario que quiero dejar de seguir --unfollow
apiRouter.delete("/remove/:id", userController.unfollow); //real path:/users/follow/:id

//Trae los usuarios que sigue un usuario--showFollowers
apiRouter.get("/followers", userController.showFollowers); //real path:/users/:username/followers

module.exports = apiRouter;
