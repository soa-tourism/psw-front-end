export enum Status {
    OnHold = 0,
    Accepted = 1,
    Rejected = 2
  }

export interface CheckpointRequest {
    id: string,
    checkpointId: number,
    authorId: number,
    status: Status
}