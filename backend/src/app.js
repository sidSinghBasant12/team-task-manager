const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('./config/logger');

// Express async errors wrapper
require('express-async-errors');

const app = express();

/*
|--------------------------------------------------------------------------
| Security Middlewares
|--------------------------------------------------------------------------
*/

// Helmet Configuration
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Allowed Origins
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
];

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log('Blocked by CORS:', origin);

      return callback(
        new Error(`CORS not allowed for origin: ${origin}`),
        false
      );
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

// Handle Preflight Requests
app.options('*', cors());

/*
|--------------------------------------------------------------------------
| Rate Limiting
|--------------------------------------------------------------------------
*/

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 100,
  message:
    'Too many requests from this IP, please try again after 15 minutes',
});

app.use('/api', limiter);

/*
|--------------------------------------------------------------------------
| Request Parsing
|--------------------------------------------------------------------------
*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
|--------------------------------------------------------------------------
| Logging
|--------------------------------------------------------------------------
*/

app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

/*
|--------------------------------------------------------------------------
| Health Check Route
|--------------------------------------------------------------------------
*/

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'TaskForge API is running',
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/teams', require('./routes/teamRoutes'));
app.use('/api/v1/projects', require('./routes/projectRoutes'));
app.use('/api/v1/tasks', require('./routes/taskRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  logger.error(err.message, {
    stack: err.stack,
  });

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',

    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
    }),
  });
});

module.exports = app;
