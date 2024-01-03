const http = require('http');

require('dotenv').config();

const app = require('./app');
const {mongoConnect} = require('./services/mongo');
const {loadPlanets} = require('./models/planet.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await loadPlanets();
    server.listen(PORT, () => {
        console.log(`server is running on port ${PORT}`)
    })
}

startServer();