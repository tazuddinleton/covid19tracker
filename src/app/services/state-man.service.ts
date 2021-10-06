import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateManService {

  private selectedCountryCode: Subject<string> = new Subject();
  constructor() { }

  getSelectedCountryCode(): Observable<string>{
    return this.selectedCountryCode;
  }

  setSelectedCountryCode(code: string){
    this.selectedCountryCode.next(code);
  }
}
