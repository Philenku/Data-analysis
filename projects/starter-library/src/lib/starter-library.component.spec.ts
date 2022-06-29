import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarterLibraryComponent } from './starter-library.component';

describe('StarterLibraryComponent', () => {
  let component: StarterLibraryComponent;
  let fixture: ComponentFixture<StarterLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StarterLibraryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarterLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
