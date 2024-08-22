import { Request } from 'express';

interface TransferRequest extends Request {
    body: {
        asset_id: number;
        quantity: number;
        where: number;
        description: string;
        who: number;
    };
}

export default TransferRequest;
