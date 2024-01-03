const response = require('supertest');
const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo');


describe('Launch Test api', ()=> {
    beforeAll(async ()=> {
        await mongoConnect();
    });

    afterAll(async ()=> {
        await mongoDisconnect();
    });

    describe('Test GET /launches api', () => {
        test('It should return 200 status code', async () => {
            const request = await response(app).get('/v1/launches').expect('Content-Type', /json/).expect(200);
        });
    });
    
    
    describe('Test POST /launches api', () => {
        const completeLaunchData = {
            mission: 'Kepler',
            target: 'Kepler-62-f',
            rocket: 'Test Demo',
            launchDate: 'June 6 , 2024'
        };
    
        const launchDataWithoutLaunchDate = {
            mission: 'Kepler',
            target: 'Kepler-62-f',
            rocket: 'Test Demo',
        };
    
        const launchDateWithInvalidDate = {
            mission: 'Kepler',
            target: 'Kepler-62-f',
            rocket: 'Test Demo',
            launchDate: 'Guddu'
        };
        test('It shoud be rerurn 201 response', async () => {
            const request = await response(app).post('/v1/launches').send(completeLaunchData).expect('Content-Type', /json/).expect(201);
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(request.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            expect(request.body).toMatchObject(launchDataWithoutLaunchDate);
        });
    
        test('It should be catch missing required properties', async () => {
            const request = await response(app).post('/v1/launches').send(launchDataWithoutLaunchDate).expect('Content-Type', /json/).expect(400);
    
            expect(request.body).toStrictEqual({
                error: "Missing requried launch property"
            });
    
        });
    
        test('It should be catch invalid date', async() => {
            const request = await response(app).post('/v1/launches').send(launchDateWithInvalidDate).expect('Content-Type', /json/).expect(400);
    
            expect(request.body).toStrictEqual({
                error: "Invalid date formate"
            });
        });
    });
    
    describe('Test DELETE /launches api', () => {
        test('It shoud be returned with 200 response', async() => {
            const request = await response(app).delete('/v1/launches/104').expect(200);
        });
    
        test('It shoud be catch error with 404 response', async() => {
            const request = await response(app).delete('/v1/launches/185').expect(404);
    
            expect(request.body).toStrictEqual({
                error : 'Launch id not found'
            })
        });
    })

})
