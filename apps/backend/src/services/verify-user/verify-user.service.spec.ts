import { Test, TestingModule } from '@nestjs/testing';
import { VerifyUserService } from './verify-user.service';

describe('VerifyUserService', () => {
  let service: VerifyUserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerifyUserService],
    }).compile();

    service = module.get<VerifyUserService>(VerifyUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
