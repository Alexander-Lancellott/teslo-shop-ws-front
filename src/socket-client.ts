import { Manager, Socket } from 'socket.io-client';

let socket: Socket;

export const connectToServer = (token: string) => {
  const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
    extraHeaders: {
      authorization: token,
    },
  });
  socket?.removeAllListeners();
  socket = manager.socket('/');

  addListeners(socket);
};

const addListeners = (socket: Socket) => {
  const clientsUl = document.querySelector<HTMLUListElement>('#clients-ul')!;
  const messageForm = document.querySelector<HTMLFormElement>('#message-form')!;
  const messageInput =
    document.querySelector<HTMLInputElement>('#message-input')!;
  const messagesUl = document.querySelector<HTMLUListElement>('#messages-ul')!;
  const serverStatusLabel =
    document.querySelector<HTMLSpanElement>('#server-status')!;

  socket.on('connect', () => {
    serverStatusLabel.innerHTML = 'connected';
    serverStatusLabel.className = 'green';
  });

  let clientHtml = '';

  socket.on('disconnect', () => {
    serverStatusLabel.innerHTML = 'disconnect';
    serverStatusLabel.className = 'red';
    clientHtml = '';
  });

  socket.on('clients-updated', (clients: string[]) => {
    clientHtml = '';
    clients.forEach((clientId) => {
      clientHtml += `<li>${clientId}</li>`;
    });

    clientsUl.innerHTML = clientHtml;
  });

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (messageInput.value.trim().length <= 0) return;

    socket.emit('message-from-client', {
      id: '',
      message: messageInput.value,
    });
  });

  socket.on(
    'message-from-server',
    (payload: { fullName: string; message: string }) => {
      const newMessage = `
        <li>
          <strong>${payload.fullName}</strong>
          <span>${payload.message}</span>
        </li>
      `;
      const li = document.createElement('li');
      li.innerHTML = newMessage;
      messagesUl.append(li);
    }
  );
};
