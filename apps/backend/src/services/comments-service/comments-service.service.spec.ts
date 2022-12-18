import { Test, TestingModule } from '@nestjs/testing';
import { CommentsServiceService } from './comments-service.service';

describe('CommentsServiceService', () => {
  let service: CommentsServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentsServiceService],
    }).compile();

    service = module.get<CommentsServiceService>(CommentsServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
