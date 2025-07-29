import { TestBed } from '@angular/core/testing';

import { ManageexamService } from './manageexam.service';

describe('ManageexamService', () => {
  let service: ManageexamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageexamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
