import express from 'express';

const router = express.Router();

// Importing the middleware
import { isAuthenticated } from '../middleware/endpoint_authenticator';
import JWToken from '../middleware/JWT_Authenticator';

// Importing the controllers
import { register, login } from '../controllers/userController';

router.post('/register', register);
router.post('/login', login);

module.exports = router;
