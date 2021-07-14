import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs/dist/types';
import { Product } from '../model';
import { UserService } from './user.service';

//pretend this is coming from a backend API call
const DEMO_PRODUCTS: Array<Product> = [
  { id: 0, name: 'Bread', price: 10, isOnSale: false },
  { id: 1, name: 'TV', price: 100, isOnSale: true },
  { id: 2, name: 'Shower head', price: 23, isOnSale: false },
  { id: 3, name: 'Bread', price: 10, isOnSale: false },
  { id: 4, name: 'Laptop', price: 200, isOnSale: false },
  { id: 5, name: 'Milk', price: 11, isOnSale: false }
];

// This is like a real store i.e. Bauhause, Metro, Ipon, Amazon etc
@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly inventorySubject = new BehaviorSubject<Array<Product>>(
    DEMO_PRODUCTS
  );
  private readonly toDeliverSubject = new Subject<Product>();

  readonly inventory$ = this.inventorySubject.asObservable();
  readonly toDeliver$: Observable<Product> = this.toDeliverSubject;

  constructor(userService: UserService) {
    userService.login$.subscribe(() => this.initializeData());
    userService.logout$.subscribe(() => this.cleanUp());
  }

  order(orderedProduct: Product): void {
    const oldInventory = this.inventorySubject.value;
    const remainderInventory = oldInventory.filter(
      product => product.id !== orderedProduct.id
    );
    this.inventorySubject.next(remainderInventory);
    this.toDeliverSubject.next(orderedProduct);
  }

  private initializeData() {}
  private cleanUp() {}
}
