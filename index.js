global.__basedir = __dirname;

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const utils = require('./utils');
const { server: { port, cors: corsConfig }} = require('./config');
const api = require('./api');
const tapLog = require('./utils/tap-log');
const globalErrorHandler = require('./global-error-handler');
const passport = require("passport");

const app = express();

app.use(cors({
  origin: corsConfig.urls,
  credentials: corsConfig.credentials,
  exposedHeaders: corsConfig.exposedHeaders
}));

app.use('/static', express.static('public'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__basedir, 'static')));
app.use(passport.initialize());
app.use(passport.session());

api.connect('/api/v1', app);

app.use('*', function (req, res) {
  res.sendFile(path.resolve(__dirname, 'static', 'index.html'));
});

app.use(globalErrorHandler);

function appListen() {
  return new Promise((resolve, reject) => {
    app.listen(port, function () { resolve(); })
  });
}

appListen().then(tapLog(`Server is listening on :${port}`))
    .catch(error => console.log(`Server Error: ${error.message}`));
