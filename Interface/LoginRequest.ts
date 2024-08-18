import { Request } from 'express';

interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    };
}

export default LoginRequest;
