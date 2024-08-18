import { Request } from 'express';

interface RegisterRequest extends Request {
    body: {
        email: string;
        username: string;
        password: string;
        confirmPassword: string;
        site: number;
    };
}

export default RegisterRequest;
