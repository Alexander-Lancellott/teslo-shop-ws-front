import { connectToServer } from './socket-client';
import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h2> Websocket - Client </h2>

    <input id='jwt-token' placeholder='Json Web Token' />

    <button id='btn-connect'>Connect</button>
    <br/>
    <br/>
    <strong>Status:</strong>
    <span id='server-status' class='red' >offline</span>

    <ul id='clients-ul'></ul>

    <form id='message-form'>
      <input placeholder='message' id='message-input' />
    </form> 

    <h3>Messages</h3>
    <ul id='messages-ul'></ul>

  </div>
`;

//connectToServer();

const jwtToken = document.querySelector<HTMLInputElement>('#jwt-token')!;
const btnConnect = document.querySelector<HTMLButtonElement>('#btn-connect')!;

btnConnect.addEventListener('click', () => {
  const jwtRegExp = /^[A-Za-z0-9_-]{2,}(?:\.[A-Za-z0-9_-]{2,}){2}$/;
  if (!jwtRegExp.test(jwtToken.value.trim())) return alert('Enter a valid JWT');

  connectToServer(jwtToken.value.trim());
});
