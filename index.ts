import express, { Express } from 'express';
import bodyParser from 'body-parser';
import PostRoutes from './src/routes/posts';
import AuthRoutes from './src/routes/auth';

const app: Express = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', AuthRoutes);
app.use('/post', PostRoutes);

app.listen('5000', () => {
  console.log('⚡️[server]: Server is running at https://localhost:5000');
});
