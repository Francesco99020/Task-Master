const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const authentificationRoutes = require('./src/routes/authentification.js');
const groupsRouter = require('./src/routes/groups.js');
const tasksRouter = require('./src/routes/tasks.js');
const usersRouter = require('./src/routes/users.js');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

app.use('/api/user', authentificationRoutes);
app.use('/api/groups', groupsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/users', usersRouter);

app.listen(3000, () => console.log(`Listening on port 3000`));
