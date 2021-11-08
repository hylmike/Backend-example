import { Test, TestingModule } from '@nestjs/testing';
import { LibResolver } from './lib.resolver';

describe('LibResolver', () => {
  let resolver: LibResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LibResolver],
    }).compile();

    resolver = module.get<LibResolver>(LibResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
