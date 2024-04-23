export interface TourRating {
    id?: string;
    rating: number;
    comment?: string;
    touristId: number;
    tourId: string;
    tourDate: Date
    reviewDate: Date;
    imageNames?: string[];
    images?: FileList;
}