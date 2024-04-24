export interface SocialProfile {
    userId: number;
    username: string;
    followers: SocialProfile[];
    following: SocialProfile[];
}