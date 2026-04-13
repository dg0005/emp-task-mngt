import express from 'express';
import authRoute from './routes/authRoute';
import protectedRoutes from './routes/protectedRoutes';
import cookieParser from 'cookie-parser';
import connect from './db';

const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
connect()

server.use('/',authRoute)
server.use('/api',protectedRoutes)


server.get('/healthCheck', (_req, res) => {
    res.json({ message: `Service is up and running on port ${PORT}!`  });
});


server.use((_req, res) => {
  res.status(404).send({
    statusCode: 404,
    status: 'error',
    message:'Not found'
});
});   


export default server;