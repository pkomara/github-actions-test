const express = require("express");
const {createServer} = require('http');
const {Server} = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
    // ...
    console.log(socket.id);
  
    socket.on('disconnect',async ()=>{
        console.log("User Disconnected =",socket.id);
        let usersList = await updateUsers();
        io.emit("usersUpdated",usersList);
    });

    socket.emit("Welcome", 'Welcome !!!');

    updateUsers= async ()=>{
        let socketList= await io.allSockets();
        let usersList =[];
        socketList.forEach(user=>{ usersList.push(user)});
        return usersList;
    }
    socket.on("newUser",async()=>{
        let usersList = await updateUsers();
        io.emit("usersUpdated",usersList);
    })
    socket.on("sendMsg",(data)=>{
        console.log(data);
        io.emit('groupMessage',data)
    })

    

  });
  app.get("/",(req,res)=>{
      const filePath =__dirname;
      console.log(filePath)
      res.sendFile(filePath+"/client/index.html");
  })
  httpServer.listen(3000,(err)=>{
      if(err){
          console.log(err);
      }
      else{
          console.log("Server running on port 3000");
      }
  });