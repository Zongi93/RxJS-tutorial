import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable,filter,distinctUntilChanged } from 'rxjs';
import { UserInfo } from '../model';

const DEMO_USER: UserInfo = { name: 'demo user', address: 'demo address' };

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly userEmitter = new BehaviorSubject<UserInfo>(DEMO_USER);

  readonly user$: Observable<UserInfo> = this.userEmitter;
  get user(): UserInfo {
    return this.userEmitter.value;
  }

  readonly logout$ = this.user$.pipe(
    filter(userInfo => !userInfo),
    distinctUntilChanged()
  );

  readonly login$ = this.logout$.pipe(
    filter(userInfo => !!userInfo),
    distinctUntilChanged()
  );

  logout(): void {
    this.userEmitter.next(undefined);
  }
}
