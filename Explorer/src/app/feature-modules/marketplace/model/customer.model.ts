import { TourPurchaseToken } from "./tour-purchase-token";

export interface Customer {
    id?: number;
    userId: number;
    tourPurchaseTokens: TourPurchaseToken[];
    shoppingCartId: number;
}