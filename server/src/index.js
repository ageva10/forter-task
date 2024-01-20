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

function commonWordsPercentage(array1, array2) {
  if (array1.length === 0 || array2.length === 0) return 0
  const commonWords = array1.filter(w1 => {
    const regex = new RegExp('\\b' + w1 + '\\b', 'i')
    return array2.some(w2 => regex.test(w2))
  })
  return (commonWords.length / Math.min(array1.length, array2.length)) * 100
}

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
    const splitMessage = content.split(' ')

    const length = AI.length

    if (length > 0 && AI[length - 1].Q === null && AI[length - 1].ID !== socket.id) {
      AI[length - 1].Q = content
    }

    let index = -1
    for (let i = 0; i < length; i++) {
      const percentage = commonWordsPercentage(AI[i].A, splitMessage)
      if (percentage >= 50) {
        index = i
      }
    }

    socket.broadcast.emit('event:new-message', message)

    if (index > -1 && AI[index].Q) {
      io.emit('event:new-message', `Awesome Bot: ${AI[index].Q}`)
    } else if (content.endsWith('?')) {
      if (AI.length > 0 && AI[length - 1].Q === null) AI.splice(length - 1, 1)
      AI.push({ ID: socket.id, A: content.split(' '), Q: null })
    }

    console.log(AI)

  })

})
