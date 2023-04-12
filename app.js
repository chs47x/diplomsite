const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const session = require('express-session');
const path = require('path');
const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer();
const { error } = require('console');


const connection = mysql.createConnection({
  host: 'db4free.net',
  user: 'chs47x',
  password: 'qsertW1092!',
  database: 'siteusers',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

const app = express();
const http = require('http').createServer(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'img')));


app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true
  }));

app.get('/registration',(req, res) => {
    res.render('pages/registration');
});

app.post('/registration',upload.none(), (req, res) => {
  const {username, password, email} = req.body;

  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
      return;
    }
    if (results.length > 0) {
      res.sendStatus(500);
      return;
    }
    connection.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email], (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      req.session.user = {
        username,
        password
      };
      req.session.login = username;
      res.sendStatus(200);
    });
  });
});

app.post('/login',upload.none(), (req, res) => {
	const username = req.body.login_username;
	const password = req.body.login_password;

	if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ? AND BINARY password = ?', [username, password], (error, results) => {
			if (error) throw error;
			if (results.length > 0) {
				req.session.user = {
					username,
					password
				};
				req.session.login = results[0].username;
        res.sendStatus(200);
			} else {
				res.sendStatus(500);
			}
			res.end();
		});
	}
});


app.get('/leaderboard', async (req, res) => {
  const {login} = req.session;
  try {
    const tetrisLeaderboard = await getLeaderboard('SELECT username, score FROM users ORDER BY score DESC LIMIT 5');
    const pacmanLeaderboard = await getLeaderboard('SELECT username, time FROM users ORDER BY time ASC LIMIT 5');
    const spcInvLeaderboard = await getLeaderboard('SELECT username, timeSpcInv FROM users ORDER BY timeSpcInv ASC LIMIT 5');
    const breakoutLeaderboard = await getLeaderboard('SELECT username, brkScore FROM users ORDER BY brkScore DESC LIMIT 5');
    if(req.session.user){
      res.render('pages/leaderboard', { 
        tetrisLeaderboard,
        pacmanLeaderboard,
        breakoutLeaderboard,
        spcInvLeaderboard,
        login
      });
    }else{
      res.redirect('/registration');
    }
  } catch (error) {
    console.error(error);
  }
});

function getLeaderboard(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/registration');;
    }
  });
});

app.get('/', (req, res) => {
  res.render('pages/main');
});
app.get('/games', (req,res) => {
  const {login} = req.session;
  req.session.user ? res.render('pages/games',{login}) : res.redirect('/registration')
})
app.get('/feedback',(req, res) => {
  const {login} = req.session;
  req.session.user ? res.render('pages/feedback',{login}) : res.redirect('/registration');
});
app.get('/games/tetris',(req, res) => {
  const {login} = req.session;
  req.session.user ? res.render('pages/tetris-main',{login}) : res.redirect('/registration');
});
app.get('/games/tetris/play',(req, res) => {
  const {login} = req.session;
  req.session.user ? res.render('games/tetris',{login}) : res.redirect('/registration'); 
});
app.get('/games/pacman', (req,res)=>{
  const {login} = req.session;
  req.session.user ? res.render('pages/pacman-main',{login}) : res.redirect('/registration');
});
app.get('/games/pacman/play', (req,res)=>{
  const {login} = req.session;
  req.session.user ? res.render('games/pacman',{login}) : res.redirect('/registration');
});
app.get('/games/breakout', (req,res)=>{
  const {login} = req.session;
  req.session.user ? res.render('pages/breakout-main',{login}) : res.redirect('/registration');
});
app.get('/games/breakout/play', (req,res)=>{
  const {login} = req.session;
  req.session.user ? res.render('games/breakout',{login}) : res.redirect('/registration');
});
app.get('/games/SpaceInvaders', (req,res)=>{
  const {login} = req.session; 
   req.session.user ? res.render('pages/spaceinvaders-main',{login}) : res.redirect('/registration');
});

