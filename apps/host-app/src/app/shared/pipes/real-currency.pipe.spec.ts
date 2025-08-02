import { RealCurrencyPipe } from './real-currency.pipe';

describe('RealCurrencyPipe', () => {
  it('create an instance', () => {
    const pipe = new RealCurrencyPipe();
    expect(pipe).toBeTruthy();
  });
});
