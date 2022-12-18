import { Test, TestingModule } from '@nestjs/testing';
import { InterestsController } from './interests.controller';

describe('InterestsController', () => {
  let controller: InterestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InterestsController],
    }).compile();

    controller = module.get<InterestsController>(InterestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
