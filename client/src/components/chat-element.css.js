import { css } from 'lit'

export default css`
  :host {
    margin: 15px;
    width: 800px;
    height: 600px;
    display: block;
    position: relative;
  }
  
  .chat-input {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    transform: translate(-50%, -50%);
    z-index: 1;
  }

  .chat-input input {
    width: 250px;
    padding: 10px;
    outline: none;
    text-align: center;
  }

  .chat-input button {
    padding: 10px;
    margin-top: 10px;
  }
  
  .chat {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
  }
  
  .chat .left-box {
    width: 20%;
    height: 100%;
    margin-right: 10px;
    border: 1px solid #000;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .chat .left-box .user {
    padding: 10px;
    font-weight: bold;
    word-break: break-word;
  }

  .chat .right-box {
    width: 80%;
    height: 100%;
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    justify-content: space-between;
  }

  .chat .right-box .chat-box {
    height: 100%;
    padding: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    border: 1px solid #000;
  }

  .chat .right-box .chat-box .message {
    word-break: break-word;
  }

  .chat .right-box .input-box {
    margin-top: 10px;
  }

  .chat .right-box .input-box input {
    width: 100%;
    padding: 5px;
    outline: none;
    border: 1px solid #000;
    box-sizing: border-box;
  }
`

