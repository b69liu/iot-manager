/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class IoTRegistryContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const devices = [
            {
                iotId: "1",
                iotName: "monitorA",
                controllerId: "1",
                registerTime: new Date()
            },
            
        ];

        for (let i = 0; i < devices.length; i++) {
            await ctx.stub.putState(devices[i].iotId, Buffer.from(JSON.stringify(devices[i])));
            console.info('Added <--> ', devices[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }
    

    async registerNewIot(ctx, iotId, iotName, registerTime) {
        const buffer = await ctx.stub.getState(iotId);
        if(buffer && buffer.length > 0){
            throw new Error(`The iot device ${iotId} already exists`);
        };
        const iot = {
            iotId,
            iotName,
            controllerId: null,
            registerTime
        };
        const newBuffer = Buffer.from(JSON.stringify(iot));
        await ctx.stub.putState(iotId, newBuffer);
    }

    async setController(ctx, iotId, controllerId) {
        const buffer = await ctx.stub.getState(iotId);
        if(!buffer || buffer.length == 0){
            throw new Error(`The iot device ${iotId} not exists`);
        };
        const iot = JSON.parse(buffer.toString());
        iot.controllerId = controllerId;
        const newBuffer = Buffer.from(JSON.stringify(iot));
        await ctx.stub.putState(iotId, newBuffer);
    }

    async getIotInfo(ctx, iotId) {
        const buffer = await ctx.stub.getState(iotId);
        if(!buffer || buffer.length == 0){
            throw new Error(`The iot device ${iotId} not exists`);
        };
        const iotJsonString = buffer.toString();
        return iotJsonString;
    }

    async queryAllDevices(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async sendCommand(ctx, iotId, controllerId, command) {
        const buffer = await ctx.stub.getState(iotId);
        if(!buffer || buffer.length == 0 ){
            throw new Error(`The iot device ${iotId} not exists`);
        };
        const iot = JSON.parse(buffer.toString());
        if(iot.controllerId !== controllerId){
            throw new Error(`The iot device ${iotId} does not belong to the controller ${controllerId}`);
        }
        const eventPayloadBuffer = new Buffer.from(JSON.stringify({
            iotId,
            controllerId,
            command
        }))
        ctx.stub.setEvent("command", eventPayloadBuffer);
        return "command sent";
    }

    // async updateIoTRegistry(ctx, ioTRegistryId, newValue) {
    //     const exists = await this.ioTRegistryExists(ctx, ioTRegistryId);
    //     if (!exists) {
    //         throw new Error(`The io t registry ${ioTRegistryId} does not exist`);
    //     }
    //     const asset = { value: newValue };
    //     const buffer = Buffer.from(JSON.stringify(asset));
    //     await ctx.stub.putState(ioTRegistryId, buffer);
    // }

    // async deleteIoTRegistry(ctx, ioTRegistryId) {
    //     const exists = await this.ioTRegistryExists(ctx, ioTRegistryId);
    //     if (!exists) {
    //         throw new Error(`The io t registry ${ioTRegistryId} does not exist`);
    //     }
    //     await ctx.stub.deleteState(ioTRegistryId);
    // }

}

module.exports = IoTRegistryContract;
