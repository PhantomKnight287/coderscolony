import { Test, TestingModule } from '@nestjs/testing';
import { BlogActionsController } from './blog-actions.controller';

describe('BlogActionsController', () => {
  let controller: BlogActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogActionsController],
    }).compile();

    controller = module.get<BlogActionsController>(BlogActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
