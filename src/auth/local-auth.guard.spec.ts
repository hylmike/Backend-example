import { ReaderLocalAuthGuard } from './local-auth.guard';

describe('LocalAuthGuard', () => {
  it('should be defined', () => {
    expect(new ReaderLocalAuthGuard()).toBeDefined();
  });
});
