import { Test, TestingModule } from '@nestjs/testing';
import { ReaderAuthService } from './readerAuth.service';

describe('AuthService', () => {
  let service: ReaderAuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReaderAuthService],
    }).compile();

    service = module.get<ReaderAuthService>(ReaderAuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
