import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './db.js';

import authRoutes from './routes/authRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// attach routes
app.use('/auth', authRoutes);
app.use('/communities', communityRoutes);
app.use('/posts', postRoutes);

// test route
app.get('/', (req, res) => {
  res.send('Backend is running with routes!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
