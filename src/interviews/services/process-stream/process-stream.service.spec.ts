import { Test, TestingModule } from '@nestjs/testing';
import { ProcessStreamService } from './process-stream.service';

describe('ProcessStreamService', () => {
  let service: ProcessStreamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProcessStreamService],
    }).compile();

    service = module.get<ProcessStreamService>(ProcessStreamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
