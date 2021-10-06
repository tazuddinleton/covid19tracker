import { TestBed } from '@angular/core/testing';

import { SubsManService } from './subs-man.service';

describe('SubsManService', () => {
  let service: SubsManService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubsManService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
