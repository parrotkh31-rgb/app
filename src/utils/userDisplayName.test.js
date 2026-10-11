import { getUserDisplayName } from './userDisplayName';

describe('getUserDisplayName', () => {
  it('returns the nickname when it exists', () => {
    expect(getUserDisplayName({ displayName: 'Ali', email: 'ali@example.com' })).toBe('Ali');
  });

  it('falls back to the email when the nickname is empty', () => {
    expect(getUserDisplayName({ displayName: '', email: 'ali@example.com' })).toBe('ali@example.com');
  });

  it('returns a generic user label when nothing is available', () => {
    expect(getUserDisplayName({})).toBe('User');
  });
});
