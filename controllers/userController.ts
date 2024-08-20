import LoginRequest from '../Interface/LoginRequest';
import RegisterRequest from '../Interface/RegisterRequest';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Registration function
const register = async (req: RegisterRequest, res: any) => {
    const { email, username, confirmPassword, password, site } = req.body;

    // Validate input fields
    if (!email || !username || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if the user already exists
    const user = new User(email, username, password, site);
    const existingUser = await user.findOne(email);

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password before saving
    try {
        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;

        await user.save();

        // Generate JWT token
        const token = jwt.sign({ email }, process.env.JWT_SECRET || 'defaultSecret');

        // Create session and set user info
        req.session.token = token;
        req.session.user = {
            email,
            authenticated: true,
            site_origin: site
        };

        res.status(201).json({
            message: 'User registered successfully',
            token
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Login function
const login = async (req: LoginRequest, res: any) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Check if user exists and password matches
    try {
        const user = new User(email, '', password, 0);
        const existingUser = await user.findOne(email);

        if (!existingUser) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const match = await bcrypt.compare(password, existingUser.password);

        if (!match) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        require('dotenv').config();
        const token = jwt.sign({ email }, process.env.JWT_SECRET || 'defaultSecret');

        const site_from = await user.fromSite(email);

        // Create session and set user info
        req.session.token = token;
        req.session.user = {
            email,
            authenticated: true,
            site_origin: site_from
        };

        console.log('User authenticated:', req.session.user);

        res.status(200).json({
            message: 'User logged in successfully',
            session: req.session,
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Export functions
export { register, login };
