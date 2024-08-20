import express from 'express';
import path from 'path';
import session from 'express-session';
import crypto from 'crypto';
import bodyparser from 'body-parser';
import ws from 'ws';
import http from 'http';

// Create express app
const app = express();
const port = 3000;

// Generate and log session secret
const secret = process.env.SESSION_SECRET || crypto.randomBytes(64).toString('hex');
console.log(`Session secret: ${secret}`);

// Set up session management
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // For development; set to true in production with HTTPS
}));

// Middleware setup
app.use(bodyparser.json());

// Set up EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Create HTTP server and WebSocket server
const server = http.createServer(app);
const wss = new ws.Server({ server });

wss.on('connection', (ws: ws.WebSocket) => {
    console.log('New client connected');

    ws.on('message', (message: ws.MessageEvent) => {
        console.log('Received message:', message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Send initial message to the client
    ws.send(JSON.stringify({ type: 'initial', message: 'Connected to WebSocket' }));
});

// Routes
app.use('/api/users', require('./routers/userRouter.ts'));
app.use('/api/assets', require('./routers/assetRouter.ts'));

// Define routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/dashboard', async (req, res) => {
    console.log('Session ID:', req.sessionID); // Print the session ID
    console.log('Session Cookie:', req.cookies); // Print cookies

    if (!req.session || !req.session.user || !req.session.user.site_origin) {
        console.error('User session data is missing or site_origin is undefined');
        return res.status(400).json({ message: 'Invalid session data' });
    }

    res.render('dashboard', {
        username: req.session.user.email,
    })
});


// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
