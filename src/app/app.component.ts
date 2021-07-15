import { Component } from '@angular/core';
import { combineLatest,map,BehaviorSubject,debounceTime,tap} from 'rxjs';
import { Order, Product } from './model';
import { DhlService } from './services/dhl.service';
import { StoreService } from './services/store.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private readonly filterByTextSubject = new BehaviorSubject<string>('');
  readonly inventory$ = 
    combineLatest(this.storeService.inventory$, this.filterByTextSubject)
      .pipe(
        debounceTime(300),
        map(this.filterInventoryByInput));

  trackedOrders : Array<{product:Product,state:'proccessing'|'in delivery' | 'delivered'}> = [];

  constructor(
    private readonly storeService: StoreService,
    private readonly dhlService: DhlService
  ) {
    dhlService.deliveryTakenFromStore$
    .pipe(
      tap(ordersInDelivery => console.log({ ordersInDelivery })))
      .subscribe(ordersInDelivery => 
        this.updateProductStates(ordersInDelivery,'in delivery')
      );

    dhlService.deliveryDelivered$
    .pipe(
      tap(ordersDelivered => console.log({ ordersDelivered })))
      .subscribe(ordersDelivered => 
        this.updateProductStates(ordersDelivered,'delivered')
      );
  }

  order(product: Product) {
    this.storeService.order(product);
    this.trackedOrders.push({product,state:'proccessing'});
  }

  onFilterKeyDown(event: KeyboardEvent): void {
    // event.target.value should be defined but for somereason stackblitz doesnt know that
    const inputText = (event.target as any).value ?? (document.getElementById('input') as HTMLInputElement).value;
    this.filterByTextSubject.next(inputText);
  }

  private filterInventoryByInput([inventory, filterBy]: [Array<Product>, string]): Array<Product> {
    return inventory.filter(product => filterBy.length === 0 || product.name.toLocaleLowerCase().indexOf(filterBy.toLocaleLowerCase()) > -1);
  }

  private updateProductStates(update:Array<Order>,stateToUpdateTo:'in delivery' | 'delivered'):void{
    this.trackedOrders.forEach(tracked => {
      if (update.some(order => tracked.product.id === order.product.id)) {
        tracked.state = stateToUpdateTo;
      }
    })
  }
}
