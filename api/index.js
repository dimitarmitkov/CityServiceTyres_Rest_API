const { Router } = require('express');
const userController = require('./controllers/user');

module.exports.connect = function (path, app) {
  const router = Router();

  router.route("/users")
      .get(userController.getUsers)
      .post(userController.createUser);

  router.route("/users/:id")
      .put(userController.updateUser)
      .delete(userController.deleteUser)
      .get(userController.getUser);

  app.use(path, router);
};
