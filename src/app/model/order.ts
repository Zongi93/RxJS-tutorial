import { UserInfo } from './user-info';
import { Product } from './product';

export class Order {
  constructor(readonly product: Product, readonly user: UserInfo) {}
}
