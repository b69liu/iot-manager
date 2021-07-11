/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { IoTRegistryContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('IoTRegistryContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new IoTRegistryContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"io t registry 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"io t registry 1002 value"}'));
    });

    describe('#ioTRegistryExists', () => {

        it('should return true for a io t registry', async () => {
            await contract.ioTRegistryExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a io t registry that does not exist', async () => {
            await contract.ioTRegistryExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createIoTRegistry', () => {

        it('should create a io t registry', async () => {
            await contract.createIoTRegistry(ctx, '1003', 'io t registry 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"io t registry 1003 value"}'));
        });

        it('should throw an error for a io t registry that already exists', async () => {
            await contract.createIoTRegistry(ctx, '1001', 'myvalue').should.be.rejectedWith(/The io t registry 1001 already exists/);
        });

    });

    describe('#readIoTRegistry', () => {

        it('should return a io t registry', async () => {
            await contract.readIoTRegistry(ctx, '1001').should.eventually.deep.equal({ value: 'io t registry 1001 value' });
        });

        it('should throw an error for a io t registry that does not exist', async () => {
            await contract.readIoTRegistry(ctx, '1003').should.be.rejectedWith(/The io t registry 1003 does not exist/);
        });

    });

    describe('#updateIoTRegistry', () => {

        it('should update a io t registry', async () => {
            await contract.updateIoTRegistry(ctx, '1001', 'io t registry 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"io t registry 1001 new value"}'));
        });

        it('should throw an error for a io t registry that does not exist', async () => {
            await contract.updateIoTRegistry(ctx, '1003', 'io t registry 1003 new value').should.be.rejectedWith(/The io t registry 1003 does not exist/);
        });

    });

    describe('#deleteIoTRegistry', () => {

        it('should delete a io t registry', async () => {
            await contract.deleteIoTRegistry(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a io t registry that does not exist', async () => {
            await contract.deleteIoTRegistry(ctx, '1003').should.be.rejectedWith(/The io t registry 1003 does not exist/);
        });

    });

});
