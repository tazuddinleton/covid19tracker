import { TestBed } from '@angular/core/testing';

import { StateManService } from './state-man.service';

describe('StateManService', () => {
  let service: StateManService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateManService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
