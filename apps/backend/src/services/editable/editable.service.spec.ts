import { Test, TestingModule } from '@nestjs/testing';
import { EditableService } from './editable.service';

describe('EditableService', () => {
  let service: EditableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EditableService],
    }).compile();

    service = module.get<EditableService>(EditableService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
