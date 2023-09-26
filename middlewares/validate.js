const conn = require('../config/database')()

const validator = {
  checkEmpty: (req, res, next) => {
    let body = req.body
    for (const key in body) {
      if (body[key] === '') {
        return res.json({ message: 'empty inputs' })
      }
    }
    return next()
  },

  checkUniqueEmail: (req, res, next) => {
    let email = req.body.email
    const sql = 'select * from user where email = ?'
    conn.query(sql, [email], (err, rows) => {
      if (rows.length > 0) {
        return res.json({ message: 'email already exists' })
      }
    })
    return next()
  },

  checkPassword: (req, res, next) => {
    let password = req.body.password
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    if (password.length < 8) {
      return res.json({ message: 'Please make sure your password is at least 8 characters long.' })
    }
    if (!lowercaseRegex.test(password)) {
      return res.json({ message: 'Please enter lowercase letters in your password' })
    }
    if (!numberRegex.test(password)) {
      return res.json({ message: 'Please enter a number in your password' })
    }
    return next()
  }
}

module.exports = validator