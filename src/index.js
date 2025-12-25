import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import userRoutes from './presentation/routes/userRoutes.js';
import eventRoutes from './presentation/routes/eventRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const HTTPS_PORT = process.env.HTTPS_PORT || 8443;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Event Planner API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
  });
});

// Start HTTP server
const httpServer = app.listen(PORT, '0.0.0.0', () => {
  console.log(`HTTP Server is running on port ${PORT}`);
});

// Start HTTPS server if certificates are available
if (process.env.SSL_CERT_PATH && process.env.SSL_KEY_PATH) {
  try {
    const sslOptions = {
      cert: fs.readFileSync(process.env.SSL_CERT_PATH),
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      // Allow self-signed certificates for development
      rejectUnauthorized: false
    };

    const httpsServer = https.createServer(sslOptions, app);
    httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
      console.log(`HTTPS Server is running on port ${HTTPS_PORT}`);
    });
  } catch (error) {
    console.warn('SSL certificates not found or invalid, HTTPS server not started:', error.message);
  }
} else {
  console.log('SSL certificates not configured, HTTPS server not started');
}
