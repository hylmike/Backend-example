import { Test, TestingModule } from '@nestjs/testing';
import { WorkshopResolver } from './workshop.resolver';

describe('WorkshopResolver', () => {
  let resolver: WorkshopResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkshopResolver],
    }).compile();

    resolver = module.get<WorkshopResolver>(WorkshopResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
