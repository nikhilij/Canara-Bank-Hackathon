const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const authController = require('../../controllers/authController');

// Mock dependencies
jest.mock('../../models/User');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.post('/register', authController.register);
app.post('/login', authController.login);

describe('Auth Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /register', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.prototype.save = jest.fn().mockResolvedValue({
                _id: 'userId',
                name: userData.name,
                email: userData.email
            });

            const response = await request(app)
                .post('/register')
                .send(userData);

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully');
            expect(User.findOne).toHaveBeenCalledWith({ email: userData.email });
            expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
        });

        it('should return 400 if user already exists', async () => {
            const userData = {
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue({ email: userData.email });

            const response = await request(app)
                .post('/register')
                .send(userData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('User already exists');
        });
    });

    describe('POST /login', () => {
        it('should login user successfully', async () => {
            const loginData = {
                email: 'john@example.com',
                password: 'password123'
            };

            const mockUser = {
                _id: 'userId',
                email: loginData.email,
                password: 'hashedPassword'
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');

            const response = await request(app)
                .post('/login')
                .send(loginData);

            expect(response.status).toBe(200);
            expect(response.body.token).toBe('mockToken');
            expect(User.findOne).toHaveBeenCalledWith({ email: loginData.email });
            expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
        });

        it('should return 401 for invalid credentials', async () => {
            const loginData = {
                email: 'john@example.com',
                password: 'wrongpassword'
            };

            User.findOne.mockResolvedValue(null);

            const response = await request(app)
                .post('/login')
                .send(loginData);

            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid credentials');
        });
    });
});