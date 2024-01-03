const express = require('express');


const planetRouter = require('./planet/planet.router');
const launchesRouter = require('./launches/launches.router');


const api = express.Router();
api.use('/planets',planetRouter);
api.use('/launches',launchesRouter);

module.exports = api;