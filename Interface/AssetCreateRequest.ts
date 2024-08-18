import { Request } from 'express';
import SiteModel from '../models/SiteModel';
import Asset from '../models/asset';
import User from '../models/userModel';

interface AssetTransfer extends Request {
    body: {
        asset: Asset;
        transferTo: SiteModel;
        createdBy: User;
    };
}

export default AssetTransfer;
