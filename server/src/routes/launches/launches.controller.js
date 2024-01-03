const { getAllLaunches, scheduleNewLaunch, existLaunchId, abortLaunch } = require('../../models/launches.model');
const getQueryParam = require('../../services/query');

async function httpGetAllLaunches(req, res) {
    const {skip, limit} = getQueryParam(req.query);
    return res.status(200).json(await getAllLaunches(skip, limit));
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;
    if (!launch.mission || !launch.target || !launch.launchDate || !launch.rocket) {
        return res.status(400).json({
            error: "Missing requried launch property"
        })
    }
    launch.launchDate = new Date(launch.launchDate);

    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error: "Invalid date formate"
        })
    }
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    const exist = await existLaunchId(launchId);
    if(!exist){
        return res.status(404).json({
            error : 'Launch id not found'
        })
    }
    const abort = await abortLaunch(launchId);
    console.log(abort);
    if(!abort){
        return res.status(400).json({
            error : 'Launch not aborted!!'
        })
    }
    return res.status(200).json({
        OK: true
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}