import { Component, OnInit } from '@angular/core';
import { MarketplaceService } from '../marketplace.service';
import { AuthService } from 'src/app/infrastructure/auth/auth.service';
import { User } from 'src/app/infrastructure/auth/model/user.model';
import { OrderItem } from '../model/order-item.model';
import { ShoppingCart } from '../model/shopping-cart.model';
import { Injectable } from '@angular/core';
import { TouristWallet } from '../model/tourist-wallet.model';
import { ImageService } from 'src/app/shared/image/image.service';
import { Coupon } from '../model/coupon.model';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'xp-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit{
  cart: ShoppingCart;
  user: User;
  orderItems: OrderItem[] = [];
  cartItemCount : number;
  adventureCoins: number;
  coupon: string;
  coup: Coupon;
  toursImages: string[] = []; // Just first pictures

  constructor(private service: MarketplaceService, private authService: AuthService, private imageService: ImageService) { }

  ngOnInit(): void {
    this.coupon = '';
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.service.getShoppingCart(this.user.id).subscribe({
        next: (result: ShoppingCart) => {
          this.cart = result;
          this.orderItems = this.cart.items;
          this.getAdventureCoins();
  
          const fetchImagePromises = this.orderItems.map(item =>
            this.service.getPublishedTour(item.itemId).toPromise()
              .then((result: any) => result.checkpoint.pictures[0])
              .catch(error => {
                console.log('Error occurred while fetching tours: ' + error);
                return null;
              })
          );
  
          Promise.all(fetchImagePromises).then(tourImages => {
            this.toursImages = tourImages;
          });
        },
      });
    });
  }
  

  getAdventureCoins(): void {
    this.service.getAdventureCoins(this.user.id).subscribe({
      next: (result: TouristWallet) => {
        this.adventureCoins = result.adventureCoins
      },
    });
  }
  
  calculateTotalPrice(){
    if(this.coup){
      return this.calculateSubtotalPrice() - this.calculateDiscount();
    }
    return this.calculateSubtotalPrice();
  }

  calculateSubtotalPrice(): number {
    return this.orderItems.reduce((total, item) => total + item.price, 0);
  }

  calculateDiscount(): number{
    return this.calculateSubtotalPrice()*(this.coup.discountPercentage/100);
  }

  applyCoupon(){
    if(this.coupon != ''){
      this.service.getByCode(this.coupon).subscribe(
        (result)=>{
          this.coup = result;
        },
        (error)=>{
          console.log('Error: ' + error);
        }
      )
    }
    else{
      alert('Wrong coupon input!');
    }
  }

  checkout() {    
    if (this.user && this.user.id !== undefined) {
      this.service.shoppingCartCheckOut(this.user.id, this.coupon).subscribe(
        (cart) => {
          console.log('Uspešno završena kupovina');
          this.cart = cart;
          this.orderItems = this.cart.items;
          this.cart.price = 0;
          this.service.updateCartItemCount(0); 
          this.getAdventureCoins()
        },
        (error) => {
          if (error.status === 402) {
            console.error('Not enough money:', error);
            alert('Not enough ACs. Please add more Adventure Coins to your account.');
          }
          console.error('Greška prilikom završavanja kupovine:', error);
        }
      );
    } else {
      console.error('Nemoguće pristupiti user.id - nije definisano ili ima vrednost undefined.');
    }
  }

  removeShopppingCartItem(item: OrderItem): void{
    this.service.removeItemFromShoppingCart(item).subscribe((cart) => {
      this.cart = cart;
      this.cart.price = cart.price;
      this.orderItems = this.cart.items;
      this.service.updateCartItemCount(this.cart.items.length); 
    });
  };

  getImageUrl(imageName: string): string {
    if (imageName == undefined) return 'https://i.pinimg.com/736x/a7/3c/bf/a73cbfbcf18054bf31ee42e6453c5d94.jpg';
    
    return this.imageService.getImageUrl(imageName);
  }
}