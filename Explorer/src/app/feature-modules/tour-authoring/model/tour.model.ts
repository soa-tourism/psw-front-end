import { TourRating } from "../../marketplace/model/tour-rating.model";
import { Checkpoint } from "./checkpoint.model";
import { Equipment } from "./equipment.model";
import { TourTime } from "./tourTime.model";

export interface Tour {
    id?: string;
    name: string;
    description: string;
    difficulty: string;
    price: number;
    tags: string[];
    authorId : number;
    status: string;
    equipment: Equipment[];
    closed?: boolean;
    checkpoints: Checkpoint[];
    tourTimes: TourTime[];
    tourRatings: TourRating[];
}