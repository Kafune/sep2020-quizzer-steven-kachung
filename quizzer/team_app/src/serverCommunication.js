
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

function checkFetchError(response) {
  return response.ok
    ? response.json()
    : Promise.reject(new Error('Unexpected response'));
}

//send team
export async function startLogin(teamName, password, quizId) {
  const body = {
    "name": teamName,
    "password": password
  };
  const fetchOptions = {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors'
  }
  return fetch(serverFetchBase + '/quiz/' + quizId + '/teams', fetchOptions)
    .then(response => checkFetchError(response));
}

export async function getQuizInfo(password) {
  console.log(serverFetchBase + '/quiz/' + password);
  return fetch(serverFetchBase + '/quiz/' + password, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors'
  })
    .then(response => checkFetchError(response));
}

export async function changeTeamName(quizId, oldName, newName) {
  const body = {
    "name": newName,
  };
  return fetch(serverFetchBase + '/quiz/' + quizId + '/teams/' + oldName, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors'
  })
    .then((response) => checkFetchError(response))
}

export async function getCurrentQuestion(quizId) {
  return fetch(serverFetchBase + '/quiz/' + quizId + '/questions/', {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  })
    .then(response => checkFetchError(response))
}

export async function submitAnswer(quizId, teamName, answer) {
  return fetch(serverFetchBase + '/quiz/' + quizId + '/questions/answers', { 
    // id moet opgehaald worden vanuit state
    method: 'PUT',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      team: teamName, // moet opgehaald worden uit de state
      answer: answer
    })
  })
  .then(res => checkFetchError(res))
}

export async function startLogout(quizId) {
  return fetch(serverFetchBase + '/' + quizId + '/teams', {
    method: 'DELETE',
    credentials: 'include',
    mode: 'cors'
  })
    .then((response) => checkFetchError(response));
}

export async function getTeamInfo(quizId, teamName) {
  return fetch(serverFetchBase + '/quiz/' + quizId + '/teams/' + teamName, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors'
  })
    .then(response => checkFetchError(response));
}