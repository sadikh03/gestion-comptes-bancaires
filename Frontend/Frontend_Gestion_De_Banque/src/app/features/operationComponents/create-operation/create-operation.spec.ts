import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOperation } from './create-operation';

describe('CreateOperation', () => {
  let component: CreateOperation;
  let fixture: ComponentFixture<CreateOperation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOperation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOperation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
