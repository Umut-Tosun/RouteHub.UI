import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryPill } from './category-pill';

describe('CategoryPill', () => {
  let component: CategoryPill;
  let fixture: ComponentFixture<CategoryPill>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryPill]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryPill);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
