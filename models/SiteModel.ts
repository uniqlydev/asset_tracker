import pool from "./database";

class SiteModel {
    id: string;
    siteName: string;
    siteLocation: string;

    constructor(id: string, siteName: string, siteLocation: string) {
        this.id = id;
        this.siteName = siteName;
        this.siteLocation = siteLocation;
    }


}

export default SiteModel;
