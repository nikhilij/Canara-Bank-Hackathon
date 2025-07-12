const { expect } = require('chai');
const sinon = require('sinon');
const BlockchainService = require('../../backend/services/blockchainService');

describe('BlockchainService', () => {
    let blockchainService;
    let mockWeb3;
    let mockContract;

    beforeEach(() => {
        mockContract = {
            methods: {
                addRecord: sinon.stub(),
                getRecord: sinon.stub(),
                updateRecord: sinon.stub()
            }
        };
        
        mockWeb3 = {
            eth: {
                Contract: sinon.stub().returns(mockContract),
                getAccounts: sinon.stub().resolves(['0x123', '0x456'])
            }
        };
        
        blockchainService = new BlockchainService(mockWeb3);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('addRecord', () => {
        it('should add a new record to blockchain', async () => {
            const recordData = { id: '1', data: 'test' };
            mockContract.methods.addRecord.returns({
                send: sinon.stub().resolves({ transactionHash: '0xabc123' })
            });

            const result = await blockchainService.addRecord(recordData);
            
            expect(result).to.have.property('transactionHash');
            expect(mockContract.methods.addRecord).to.have.been.calledWith(recordData);
        });

        it('should throw error when adding record fails', async () => {
            const recordData = { id: '1', data: 'test' };
            mockContract.methods.addRecord.returns({
                send: sinon.stub().rejects(new Error('Transaction failed'))
            });

            await expect(blockchainService.addRecord(recordData)).to.be.rejected;
        });
    });

    describe('getRecord', () => {
        it('should retrieve a record from blockchain', async () => {
            const recordId = '1';
            const expectedRecord = { id: '1', data: 'test' };
            mockContract.methods.getRecord.returns({
                call: sinon.stub().resolves(expectedRecord)
            });

            const result = await blockchainService.getRecord(recordId);
            
            expect(result).to.deep.equal(expectedRecord);
            expect(mockContract.methods.getRecord).to.have.been.calledWith(recordId);
        });

        it('should return null when record not found', async () => {
            const recordId = '999';
            mockContract.methods.getRecord.returns({
                call: sinon.stub().resolves(null)
            });

            const result = await blockchainService.getRecord(recordId);
            
            expect(result).to.be.null;
        });
    });

    describe('updateRecord', () => {
        it('should update an existing record', async () => {
            const recordId = '1';
            const updateData = { data: 'updated' };
            mockContract.methods.updateRecord.returns({
                send: sinon.stub().resolves({ transactionHash: '0xdef456' })
            });

            const result = await blockchainService.updateRecord(recordId, updateData);
            
            expect(result).to.have.property('transactionHash');
            expect(mockContract.methods.updateRecord).to.have.been.calledWith(recordId, updateData);
        });
    });

    describe('isConnected', () => {
        it('should return true when blockchain is connected', async () => {
            mockWeb3.eth.getAccounts.resolves(['0x123']);
            
            const isConnected = await blockchainService.isConnected();
            
            expect(isConnected).to.be.true;
        });

        it('should return false when blockchain is not connected', async () => {
            mockWeb3.eth.getAccounts.rejects(new Error('Connection failed'));
            
            const isConnected = await blockchainService.isConnected();
            
            expect(isConnected).to.be.false;
        });
    });
});