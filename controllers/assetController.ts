import TransferRequest from "../Interface/TransferReqest";
import AssetTransfer from "../models/assetTransfer";
import CommentInterface from "../Interface/CommentInterface";
import pool from "../models/database";


const transferAsset = async (req: TransferRequest, res: any) => {
    const { asset_id, quantity, where, description } = req.body;

    const origin = req.session.user!.site_origin;

    const status = 'In Process';

    const transfer = new AssetTransfer(0, asset_id, quantity, origin, where, status);

    console.log(transfer);

    try {
        const query = "INSERT INTO asset_transfers (asset_id, quantity, origin_site_id, destination_site_id, status, description, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";

        const values = [transfer.asset_id, transfer.quantity, parseInt(transfer.origin_site_id.toString()), transfer.destination_site_id, transfer.status, description, req.session.user!.email];

        const result = await pool.query(query, values);

        console.log(result.rows[0]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const leaveAComment = async (req: CommentInterface, res: any) => {
    const { asset_id, comment } = req.body;
    const useremail = req.session.user!.email; // Retrieve user email from session

    // Insert the comment into the database
    const query = `INSERT INTO asset_comments (asset_id, useremail, comment) VALUES ($1, $2, $3) RETURNING *`;
    const values = [asset_id, useremail, comment];

    pool.query(query, values, (err: any, result: { rows: any[]; }) => {
        if (err) {
            console.error('Error inserting comment:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        const newComment = result.rows[0];

        // Respond with the new comment data including useremail
        res.json({
            asset_id: newComment.asset_id,
            comment: newComment.comment,
            useremail: newComment.useremail,
            created_at: newComment.created_at
        });
    });
};

const loadComments = async (req: any, res:any) => {
    const assetId = req.params.asset_id;

    const query = `
    SELECT
        ac.comment,
        ac.created_at,
        u.username AS useremail
    FROM
        asset_comments ac
    JOIN
        users u ON ac.useremail = u.email
    WHERE
        ac.asset_id = $1
    AND
        ac.created_at
    ORDER BY
        ac.created_at ASC
    `;

    try {
        const result = await pool.query(query, [assetId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Failed to fetch comments:', err);
        res.status(500).json({ message: 'Failed to fetch comments' });
    }
}


export { transferAsset, leaveAComment, loadComments};
