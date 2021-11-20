const { Router } = require('express');
const userController = require('./controllers/user');

module.exports.connect = function (path, app) {
  const router = Router();

  router.route("/login")
      .post(userController.loginUser)
      .get(userController.authorization);

  router.route("/logout")
      .get(userController.logoutUser);


  router.route("/users")
      .get(userController.getUsers)
      .post(userController.createUser);
      // .post(userController.loginUser);



  router.route("/users/:id")
      .post(userController.getSingleUser)
      .put(userController.updateUser)
      .delete(userController.deleteUser);

  router.route("/calendarAdd")
      .get(userController.addCalendarRecord)
      .post(userController.addNewCalendarRecord);

  router.route("/calendarRemove")
      .delete(userController.removeCalendarRecord);

  router.route("/calendarAddGuest")
      .post(userController.addNewCalendarRecordGuest);

  router.route("/calendarGet")
      .get(userController.getCalendarItems)
      .post(userController.calendarGetHoursTaken);

  router.route("/car")
      .post(userController.getCarLicensePlate);

  app.use(path, router);
};
