import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { InstanceService } from './instance.service';

describe('InstanceService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }),
  );

  it('should be created', () => {
    const service: InstanceService = TestBed.get(InstanceService);
    expect(service).toBeTruthy();
  });
});
