const User = require('../model/User');
const {
    registerNewIot,
    setController,
    sendCommand,
    getIotInfo,
    getAllIotInfo
} = require('../services/invokeContract');

const getDeviceInfo = async (req, res) => {
    const {userId, role} = req;
    const {iotId} = req.query;
    if( !['admin','user'].includes(role) ){
        return res.status(403).json({message:`Not permitted account role: ${role}`});
    }
    let result = await getIotInfo(iotId);
    if(result){
        result = JSON.parse(result);
    }
    return res.status(200).json({data:result});

}

const getAllDeviceInfo = async (req, res) => {
    const {userId, role} = req;
    if( !['admin','user'].includes(role) ){
        return res.status(403).json({message:`Not permitted account role: ${role}`});
    }
    let result = await getAllIotInfo();
    if(result){
        result = JSON.parse(result);
    }
    return res.status(200).json({data:result});

}

const registerDevice = async (req, res) => {
    const {userId, role} = req;
    const {iotId, iotName} = req.body;
    if(role!=='admin'){
        return res.status(403).json({message:"Not admin account."});
    }
    const result = await registerNewIot(iotId, iotName, (new Date()).toISOString());
    if(result){
        return res.status(201).json({message:`success`});
    }else{
        return res.status(500).json({message:`failed`});
    }
    

}

const setControllerForDevice = async (req, res) => {
    const {userId, role} = req;
    const {iotId, controllerId} = req.body;
    if(role!=='admin'){
        return res.status(403).json({message:"Not admin account."});
    }
    const result = await setController(iotId, controllerId);
    if(result){
        return res.status(201).json({message:`success`});
    }else{
        return res.status(500).json({message:`failed`});
    }
}


const sendCommandToDevice = async (req, res) => {
    const {userId, role} = req;
    const {iotId, command} = req.body;
    const result = await sendCommand(iotId, userId, command);
    if(result){
        return res.status(201).json({message:`success`});
    }else{
        return res.status(500).json({message:`failed`});
    }
}


module.exports = {
    getDeviceInfo,
    getAllDeviceInfo,
    registerDevice,
    setControllerForDevice,
    sendCommandToDevice,
};