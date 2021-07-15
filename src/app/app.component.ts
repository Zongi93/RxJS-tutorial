import { Component } from '@angular/core';
import { combineLatest,map,BehaviorSubject} from 'rxjs';
import { Product } from './model';
import { DhlService } from './services/dhl.service';
import { StoreService } from './services/store.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private readonly filterByTextSubject = new BehaviorSubject<string>('');
  readonly inventory$ = combineLatest(this.storeService.inventory$, this.filterByTextSubject).pipe(map(this.filterInventoryByInput));

  constructor(
    private readonly storeService: StoreService,
    private readonly dhlService: DhlService
  ) {
    dhlService.delivery$.subscribe(toDeliver => console.log({ toDeliver }));
  }

  order(product: Product) {
    this.storeService.order(product);
  }

  onFilterKeyDown(event: KeyboardEvent): void {
    // event.target.value should be defined but for somereason stackblitz doesnt know that
    const inputText = (event.target as any).value ?? (document.getElementById('input') as HTMLInputElement).value;
    this.filterByTextSubject.next(inputText);
  }

  private filterInventoryByInput([inventory, filterBy]: [Array<Product>, string]): Array<Product> {
    return inventory.filter(product => filterBy.length === 0 || product.name.toLocaleLowerCase().indexOf(filterBy.toLocaleLowerCase()) > -1);
  }
}
