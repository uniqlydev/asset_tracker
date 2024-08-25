import express from 'express';
import { leaveAComment, loadComments, transferAsset } from '../controllers/assetController';
import authenticateToken from '../middleware/JWT_Authenticator';

const router = express.Router();

router.post('/transfer', transferAsset);
router.post('/comment', leaveAComment);
router.get('/:asset_id/comments', loadComments);

module.exports = router;
