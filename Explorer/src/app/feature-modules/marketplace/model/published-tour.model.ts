import { Equipment } from "../../tour-authoring/model/equipment.model";
import { TourTime } from "../../tour-authoring/model/tourTime.model";
import { CheckpointPreview } from "./checkpoint-preview";
import { TourRating } from "./tour-rating.model";

export interface PublishedTour{
    id?: string;
    name: string;
    description: string;
    difficulty: string;
    price: number;
    tags: string[];
    authorId: number;
    equipment: Equipment[];
    checkpoints: CheckpointPreview[];
    tourRating: TourRating[];
    tourTime: TourTime[];
    avgRating: number;
}