const { TokenizationService } = require('../../src/services/tokenizationService');

describe('TokenizationService', () => {
    let tokenizationService;

    beforeEach(() => {
        tokenizationService = new TokenizationService();
    });

    describe('tokenizeCardNumber', () => {
        it('should tokenize a valid card number', () => {
            const cardNumber = '4111111111111111';
            const token = tokenizationService.tokenizeCardNumber(cardNumber);
            
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token).not.toBe(cardNumber);
        });

        it('should return different tokens for different card numbers', () => {
            const cardNumber1 = '4111111111111111';
            const cardNumber2 = '4222222222222222';
            
            const token1 = tokenizationService.tokenizeCardNumber(cardNumber1);
            const token2 = tokenizationService.tokenizeCardNumber(cardNumber2);
            
            expect(token1).not.toBe(token2);
        });

        it('should throw error for invalid card number', () => {
            const invalidCardNumber = '123';
            
            expect(() => {
                tokenizationService.tokenizeCardNumber(invalidCardNumber);
            }).toThrow();
        });
    });

    describe('detokenizeCardNumber', () => {
        it('should detokenize a valid token', () => {
            const cardNumber = '4111111111111111';
            const token = tokenizationService.tokenizeCardNumber(cardNumber);
            const detokenizedCardNumber = tokenizationService.detokenizeCardNumber(token);
            
            expect(detokenizedCardNumber).toBe(cardNumber);
        });

        it('should throw error for invalid token', () => {
            const invalidToken = 'invalid-token';
            
            expect(() => {
                tokenizationService.detokenizeCardNumber(invalidToken);
            }).toThrow();
        });
    });
});