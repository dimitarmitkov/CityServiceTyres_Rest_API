global.__basedir = __dirname;

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const utils = require('./utils');
const { server: { port, cors: corsConfig }} = require('./config');
// const db = require('./db');
const api = require('./api');
const tapLog = require('./utils/tap-log');
const globalErrorHandler = require('./global-error-handler');
// const serveStatic = require("serve-static");
// const staticBasePath = "./static";

const app = express();

app.use(cors({
  origin: corsConfig.urls,
  credentials: corsConfig.credentials,
  exposedHeaders: corsConfig.exposedHeaders
}));

// app.use(serveStatic(staticBasePath, {"index": false}));

app.use('/static', express.static('public'));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__basedir, 'static')));

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

// db.connect(database.connectionString, database.databaseName)
//   .catch(utils.tapLog('Error connecting to database!'))
//   .then(utils.tapLog('Successfully connected to database'))
//   .then(appListen)
//   .then(tapLog(`Server is listening on :${port}`))
//   .catch(error => console.log(`Server Error: ${error.message}`));