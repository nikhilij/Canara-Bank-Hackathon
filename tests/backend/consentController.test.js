const request = require('supertest');
const app = require('../../src/app');
const Consent = require('../../src/models/Consent');
const User = require('../../src/models/User');

describe('Consent Controller', () => {
    let userId;
    let consentId;
    let authToken;

    beforeEach(async () => {
        // Create test user
        const user = await User.create({
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User'
        });
        userId = user._id;
        
        // Mock auth token
        authToken = 'Bearer test-token';
    });

    afterEach(async () => {
        await Consent.deleteMany({});
        await User.deleteMany({});
    });

    describe('POST /api/consents', () => {
        it('should create a new consent', async () => {
            const consentData = {
                userId: userId,
                consentType: 'data_processing',
                status: 'granted',
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            };

            const response = await request(app)
                .post('/api/consents')
                .set('Authorization', authToken)
                .send(consentData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.consentType).toBe('data_processing');
            expect(response.body.data.status).toBe('granted');
        });

        it('should return 400 for invalid consent data', async () => {
            const invalidData = {
                userId: userId,
                consentType: '',
                status: 'invalid_status'
            };

            const response = await request(app)
                .post('/api/consents')
                .set('Authorization', authToken)
                .send(invalidData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('validation');
        });
    });

    describe('GET /api/consents', () => {
        beforeEach(async () => {
            const consent = await Consent.create({
                userId: userId,
                consentType: 'data_processing',
                status: 'granted',
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            });
            consentId = consent._id;
        });

        it('should get all consents for user', async () => {
            const response = await request(app)
                .get('/api/consents')
                .set('Authorization', authToken)
                .query({ userId: userId })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].consentType).toBe('data_processing');
        });

        it('should return empty array for user with no consents', async () => {
            const newUser = await User.create({
                email: 'new@example.com',
                password: 'password123',
                name: 'New User'
            });

            const response = await request(app)
                .get('/api/consents')
                .set('Authorization', authToken)
                .query({ userId: newUser._id })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(0);
        });
    });

    describe('PUT /api/consents/:id', () => {
        beforeEach(async () => {
            const consent = await Consent.create({
                userId: userId,
                consentType: 'data_processing',
                status: 'granted',
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            });
            consentId = consent._id;
        });

        it('should update consent status', async () => {
            const updateData = {
                status: 'revoked'
            };

            const response = await request(app)
                .put(`/api/consents/${consentId}`)
                .set('Authorization', authToken)
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.status).toBe('revoked');
        });

        it('should return 404 for non-existent consent', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            
            const response = await request(app)
                .put(`/api/consents/${fakeId}`)
                .set('Authorization', authToken)
                .send({ status: 'revoked' })
                .expect(404);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('not found');
        });
    });

    describe('DELETE /api/consents/:id', () => {
        beforeEach(async () => {
            const consent = await Consent.create({
                userId: userId,
                consentType: 'data_processing',
                status: 'granted',
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            });
            consentId = consent._id;
        });

        it('should delete consent', async () => {
            const response = await request(app)
                .delete(`/api/consents/${consentId}`)
                .set('Authorization', authToken)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain('deleted');
        });

        it('should return 404 for non-existent consent', async () => {
            const fakeId = '507f1f77bcf86cd799439011';
            
            const response = await request(app)
                .delete(`/api/consents/${fakeId}`)
                .set('Authorization', authToken)
                .expect(404);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/consents/expired', () => {
        it('should get expired consents', async () => {
            await Consent.create({
                userId: userId,
                consentType: 'data_processing',
                status: 'granted',
                expiryDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Yesterday
            });

            const response = await request(app)
                .get('/api/consents/expired')
                .set('Authorization', authToken)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
        });
    });
});