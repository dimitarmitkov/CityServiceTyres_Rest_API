const { Router } = require('express');
const userController = require('./controllers/user');

module.exports.connect = function (path, app) {
  const router = Router();

  router.route("/login")
      .post(userController.loginUser)
      .get(userController.authorization);


  router.route("/users")
      .get(userController.getUsers)
      .post(userController.createUser);
      // .post(userController.loginUser);



  router.route("/users/:id")
      .put(userController.updateUser)
      .delete(userController.deleteUser)
      .get(userController.getUser);

  router.route("/calendarAdd")
      .get(userController.addCalendarRecord)
      .post(userController.addNewCalendarRecord);

  router.route("/calendarAddGuest")
      // .post(userController.addNewCalendarRecordGuest);

  router.route("/calendarGet")
      .post(userController.calendarGetHoursTaken);

  router.route("/car")
      .post(userController.getCarLicensePlate);

  app.use(path, router);
};
