const port = 3000;
const serverHostname = `${window.location.hostname}:${port}`
const serverFetchBase = `${window.location.protocol}//${serverHostname}`

let theSocket;

export function openWebSocket() {
  if (theSocket) {
    theSocket.onerror = null;
    theSocket.onopen = null;
    theSocket.onclose = null;
    theSocket.close();
  }
  console.log("Opening socket for", `ws://${serverHostname}`);
  theSocket = new WebSocket(`ws://${serverHostname}`);
  return theSocket;
}

export function getWebSocket() {
  if (theSocket) {
    return theSocket;
  }
  else {
    throw new Error("The websocket has not been opened yet.")
  }
}

export function startQuiz() {
  console.log(serverFetchBase + '/quiz');

  const requestBody = { role: 'quizmaster' };
  return fetch(serverFetchBase + '/quiz', {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors',
  })
  .then(response => console.log(response));
}