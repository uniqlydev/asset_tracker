import Asset from "./asset";
import pool from "./database";

class SiteModel {
    id: string;
    assets: Asset[];
    siteName: string;
    siteLocation: string;

    constructor(id: string, assets: Asset[], siteName: string, siteLocation: string) {
        this.id = id;
        this.assets = assets;
        this.siteName = siteName;
        this.siteLocation = siteLocation;
    }

    removeAsset(assetId: string) {
        this.assets = this.assets.filter(asset => asset.id !== assetId);

        pool.query('DELETE FROM assets WHERE id = $1', [assetId], (error: any, results: any) => {
            if (error) {
                throw error;
            }
        });

        return this.assets;
    }

    addAsset(asset: Asset) {
        this.assets.push(asset);

        pool.query('INSERT INTO assets (id, name, asset_type, description, sent_by, origin) VALUES ($1, $2, $3, $4, $5, $6)', [asset.id, asset.name, asset.asset_type, asset.description, asset.sent_by, asset.origin], (error: any, results: any) => {
            if (error) {
                throw error;
            }
        });

        return this.assets;
    }
}

export default SiteModel;
