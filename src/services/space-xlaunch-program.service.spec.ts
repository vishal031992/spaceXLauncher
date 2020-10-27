import { TestBed } from '@angular/core/testing';

import { SpaceXLaunchProgramService } from './space-xlaunch-program.service';

describe('SpaceXLaunchProgramService', () => {
  let service: SpaceXLaunchProgramService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceXLaunchProgramService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
