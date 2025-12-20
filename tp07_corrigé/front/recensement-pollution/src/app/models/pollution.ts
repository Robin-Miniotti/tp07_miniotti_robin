import { TypePollution } from "./type-pollution";
import { v4 as uuidv4 } from 'uuid';

export class Pollution {
    id:string;
    titre:string;
    typePollution:TypePollution;
    description:string;
    dateObservation:Date;
    lieu:string;
    latitude:number;
    longitude:number;
    photoUrl?:string;

    constructor(titre:string, typePollution:TypePollution, description:string,
        dateObservation:Date, lieu:string, latitude:number, longitude:number, photoUrl?:string
    ) {
        this.id = uuidv4();
        this.titre = titre;
        this.typePollution = typePollution;
        this.description = description;
        this.dateObservation = dateObservation;
        this.lieu = lieu;
        this.latitude = latitude;
        this.longitude = longitude;
        this.photoUrl = photoUrl;
    }
}