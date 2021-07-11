/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const { Gateway, Wallets, DefaultEventHandlerStrategies } = require('fabric-network');
const fs = require('fs');
const path = require('path');


let gateway = null;
let contract = null;
async function connect(){
    // load the network configuration
    const ccpPath = path.resolve(__dirname, 'connection-org1.json');
    let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new file system based wallet for managing identities.
    const walletPath = path.resolve(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // for event listener
    const connectOptions = {
        eventHandlerOptions: {
            strategy: DefaultEventHandlerStrategies.MSPID_SCOPE_ALLFORTX
        },
        wallet, 
        identity: 'appUser', 
        discovery: { enabled: true, asLocalhost: true } 
    }
    gateway = new Gateway();
    await gateway.connect(ccp, connectOptions);
    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network.
    contract = network.getContract('iotregistry');
    process.on("exit",async ()=>{
        console.log("disconnecting...");
        await gateway.disconnect();
    });
    return contract;
}





async function invoke(method, ...paramters) {
    try {
        // // load the network configuration
        // const ccpPath = path.resolve(__dirname, 'connection-org1.json');
        // let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // // Create a new file system based wallet for managing identities.
        // const walletPath = path.resolve(__dirname, 'wallet');
        // const wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // // Check to see if we've already enrolled the user.
        // const identity = await wallet.get('appUser');
        // if (!identity) {
        //     console.log('An identity for the user "appUser" does not exist in the wallet');
        //     console.log('Run the registerUser.js application before retrying');
        //     return;
        // }

        // // Create a new gateway for connecting to our peer node.
        // const gateway = new Gateway();
        // await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // // Get the network (channel) our contract is deployed to.
        // const network = await gateway.getNetwork('mychannel');

        // // Get the contract from the network.
        // const contract = network.getContract('iotregistry');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR12', 'Dave')
        await contract.submitTransaction(method, ...paramters);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        // await gateway.disconnect();
        return true;

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return false;
    }
}

async function query(method, ...paramters) {
    try {
        // // load the network configuration
        // const ccpPath = path.resolve(__dirname, 'connection-org1.json');
        // let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // // Create a new file system based wallet for managing identities.
        // const walletPath = path.resolve(__dirname, 'wallet');
        // const wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);

        // // Check to see if we've already enrolled the user.
        // const identity = await wallet.get('appUser');
        // if (!identity) {
        //     console.log('An identity for the user "appUser" does not exist in the wallet');
        //     console.log('Run the registerUser.js application before retrying');
        //     return;
        // }

        // // Create a new gateway for connecting to our peer node.
        // const gateway = new Gateway();
        // await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // // Get the network (channel) our contract is deployed to.
        // const network = await gateway.getNetwork('mychannel');

        // // Get the contract from the network.
        // const contract = network.getContract('iotregistry');

        // Evaluate the specified transaction.
        // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
        // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
        const result = await contract.evaluateTransaction(method, ...paramters);
        console.log(`Transaction has been evaluated, result is: ${result.toString()}`);

        // Disconnect from the gateway.
        // await gateway.disconnect();
        return result.toString();
        
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        return '';
    }
}

async function registerNewIot(iotId, iotName, registerTime) {
    return invoke("registerNewIot", iotId, iotName, registerTime);
}

async function setController(iotId, controllerId) {
    return invoke("setController", iotId, controllerId);
}

async function sendCommand(iotId, controllerId, command) {
    return invoke("sendCommand", iotId, controllerId, command);
}

async function getIotInfo(iotId) {
    const result = await query("getIotInfo", iotId);
    return result;
}

async function getAllIotInfo(iotId) {
    const result = await query("queryAllDevices");
    return result;
}




// if this one report "ENDORSEMENT_POLICY_FAILURE" please check ${CORE_PEER_LOCALMSPID} and make sure you are the correct orgnization
// if it still not working, then check your docker log
// Be careful about the paths of certificate file
async function startCommandListener(){
    

    const listener = async (event) => {
        if (event.eventName === 'command') {
            const details = event.payload.toString('utf8');
            // Run business process to handle orders
            console.log("command:",details);
        }
    };
    process.on('exit', async()=>{
        // Disconnect from the gateway.
        await gateway.disconnect();
    });

    return contract.addContractListener(listener);
}

async function init(){
    await connect();
    startCommandListener();
}
// async function test(){
//     await startCommandListener();
//     await sendCommand('1', '1', 'go go go');
// }
// registerNewIot("2", "MonitorB")
// getIotInfo('1').then((value)=>console.log(value));
// getAllIotInfo().then((value)=>console.log(value));

// sendCommand('1', '1', 'go go go');
// test();

init();
module.exports = {
    registerNewIot,
    setController,
    sendCommand,
    getIotInfo,
    getAllIotInfo
};

