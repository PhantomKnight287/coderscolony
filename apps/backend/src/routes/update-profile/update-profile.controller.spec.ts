import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProfileController } from './update-profile.controller';

describe('UpdateProfileController', () => {
  let controller: UpdateProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpdateProfileController],
    }).compile();

    controller = module.get<UpdateProfileController>(UpdateProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
