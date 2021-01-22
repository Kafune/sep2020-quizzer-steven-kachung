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
  return fetch(serverFetchBase + '/quiz/' + quizId + '/teams/', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors',
  })
  .then(response => response.json())
}

export async function addQuestionAnswered(quizId, teamName) {
  const msgbody = { team: teamName };
  return fetch(serverFetchBase + '/quiz/' + quizId + '/questions/approval', {
    method: 'PUT',
    body: JSON.stringify(msgbody),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors',
  })
  .then(response => response.json())
}



export async function assignPoints(quizId, teamName, score) {
  const msgbody = { team: teamName, score: score };
  return fetch(serverFetchBase + '/quiz/' + quizId + '/questions/points', {
    method: 'PUT',
    body: JSON.stringify(msgbody),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors',
  })
  .then(response => response.json())
}

export async function createNewRound(quizId) {
  return fetch(serverFetchBase + '/quiz/' + quizId + '/round/new', {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors',
  })
  .then(response => response.json())
}

export async function requestEndQuiz(quizId) {
  return fetch(serverFetchBase + '/quiz/' + quizId, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    mode: 'cors',
  })
  .then(response => response.json())
}

export async function submitAnswer(quizId, teamName, answer) {
  return fetch(serverFetchBase + '/quiz/' + quizId + '/questions/answers', { 
    method: 'PUT',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      team: teamName,
      answer: answer
    })
  })
}
