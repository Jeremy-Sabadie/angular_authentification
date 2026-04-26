import { TestBed } from '@angular/core/testing';

import { SmaterielsService } from './smateriels.service';

describe('SmaterielsService', () => {
  let service: SmaterielsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmaterielsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
