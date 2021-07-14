import { Injectable } from '@angular/core';
import {
  bufferTime,
  filter,
  map,
  withLatestFrom
} from 'rxjs/dist/types/operators';
import { Order } from '../model';
import { StoreService } from './store.service';
import { UserService } from './user.service';

const ONE_DAY = 1000 * 60 * 60 * 24;

@Injectable({ providedIn: 'root' })
export class DhlService {
  readonly order$ = this.storeService.toDeliver$.pipe(
    withLatestFrom(this.userService.user$),
    map(([product, userInfo]) => new Order(product, userInfo))
  );

  readonly delivery$ = this.order$.pipe(
    bufferTime(ONE_DAY),
    filter(arr => arr.length > 0),
    map(orders => this.sortByShortestPath(orders))
  );
  constructor(
    private readonly userService: UserService,
    private readonly storeService: StoreService
  ) {
    this.delivery$.subscribe();
  }

  private sortByShortestPath(orders: Array<Order>): Array<Order> {
    return orders
      .map(order => ({ order, rand: Math.random() }))
      .sort((a, b) => b.rand - a.rand)
      .map(o => o.order);
  }
}
