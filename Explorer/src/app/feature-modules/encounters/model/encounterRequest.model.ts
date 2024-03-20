import { Encounter } from "./encounter.model";

export enum Status {
    OnHold = "OnHold",
    Accepted = "accepted",
    Rejected = "rejected"
}

export interface EncounterRequest {
onHold: any;
    id: number,
    encounterId: number,
    touristId: number,
    status: Status,
    encounterDto?: Encounter
}