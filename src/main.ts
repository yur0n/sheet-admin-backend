import express from 'express';
import { connect } from 'mongoose';
import { environment } from './environments/environment';
import apiRoutes from './api';
import morgan from 'morgan';
import cors from 'cors';



const app = express();


connect(environment.DB_URI, {});

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use((req, res, next) => {
  //X-Total-Count in the Access-Control-Expose-Headers
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  next();
});
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   next();
// });
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/api`);
});
server.on('error', console.error);