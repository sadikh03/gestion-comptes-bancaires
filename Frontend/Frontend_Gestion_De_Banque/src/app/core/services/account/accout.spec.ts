import { TestBed } from '@angular/core/testing';

import { Accout } from './accout';

describe('Accout', () => {
  let service: Accout;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Accout);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
