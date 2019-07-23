const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const knex = require('knex');

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const knexConfig = knex(require('./knexfile').development);

const Users = require('./database/Models/user-model');
const authRouter = require('./auth/auth-router');
const restricted = require('./auth/restricted');


const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session({
    name: 'sessionId', // name of the cookie
    secret: 'keep it secret, keep it long', // we intend to encrypt
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
    // extra chunk of config
    store: new KnexSessionStore({
        knex: knexConfig, // configured instance of knex
        tablename: 'sessions', // table that will store sessions inside the db, name it anything you want
        sidfieldname: 'sid', // column that will hold the session id, name it anything you want
        createtable: true, // if the table does not exist, it will create it automatically
        clearInterval: 1000 * 60 * 60, // time it takes to check for old sessions and remove them from the database to keep it clean and performant
    }),
}));
server.use('/api/auth', authRouter);

server.get('/', (req, res) => {
    res.send("Testing Server");
});


server.get('/api/users', restricted, (req, res) => {
    Users.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => res.send(err));
})

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`\n** Running on port ${port} **\n`));