import express from 'express';
import cors from 'cors';
import authRouter from './router/authRouter.js';
import responseRouter from './router/responseRouter.js';
import errorHandler from './middleware/errorHandler.js';
import performanceRoutes from './router/performanceRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/responses', responseRouter);
app.use('/api/performance', performanceRoutes);

app.use(errorHandler);

app.use(express.static(path.join(__dirname, '..', 'Frontend', 'dist')))
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'dist', 'index.html'))
})

export default app;