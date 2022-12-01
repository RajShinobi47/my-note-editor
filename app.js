const express = require("express"); // Access
const socket = require("socket.io");

const app = express(); // Application will get initialized and server will get ready.

app.use(express.static("public"));

let port = process.env.PORT || 3000;
let server = app.listen(port, () => {
    console.log("Listening to port " + port);
});

let io = socket(server); // initialized socket

io.on("connection", (socket) => { 
    console.log("Made socket connection");

    // Received data
    socket.on("beginPath", (data) => {
        // data -> data from frontend
        // Now tranfer data to all the connected computers
        io.sockets.emit("beginPath", data); 
    })

    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    })

    socket.on("redoUndo", (data) => {
        io.sockets.emit("redoUndo", data);
    })
})
