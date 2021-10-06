import { Injectable } from '@angular/core';
import { random } from 'lodash';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubsManService {

  constructor() { }

  private subs: Map<string, Subscription> = new Map();


  add(...subs: Subscription[]){
    subs.forEach(x=> {
      this.subs.set(Math.random().toString(36).substring(2), x);
    });
  }

  merge(subs: Map<string, Subscription>){
    this.subs =   new Map([...this.subs, ...subs]);
  }

  addOne(key: string, sub: Subscription){
    this.subs.set(key, sub);
  }

  clearAll(){
    this.subs.forEach(x=> x.unsubscribe());
    this.subs = null;
  }
}
