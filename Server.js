// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./Routes/CustomerAuthRoutes');
const authMiddleware = require('./Middleware/CustomerAuthMiddleware');
const vehicleRoutes = require('./Routes/vehicleRoutes');
const driverRatingRouter = require("./Routes/driverRatingRouter");

const reportRoutes = require('./Routes/reportRoutes');
const recruiterReportRoutes = require('./Routes/renterReportRoutes');

const http = require('http');
const { Server } = require('socket.io');
// This is required to parse JSON request bodies

const path = require('path');

dotenv.config();

// Initialize the Express app
const app = express();
app.use(cors({
  origin: "http://localhost:5173", // Your frontend URL
  methods: ["GET", "POST","PUT", "DELETE", "OPTIONS"]
}));
app.use(express.json()); 
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  path: '/socket.io',
  transports: ['websocket', 'polling']
});

// MongoDB connection
// Updated MongoDB connection without deprecated options
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));
  const bookingRoutes = require("./Routes/bookingRoutes");
  app.use("/api", bookingRoutes);
// Routes
app.use("/api", driverRatingRouter); 
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve image files
app.use('/api/vehicles', vehicleRoutes);
// Protected Route Example (using authMiddleware)
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploads directory
app.use('/api', reportRoutes);
app.use('/api/renter', recruiterReportRoutes);

const initializeChatRoutes = require('./Routes/chatRoutes');
const chatRoutes = initializeChatRoutes(io); // Pass io instance
app.use('/api/chat', chatRoutes);
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_group', (groupId) => {
    socket.join(groupId);
    console.log(`User joined group: ${groupId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});
// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

