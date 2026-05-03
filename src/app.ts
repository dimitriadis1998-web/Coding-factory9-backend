import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cors from 'cors';

import userRoutes from './routes/user.routes';
import roleRoutes from './routes/role.routes';
import authRoutes from './routes/auth.routes';

import { notFound } from './middlewares/notFound.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { setupSwagger } from './swagger';

dotenv.config();

const app = express();

// Swagger (ΠΡΕΠΕΙ να είναι πάνω από routes ή OK εδώ)
setupSwagger(app);

// Middlewares
app.use(morgan('dev'));
app.use(cors({
  origin: '*'
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

// Root test route
app.get('/', (req, res) => {
  res.json({
    status: 'API running',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      roles: '/api/roles',
      docs: '/docs'
    }
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;