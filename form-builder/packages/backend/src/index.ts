import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';

import { errorHandler } from './middleware/errorHandler';
import { workflowRouter } from './routes/workflow.routes';
import { pageRouter } from './routes/page.routes';
import { sectionRouter } from './routes/section.routes';
import { fieldRouter } from './routes/field.routes';
import { validationRouter } from './routes/validation.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/workflows', workflowRouter);
app.use('/api/pages', pageRouter);
app.use('/api/sections', sectionRouter);
app.use('/api/fields', fieldRouter);
app.use('/api/validations', validationRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});