import { Test, TestingModule } from '@nestjs/testing';
import { BlogEditController } from './blog-edit.controller';

describe('BlogEditController', () => {
  let controller: BlogEditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogEditController],
    }).compile();

    controller = module.get<BlogEditController>(BlogEditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
