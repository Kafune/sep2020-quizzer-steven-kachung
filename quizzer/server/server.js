'use strict';

const session = require('express-session');
const express = require('express');
const cors = require('cors');               // needed for using webpack-devserver with express server
const bodyParser = require('body-parser')
const http = require('http');
const WebSocket = require('ws');

const app = express();

// Start the server.
const port = process.env.PORT || 4000;
httpServer.listen(port, () => console.log(`Listening on http://localhost:${port}`));