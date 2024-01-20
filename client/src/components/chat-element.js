import { LitElement, html } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { io } from 'https://cdn.socket.io/4.4.1/socket.io.esm.min.js'
import { styleMap } from 'lit/directives/style-map.js'
import style from './chat-element.css.js'

class ChatElement extends LitElement {
  static styles = [style]

  static properties = {
    users: { type: Array },
    connected: { type: Boolean },
    messages: { type: Array },
    newMessage: { type: String },
    userColor: { type: String }
  }

  constructor() {
    super()
    this.socket = null
    this.connected = false
    this.users = []
    this.name = null
    this.messages = []
    this.newMessage = ''
    this.userColor = { color: 'blue' }
  }

  listenToChat() {
    if (!this.name) return

    this.socket = io('http://localhost:3000', {
      reconnection: false,
      extraHeaders: {
        'Access-Control-Allow-Origin': '*'
      }
    })

    this.socket.emit('event:connect', this.name)

    this.socket.on('event:users', (users, message) => {
      this.users = users
      this.connected = true
      this.setMessage(unsafeHTML(message))
    })

    this.socket.on('event:new-message', (message) => {
      this.setMessage(unsafeHTML(message))
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected')
      this.connected = false
      this.users = []
      this.messages = []
    })
  }

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      const userMessageString = String.raw`<b>${this.name}</b>: ${this.newMessage}`
      const userMessage = html`${unsafeHTML(userMessageString)}`

      this.socket.emit('event:new-message', userMessageString)
      this.setMessage(userMessage)
      this.newMessage = ''
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatBox = this.shadowRoot.getElementById('chat-box')
      chatBox.scrollTop = chatBox.scrollHeight
    }, 0)
  }

  setMessage(message) {
    this.messages = [...this.messages, message].filter(Boolean)
    this.scrollToBottom()
  }

  handleName(e) {
    this.name = e.target.value
  }

  handleInput(e) {
    this.newMessage = e.target.value
  }

  handleKeyUp(e) {
    if (e.key === 'Enter') {
      this.sendMessage()
    }
  }

  render() {
    return html`
      ${!this.connected
        ? html`
          <div class="chat-input">
            <input
              type="text"
              name="input"
              placeholder="Enter your name"
              .value="${this.name}"
              @input="${this.handleName}"
              autofocus
            />
            <button @click="${this.listenToChat}">Connect</button>
          </div>
        `
        : html`
          <div class="chat">
            <div class="left-box">
              ${Object.values(this.users).map(user => 
                html`<div class="user" style=${styleMap(user.name === this.name ? this.userColor : {})}>${user.name}</div>`
              )}
            </div>
            <div class="right-box">
              <div class="chat-box" id="chat-box">
                ${this.messages.map(
                  (message) => html`<div class="message">${message}</div>`
                )}
              </div>
              <div class="input-box">
                <input 
                  type="text"
                  name="input"
                  placeholder="Type your message..."
                  .value="${this.newMessage}"
                  @input="${this.handleInput}"
                  @keyup="${this.handleKeyUp}"
                />
              </div>
            </div>
          </div>
      `}
    `
  }
}

customElements.define('chat-element', ChatElement)
