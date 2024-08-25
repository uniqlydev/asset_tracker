import express from 'express';
import path from 'path';
import session from 'express-session';
import crypto from 'crypto';
import bodyparser from 'body-parser';
import ws from 'ws';
import http from 'http';
import pool from './models/database';

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

    ws.on('message', (message: string) => {
        const data = JSON.parse(message);

        if (data.type === 'new-comment') {
            // Broadcast the new comment to all connected clients
            wss.clients.forEach(client => {
                if (client.readyState === ws.OPEN) {
                    client.send(JSON.stringify({
                        type: 'new-comment',
                        asset_id: data.asset_id,
                        comment: data.comment,
                        useremail: data.useremail,
                        created_at: data.created_at
                    }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
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

    res.render('dashboard/dashboard', {
        username: req.session.user.email,
    })
});

app.get('/records', async (req, res) => {
    const siteOrigin = req.session.user!.site_origin; // Extract site_origin from session

    const query = `
    SELECT
        at.asset_id AS real_id,
        a.name AS id,
        at.description as description,
        s_origin.name AS origin_site_name,
        at.created_by as created_by,
        at.created_at as created_at,
        s_dest.name AS destination_site_name
    FROM
        asset_transfers at
    JOIN
        assets a ON at.asset_id = a.id
    JOIN
        site s_origin ON at.origin_site_id = s_origin.id
    JOIN
        site s_dest ON at.destination_site_id = s_dest.id
    WHERE
        at.origin_site_id = $1
    `;

    try {
        const result = await pool.query(query, [siteOrigin]); // Pass site_origin as parameter
        const rows = result.rows; // Extract rows from the result object

        console.log(rows);

        res.render('dashboard/records', { records: rows }); // Pass the rows to the EJS template
    } catch (err) {
        console.error('Failed to fetch records:', err);
        res.status(500).json({ message: 'Failed to fetch records' });
    }
});


app.get('/reports', (req,res) => {
    res.render('dashboard/reports');
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Failed to destroy session:', err);
            return res.status(500).json({ message: 'Failed to destroy session' });
        }

        res.redirect('/');
    });
});



// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
