import express from 'express'
import httpServer from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()
app.use(cors())

let isAnswer = false
const AI = []

const http =  httpServer.createServer(app)
const users = {
  BOT: { name: 'BOT (SM)' }
}

http.listen(3000, () => console.log('Listening on *:3000'))

const io = new Server(http, {
  cors: {
    origin: '*'
  }
})

io.on('connection', (socket) => {

  if (!users[socket.id]) users[socket.id] = {}

  socket.on('event:connect', (name) => {
    const message = `${name} connected to chat`
    console.log(message)
    users[socket.id].name = name
    io.emit('event:users', users, message)
  })

  socket.on('disconnect', () => {
    const message = `${users[socket.id].name} disconnected from chat`
    console.log(message)
    delete users[socket.id]
    io.emit('event:users', users, message)
  })

  socket.on('event:new-message', (message) => {
    const content = message.split(':')[1].trim()

    let index = AI.findLastIndex(val => [content.toLowerCase()].includes(val.A.toLowerCase()))
    
    const length = AI.length - 1
    if (AI.length > 0 && AI[length].Q === null && AI[length].ID !== socket.id) {
      AI[length].Q = content
    }

    socket.broadcast.emit('event:new-message', message)

    if (index > -1 && AI[index].Q) {
      io.emit('event:new-message', `Awesome Bot: ${AI[index].Q}`)
    } else if (content.endsWith('?')) {
      AI.push({ ID: socket.id, A: content, Q: null })
    }

  })

})
