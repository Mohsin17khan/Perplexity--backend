import app from './src/app.js'
import { connectToDb } from './src/config/database.connect.js';
import { initSocket } from './src/sockets/server.socket.js';
import  http  from "http"
// import { createServer } from "http";
// import { Server } from "socket.io";

connectToDb();

const httpServer =  http.createServer(app);
initSocket(httpServer)
// const httpServer = createServer(app);
// const io = new Server(httpServer, { /* options */ });

// io.on("connection", (socket) => {
  
//     socket.on("message",(msg)=>{    
//         console.log("Message event listen");
//         console.log(msg);
//         io.emit("abc",msg) // ek user message bhejega with event is message then ek abc bi jaiga dusra user ushe abc ko listetn 
//         // kar raha hai jab koi data user first s jaiga second user use dekh sakta hai
//     })
// });

// httpServer.listen(3000,()=>{
//     console.log("Server is running..")
// });


httpServer.listen(3000,()=>{
    console.log("Server is running...")
})


