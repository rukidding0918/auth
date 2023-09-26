require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const router = require('express').Router()
const sha = require('sha256')
const validator = require('../middlewares/validate')
const conn = require('../config/database')()

// [GET] /auth/login
router.get('/login', (req, res) => {
  if (req.session.user) {
    res.json({ message: 'already logged in' }); return
  }
  res.json({ message: 'login page' });
})

// [POST] /auth/login
router.post('/login', (req, res) => {
  if (req.session.user) {res.redirect('/login'); return}

  let user = req.body.email
  let password = sha(req.body.password + process.env.SALT)
  const sql = 'select * from user where email = ? and password = ?'
  conn.query(sql, [user, password], (err, rows) => {
    if (rows.length === 0) {
      res.json({ message: 'Invalid email or password. Or will you join us?' }); ruturn
    }
    req.session.user = user
    res.json({ message: `${user} logged in!` });
  })
})

// [GET] /auth/logout
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.json({ message: 'logged out!' })
})

// [GET] /auth/signup
router.get('/signup', (req, res) => {
  res.json({ message: 'signup page' });
})

// [POST] /auth/signup
router.post('/signup', validator.checkEmpty, validator.checkUniqueEmail, validator.checkPassword)
router.post('/signup', (req, res) => {
  let name = req.body.name
  let email = req.body.email
  let password = sha(req.body.password + process.env.SALT)
  console.log(name, email, password)
  const sql = 'insert into user (name, email, password) values (?, ?, ?)'
  conn.query(sql, [name, email, password]), (err, result) => {
    if (err) throw err;
    console.log(result)
    console.log(result, 'signed up!')
  }
  req.session.user = email
  res.json({ message: 'signed up!' });
})

module.exports = router