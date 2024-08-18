import User from "./userModel"


class Asset {
    id: string;
    name: string;
    asset_type: string;
    description: string;
    sent_by: User;
    origin: string;

    constructor(id:string,name: string, asset_type: string, description: string, sent_by: User, origin: string) {
        this.id = id;
        this.name = name;
        this.asset_type = asset_type;
        this.description = description;
        this.sent_by = sent_by;
        this.origin = origin;
    }
}

export default Asset;
