
class AssetTransfer {
    public id: number;
    public asset_id: number;
    public quantity: number;
    public origin_site_id: number;
    public destination_site_id: number;
    public status: string;

    constructor(id: number, asset_id: number, quantity: number, origin_site_id: number, destination_site_id: number, status: string) {
        this.id = id;
        this.asset_id = asset_id;
        this.quantity = quantity;
        this.origin_site_id = origin_site_id;
        this.destination_site_id = destination_site_id;
        this.status = status;
    }
}

export default AssetTransfer;
