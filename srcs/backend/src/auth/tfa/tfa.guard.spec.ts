import { TfaGuard } from './tfa.guard';

describe('TfaGuard', () => {
  it('should be defined', () => {
    expect(new TfaGuard()).toBeDefined();
  });
});
