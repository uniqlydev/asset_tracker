import express from 'express';
import { transferAsset } from '../controllers/assetController';
import authenticateToken from '../middleware/JWT_Authenticator';

const router = express.Router();

router.post('/transfer', transferAsset);

module.exports = router;
