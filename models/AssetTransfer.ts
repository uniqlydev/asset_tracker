import Asset from "./asset";
import SiteModel from "./SiteModel";
import User from "./userModel";
import pool from "./database";

class AssetTransfer {
    id: string;
    assetToBeTransferred: Asset;
    origin: SiteModel;
    destination: SiteModel;
    createdBy: User;
    receivedBy: User;
    status: string = "Pending";

    constructor(id: string, assetToBeTransferred: Asset, origin: SiteModel, destination: SiteModel, createdBy: User, receivedBy: User) {
        this.id = id;
        this.assetToBeTransferred = assetToBeTransferred;
        this.origin = origin;
        this.destination = destination;
        this.createdBy = createdBy;
        this.receivedBy = receivedBy;
    }

    updateStatus(status: string) {
        this.status = status;

        pool.query('UPDATE asset_transfers SET status = $1 WHERE id = $2', [status, this.id], (error: any, results: any) => {
            if (error) {
                throw error;
            }
        });

        return this.status;
    }

    save() {

    }

}

export default AssetTransfer;
