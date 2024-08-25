import { Request } from 'express';

interface CommentInterface extends Request {
    body: {
        asset_id: number;
        useremail: string;
        comment: string;
    }
}

export default CommentInterface;
