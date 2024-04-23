import { CheckpointCompletition } from "./checkpoint_completition.model";
import { PurchasedTourPreview } from "./purchased_tour_preview.model";


export interface TourExecution{
    id?: string,
    touristId: number,
    tourId: string,
    tour: PurchasedTourPreview,
    start: Date,
    lastActivity: Date,
    executionStatus: ExecutionStatus,
    completedCheckpoints?: CheckpointCompletition[]
}

export enum ExecutionStatus
{
    Completed = "Completed",
    Abandoned = "Abandoned",
    InProgress = "InProgress"
}