import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import fs from 'fs';

import connectDB from './config/db.js';
import { initSocket } from './config/socket.js';
import socketHandler from './socket/socketHandler.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import lotRoutes from './routes/lotRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO
const io = initSocket(server);
socketHandler(io);

// Uploads folder
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads', { recursive: true });
}

// ======================
// CORS FIX
// ======================

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / mobile apps / direct requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error(`CORS blocked origin: ${origin}`);
      return callback(new Error('CORS blocked'));
    },
    credentials: true,
  })
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Uploads
app.use('/uploads', express.static('uploads'));

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AgroLink API Running',
    status: 'healthy',
  });
});

// ======================
// API ROUTES
// ======================

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lots', lotRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/uploads', uploadRoutes);
app.get("/", (req, res) => {
  res.status(200).send("API Running");
});

// Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

await connectDB();

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
