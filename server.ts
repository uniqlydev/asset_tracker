import express from 'express';
import path from 'path';
import session from 'express-session';
import crypto from 'crypto';
import bodyparser from 'body-parser';

const app = express();
app.use(bodyparser.json());
const port = 3000;


// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Generate secret
const secret = crypto.randomBytes(64).toString('hex');

// Set up session management
try {
    app.use(session({
        secret: secret,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    }));
}catch (err) {
    console.error(err);
}


// Routes
app.use('/api/users', require('./routers/userRouter.ts'));

// Define a route
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/dashboard', (req, res) => {

    console.log(req.session);

    res.render('dashboard', {
        cookies: req.cookies,
        session: req.session
    })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
