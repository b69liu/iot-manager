const express = require("express");
const cors = require('cors');
// const path = require("path");
const mongoose = require("mongoose");
const {signIn, signUp} = require("./controllers/user");
const {
  getDeviceInfo,
  getAllDeviceInfo,
  registerDevice,
  setControllerForDevice,
  sendCommandToDevice
} = require("./controllers/iotContract");
const {auth} = require("./services/auth");

// Mongodb
// https://cloud.mongodb.com/v2/6067cbe29f1a3467c7021770#clusters?fastPoll=true
// calebliu543 678liucaleb
// const connectionString =
// "mongodb+srv://calebliu543:678liucaleb@cluster0.i2z66.mongodb.net/musicapp?retryWrites=true&w=majority";
const connectionString ="mongodb://appUser:user009@localhost:27017/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false";
// // const clusterWorkerSize = os.cpus().length;
// // There is no need to use multicores for this demo
// const clusterWorkerSize = 1;


// wrapped server start code
function startServer() {
  const app = express();
  const http = require("http").Server(app);
  mongoose.connect(connectionString, { useNewUrlParser: true,  useUnifiedTopology: true  }).then(
    () => {
      console.log("Mongoose connected successfully ");
    },
    (error) => {
      console.log("Mongoose could not connect to database: " + error);
    }
  );
    
    // http requests
  app.use(cors());
//   app.use(express.static(path.join(__dirname, "./staticweb")));
  app.use(express.json());
  app.all('/private/*', (req, res, next) => auth(req, res, next));
  app.use("/sign_in", signIn);
  app.use("/private/sign_up", signUp);

  app.get("/test",(req,res)=>res.status(200).send("success"));
  app.get("/private/getDeviceInfo",getDeviceInfo);
  app.get("/private/getAllDeviceInfo",getAllDeviceInfo);
  
  app.post("/private/registerDevice",registerDevice);
  app.post("/private/setControllerForDevice",setControllerForDevice);
  app.post("/private/sendCommandToDevice",sendCommandToDevice);


  let port = process.env.PORT || "8080";
  http.listen(port, () => {
    console.log(`listen on port: ${port} with the pid: ${process.pid}`);
  });
}

startServer();
