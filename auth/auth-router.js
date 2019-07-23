const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../database/Models/user-model');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('Error. There is no user to log out');
      } else {
        res.send(`You've been logged out`);
      }
    });
  } else {
    res.end();
  }
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // create a session holding session id and user info
        // the response here is going to take a SetCookie with the session id
        // on subsequent requests, thanks to the cookie that always gets sent from client
        // express will be able to see if a session exists for that session id
        req.session.user = user;
        res.status(200).json({
          message: `You are Logged In, ${user.username}!`,
        });
        res.set({
            'Set-Cookie': `user_id = ${user.id}`
        })
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

module.exports = router;
