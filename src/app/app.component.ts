import { Component } from '@angular/core';
import { Product } from './model';
import { DhlService } from './services/dhl.service';
import { StoreService } from './services/store.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  readonly inventory$ = this.storeService.inventory$;

  constructor(
    private readonly storeService: StoreService,
    private readonly dhlService: DhlService
  ) {
    dhlService.delivery$.subscribe(toDeliver => console.log({ toDeliver }));
  }

  order(product: Product) {
    this.storeService.order(product);
  }
}
