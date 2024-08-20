import TransferRequest from "../Interface/TransferReqest";
import AssetTransfer from "../models/AssetTransfer";
import pool from "../models/database";


const transferAsset = async (req: TransferRequest, res: any) => {
    const { asset_id, quantity, where, description } = req.body;

    const origin = req.session.user!.site_origin;

    const status = 'In Process';

    const transfer = new AssetTransfer(0, asset_id, quantity, origin, where, status);

    console.log(transfer);

    try {
        const query = "INSERT INTO asset_transfers (asset_id, quantity, origin_site_id, destination_site_id, status, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";

        const values = [transfer.asset_id, transfer.quantity, parseInt(transfer.origin_site_id.toString()), transfer.destination_site_id, transfer.status, description];

        const result = await pool.query(query, values);

        console.log(result.rows[0]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export { transferAsset };
