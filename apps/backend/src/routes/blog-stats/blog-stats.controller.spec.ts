import { Test, TestingModule } from '@nestjs/testing';
import { BlogStatsController } from './blog-stats.controller';

describe('BlogStatsController', () => {
  let controller: BlogStatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogStatsController],
    }).compile();

    controller = module.get<BlogStatsController>(BlogStatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
