import LoginRequest from '../Interface/LoginRequest';
import RegisterRequest from '../Interface/RegisterRequest';
import User from '../models/userModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const register = async (req:RegisterRequest, res:any) => {
    const { email, username, confirmPassword, password, site} = req.body;

    if (!email || !username || !password || !confirmPassword) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = new User(email, username, password, site);

    const existingUser = await user.findOne(email);

    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;

    await user.save();

    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'defaultSecret');

    // Create session
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
};

const login = async (req:LoginRequest, res:any) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    // Compare password
    const user = new User(email, '', password, 0);

    const existingUser = await user.findOne(email);

    if (!existingUser) {
        return res.status(400).json({ message: 'User does not exist' });
    }

    const match = await bcrypt.compare(password, existingUser.password);

    if (!match) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'defaultSecret' );

    const site_from = await user.fromSite(email);

    // Create session
    req.session.token = token;
    req.session.user = {
        email,
        authenticated: true,
        site_origin: site_from
    };

    res.status(200).json({
        message: 'User logged in successfully',
        token
    });
};


// export
export { register, login };
