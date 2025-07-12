const request = require('supertest');
const app = require('../../backend/app');
const User = require('../../backend/models/User');
const jwt = require('jsonwebtoken');

// Mock the User model
jest.mock('../../backend/models/User');

describe('User Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/users/register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890'
            };

            User.findOne.mockResolvedValue(null);
            User.prototype.save = jest.fn().mockResolvedValue({
                _id: '123',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890'
            });

            const response = await request(app)
                .post('/api/users/register')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User registered successfully');
        });

        it('should return error if user already exists', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                phone: '1234567890'
            };

            User.findOne.mockResolvedValue({ email: 'john@example.com' });

            const response = await request(app)
                .post('/api/users/register')
                .send(userData);

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User already exists');
        });

        it('should return error for invalid input', async () => {
            const response = await request(app)
                .post('/api/users/register')
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/users/login', () => {
        it('should login user successfully', async () => {
            const loginData = {
                email: 'john@example.com',
                password: 'password123'
            };

            const mockUser = {
                _id: '123',
                email: 'john@example.com',
                name: 'John Doe',
                comparePassword: jest.fn().mockResolvedValue(true)
            };

            User.findOne.mockResolvedValue(mockUser);

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
        });

        it('should return error for invalid credentials', async () => {
            const loginData = {
                email: 'john@example.com',
                password: 'wrongpassword'
            };

            User.findOne.mockResolvedValue(null);

            const response = await request(app)
                .post('/api/users/login')
                .send(loginData);

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid credentials');
        });
    });

    describe('GET /api/users/profile', () => {
        it('should get user profile successfully', async () => {
            const mockUser = {
                _id: '123',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890'
            };

            User.findById.mockResolvedValue(mockUser);

            const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET || 'test_secret');

            const response = await request(app)
                .get('/api/users/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.user).toEqual(mockUser);
        });

        it('should return error without token', async () => {
            const response = await request(app)
                .get('/api/users/profile');

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });

    describe('PUT /api/users/profile', () => {
        it('should update user profile successfully', async () => {
            const updateData = {
                name: 'Jane Doe',
                phone: '9876543210'
            };

            const mockUser = {
                _id: '123',
                name: 'John Doe',
                email: 'john@example.com',
                phone: '1234567890'
            };

            User.findByIdAndUpdate.mockResolvedValue({
                ...mockUser,
                ...updateData
            });

            const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET || 'test_secret');

            const response = await request(app)
                .put('/api/users/profile')
                .set('Authorization', `Bearer ${token}`)
                .send(updateData);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Profile updated successfully');
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete user successfully', async () => {
            User.findByIdAndDelete.mockResolvedValue({
                _id: '123',
                name: 'John Doe'
            });

            const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET || 'test_secret');

            const response = await request(app)
                .delete('/api/users/123')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User deleted successfully');
        });

        it('should return error if user not found', async () => {
            User.findByIdAndDelete.mockResolvedValue(null);

            const token = jwt.sign({ userId: '123' }, process.env.JWT_SECRET || 'test_secret');

            const response = await request(app)
                .delete('/api/users/123')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User not found');
        });
    });
});