app.get('/games/SpaceInvaders/play', (req,res)=>{
  const login = req.session.login;
  req.session.user ? res.render('games/spaceInv',{login}) : res.redirect('/registration');
});

app.post('/send',upload.none(), (req, res) => {
  // Получение темы и описания из формы
  const subject = req.body.subject;
  const message = req.body.message;
  const email = req.body.email;

  // Настройка транспорта для отправки сообщения через SMTP-сервер Yandex
  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: 'site123.site@yandex.ru',
      pass: 'endeswgotnuczbdd'
    }
  });

  // Настройка параметров сообщения
  const mailOptions = {
    from: 'site123.site@yandex.ru',
    to: 'teryaevk32@gmail.com',
    subject: subject,
    text: `${message} \nот: ${email} `
  };

  // Отправка сообщения
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.sendStatus(500).json({ success: false, message: 'Ошибка отправки сообщения' });
    } else {
      console.log('Сообщение отправлено: ' + info.response);
      res.sendStatus(200).json({ success: true, message: 'Сообщение успешно отправлено' });
    }
  });
});

app.post('/save-score', (req, res) => {
  const score = req.body.score;
  const username = req.session.login;

  connection.query('SELECT score FROM users WHERE username = ?', [username], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      const oldScore = results[0].score;

      if (score > oldScore) {
        connection.query('UPDATE users SET score = ? WHERE username = ?', [score, username], (error, results) => {
          if (error) throw error;
          console.log(`Счет ${score} изменен в БД для пользователя ${username} в игре tetris`);
          res.sendStatus(200);
        });
      } else {
        console.log(`Счет ${score} не изменен в БД для пользователя ${username} в игре tetris`);
        res.sendStatus(200);
      }
    }
  });
});

app.post('/save-brkScore', (req, res) => {
  const brkScore = req.body.brkScore;
  const username = req.session.login;

  connection.query('SELECT brkScore FROM users WHERE username = ?', [username], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      const oldbrkScore = results[0].brkScore;

      if (brkScore > oldbrkScore) {
        connection.query('UPDATE users SET brkScore = ? WHERE username = ?', [brkScore, username], (error, results) => {
          if (error) throw error;
          console.log(`Счет ${brkScore} изменен в БД для пользователя ${username} в игре breakout`);
          res.sendStatus(200);
        });
      } else {
        console.log(`Счет ${brkScore} не изменен в БД для пользователя ${username} в игре breakout`);
        res.sendStatus(200);
      }
    }
  });
});

app.post('/save-time', (req, res) => {
  const time = req.body.time;
  const username = req.session.login;

  connection.query('SELECT time FROM users WHERE username = ?', [username], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      const oldTime = results[0].time;

      if (time < oldTime) {
        connection.query('UPDATE users SET time = ? WHERE username = ?', [time, username], (error, results) => {
          if (error) throw error;
          console.log(`Время ${time} установлено в БД для пользователя ${username} в игре pacman`);
          res.sendStatus(200);
        });
      } else {
        console.log(`Время ${time} не установлено в БД для пользователя ${username} в игре pacman`);
        res.sendStatus(200);
      }
    }
  });
});

app.post('/save-timeSpcInv', (req, res) => {
  const timeSpcInv = req.body.timeSpcInv;
  const username = req.session.login;

  connection.query('SELECT timeSpcInv FROM users WHERE username = ?', [username], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      const oldTime = results[0].timeSpcInv;

      if (timeSpcInv < oldTime) {
        connection.query('UPDATE users SET timeSpcInv = ? WHERE username = ?', [timeSpcInv, username], (error, results) => {
          if (error) throw error;
          console.log(`Время ${timeSpcInv} установлено в БД для пользователя ${username} в игре SpaceInvaders`);
          res.sendStatus(200);
        });
      } else {
        console.log(`Время ${timeSpcInv} не установлено в БД для пользователя ${username} в игре SpaceInvaders`);
        res.sendStatus(200);
      }
    }
  });
});

http.listen(3000, () => {
  console.log('Server listening on port 3000');
});