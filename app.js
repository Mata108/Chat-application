const express=require("express")
const app=express()
const Path=require("path") 
const Port= process.env.Port || 8000


const server=app.listen(Port,()=>{
      console.log(`server running on localhost: ${Port}`)
    })

app.use(express.static(Path.join(__dirname,'Public')))
const io = require('socket.io')(server)

let socketsConected = new Set()

io.on('connection', onConnected)



function onConnected(socket) {
  console.log('Socket connected', socket.id)
  socketsConected.add(socket.id)
  io.emit('clients-total', socketsConected.size)

  socket.on('disconnect', () => {
    console.log('Socket disconnected', socket.id)
    socketsConected.delete(socket.id)
    io.emit('clients-total', socketsConected.size)
  })
  socket.on('message', (data) => {
    // console.log(data)
    socket.broadcast.emit('chat-message', data)
  })

  socket.on('feedback', (data) => {
    socket.broadcast.emit('feedback', data)
  })

}


