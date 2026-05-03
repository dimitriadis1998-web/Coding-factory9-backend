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

// Swagger
setupSwagger(app);

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

// CORS config (κρατάμε μόνο ένα)
app.use(cors({
  origin: ['http://localhost:4200']
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);

// 👇 ΑΥΤΟ ΕΙΝΑΙ ΤΟ ΣΗΜΕΙΟ ΠΟΥ ΣΟΥ ΕΛΕΙΠΕ
app.get('/', (req, res) => {
  res.status(200).send('OK');
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;