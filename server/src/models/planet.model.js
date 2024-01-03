const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const planet = require('./planets.mongo');


function isHabitablePlanet(planet) {
  return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}
function loadPlanets() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
      .pipe(parse({
        comment: '#',
        columns: true,
      }))
      .on('data', async (data) => {
        if (isHabitablePlanet(data)) {
           savePlanet(data);
        }
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('end', async () => {
        const countPlanetLength = (await getAllPlanets()).length;
        console.log(`${countPlanetLength} habitable planets found!`);
        resolve();
      });

  })
}

async function getAllPlanets() {
  return await planet.find({}, {'_id': 0, '__v': 0});
}

async function savePlanet(planets) {
  console.log(planets.kepler_name);
  try {
    await planet.updateOne(
      {
      keplerName: planets.kepler_name
      },
      {
        keplerName: planets.kepler_name
      },
      {
        upsert: true
      }
    )
  } catch(error) {
    console.log(`Could not save planet ${error}`);
  }
}

module.exports = {
  loadPlanets,
  getAllPlanets
};