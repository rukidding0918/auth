const dotenv = require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })
const express = require('express')
const vhost = require('vhost')
const session = require('express-session')
const bodyParser = require('body-parser')
const authRouter = require('./routes/auth')

const app = express()

// session
app.use(session({
  secret: 'session secret key is something bluehillclinic something',
  resave: false,
  saveUninitialized: true
}))

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cors
const cors = require('cors')
app.use(cors())

// auth router
app.use('/auth', authRouter)

// branch
const branchList = ['suwon', 'sinsa']
const checkBranch = (req, res, next) => {
  const subdomain = req.vhost[0]
  if (branchList.includes(subdomain)) {
    next()
  } else {
    res.sendStatus(404).send('틀어진 척추를 바로잡고 싶다면 <a href=' / '>여기</a>를 클릭하세요.')
  }
}

const branch = express.Router()
app.use(vhost(/^(?!admin\.)(.*)\.localhost$/, branch))
branch.use(checkBranch)
branch.get('/', (req, res) => {
  const subdomain = req.vhost[0]
  res.send(`${subdomain} branch page`)
})

// admin
const admin = express.Router()
app.use(vhost(/admin.localhost$/, admin))
admin.get('/', (req, res) => {
  res.send('admin page')
})

// home
app.get('/', (req, res) => {
  res.send('Welcome to my home page');
});

app.use((req, res, next) => {
  res.sendStatus(404).send('틀어진 척추를 바로잡고 싶다면 <a href=' / '>여기</a>를 클릭하세요.');
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});