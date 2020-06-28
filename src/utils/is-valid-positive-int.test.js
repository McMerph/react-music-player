import isValidPositiveInt from './is-valid-positive-int';

test('isValidPositiveInt() pretty print seconds', () => {
  expect(isValidPositiveInt('')).toBe(false);
  expect(isValidPositiveInt('e3')).toBe(false);
  expect(isValidPositiveInt('1e7')).toBe(false);
  expect(isValidPositiveInt('-e5')).toBe(false);
  expect(isValidPositiveInt('-3e5')).toBe(false);
  expect(isValidPositiveInt('lala')).toBe(false);
  expect(isValidPositiveInt('-3')).toBe(false);
  expect(isValidPositiveInt('-1.7')).toBe(false);
  expect(isValidPositiveInt('0.5')).toBe(false);
  expect(isValidPositiveInt('42.7')).toBe(false);
  expect(isValidPositiveInt('0')).toBe(false);
  expect(isValidPositiveInt('0', { min: 1 })).toBe(false);
  expect(isValidPositiveInt('7', { max: 5 })).toBe(false);
  expect(isValidPositiveInt('33', { min: 15, max: 23 })).toBe(false);

  expect(isValidPositiveInt('7', { min: 1 })).toBe(true);
  expect(isValidPositiveInt('7', { max: 999 })).toBe(true);
  expect(isValidPositiveInt('7', { min: 1, max: 999 })).toBe(true);
});
