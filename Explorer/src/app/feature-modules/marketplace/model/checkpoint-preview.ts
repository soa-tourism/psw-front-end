export interface CheckpointPreview{
    id?: string,
    tourId: string,
    longitude: number,
    latitude: number,
    name: string,
    description: string,
    pictures?: string[],
    requiredTimeInSeconds: number
}