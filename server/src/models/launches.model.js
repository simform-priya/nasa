const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

// const launches = new Map();
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration',
    rocket: 'Explorer IS1',
    launchDate: new Date('June 6, 2026'),
    target: 'Kepler-62 f',
    customers: ['NASA', 'ZTM'],
    upcoming: true,
    sucess: true
}

saveLaunch(launch);

// save new launch in memory
// launches.set(launch.flightNumber, launch);

// Get all launches
async function getAllLaunches(skip, limit) {
    return await launchesDatabase.find({}, {'_id': 0, '__v': 0}).sort({flightNumber: 1}).skip(skip).limit(limit);
}

// add new launch in memory
// function addNewLaunches(launch) {
//     latestFlightNumber++;
//     return launches.set(latestFlightNumber, Object.assign(launch, {
//         sucess: true,
//         upcoming: true,
//         flightNumber: latestFlightNumber,
//         customers: ['Zero to Mastery', 'NASA']
//     }))
// }

// check launch is exist or not in memory
async function existLaunchId(launchId) {
    console.log(launchId);
    return await launchesDatabase.findOne({
        flightNumber: launchId
    });
}

// abort launch in memory
async function abortLaunch(launchId) {
   const abort = await launchesDatabase.updateOne({
        flightNumber: launchId
    },
    {
        upcoming: false,
        sucess: false
    }
    );
    return abort.modifiedCount === 1; 
}

// save new launch in database
async function saveLaunch(launch) {
   const planet = await planets.findOne({
    keplerName: launch.target
   });

   if(!planet){
      throw new Error('Launch planet not found');
   }
    
  await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }
        , launch, {
        upsert: true,
    }
    )
}

// Get latest flight number
async function getLatestFlightNumber(){
    const launchPlanet = await launchesDatabase.findOne().sort('-flightNumber');
    if(!launchPlanet){
        return DEFAULT_FLIGHT_NUMBER;
    }
    return launchPlanet.flightNumber;
}

// New launch with Mogoose
async function scheduleNewLaunch(launch){
    const latestFlightNumber = await getLatestFlightNumber() + 1;
    const newLaunch = Object.assign(launch, {
        sucess: true,
        upcoming: true,
        flightNumber: latestFlightNumber,
        customers: ['Zero to Mastery', 'NASA']
    });
    console.log(newLaunch);
    saveLaunch(newLaunch);
}


module.exports = {
    getAllLaunches,
    existLaunchId,
    abortLaunch,
    scheduleNewLaunch,
}