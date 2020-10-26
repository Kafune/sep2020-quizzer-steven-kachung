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

export async function startQuiz() {
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
  .then(response => response.json())
}

export async function getTeams(quizId) {
  console.log(quizId)
  return fetch(serverFetchBase + '/quiz/' + quizId + '/teams/', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors',
  })
}