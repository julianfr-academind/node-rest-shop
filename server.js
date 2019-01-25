const http = require("http");
const app = require("./app");

// Routes wich should handle request
const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port);