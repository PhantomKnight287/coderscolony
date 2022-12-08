import { Test, TestingModule } from '@nestjs/testing';
import { ForumsPostController } from './forums-post.controller';

describe('ForumsPostController', () => {
  let controller: ForumsPostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumsPostController],
    }).compile();

    controller = module.get<ForumsPostController>(ForumsPostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
