const express = require('express');
const {httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch} = require('./launches.controller');

const launcheRouter = express.Router();

launcheRouter.get('/', httpGetAllLaunches);
launcheRouter.post('/', httpAddNewLaunch);
launcheRouter.delete('/:id', httpAbortLaunch);


module.exports = launcheRouter;