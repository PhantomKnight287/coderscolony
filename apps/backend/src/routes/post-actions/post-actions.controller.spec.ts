import { Test, TestingModule } from '@nestjs/testing';
import { PostActionsController } from './post-actions.controller';

describe('PostActionsController', () => {
  let controller: PostActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostActionsController],
    }).compile();

    controller = module.get<PostActionsController>(PostActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
