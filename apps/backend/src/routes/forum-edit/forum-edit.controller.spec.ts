import { Test, TestingModule } from '@nestjs/testing';
import { ForumEditController } from './forum-edit.controller';

describe('ForumEditController', () => {
  let controller: ForumEditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ForumEditController],
    }).compile();

    controller = module.get<ForumEditController>(ForumEditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
