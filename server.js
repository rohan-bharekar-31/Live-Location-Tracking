import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on("send-Location", (data) => {
    console.log(data);
    io.emit("receive-Location", { id: socket.id, ...data });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit("user-disconnected", socket.id);
  });

});

app.get('/', (req, res) => {
  res.render('index');
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
