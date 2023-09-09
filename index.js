const express = require('express');
const InspectModule = require("docxtemplater/js/inspect-module");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");

const fs = require("fs");

app.use(express.static(path.join(__dirname)));


const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  
})

server.listen(port, host, () => {
    console.log('listening on *:3000');
  });


io.on("connection", (socket) => {
   
   socket.on("sendToBack", (content)=>{
    const iModule = InspectModule();
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip, { modules: [iModule], delimiters: { start: "[", end: "]"}}, );
    const tags = iModule.getAllTags();
    console.log(tags);
    socket.emit("sendToFront", tags, content)

   })
});
