import { TestBed } from '@angular/core/testing';

import { StarterLibraryService } from './starter-library.service';

describe('StarterLibraryService', () => {
  let service: StarterLibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StarterLibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
