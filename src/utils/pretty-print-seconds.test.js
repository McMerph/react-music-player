import prettyPrintSeconds from './pretty-print-seconds';

test('prettyPrintSeconds() pretty print seconds', () => {
  expect(prettyPrintSeconds(1)).toBe('00:01');
  expect(prettyPrintSeconds(59)).toBe('00:59');
  expect(prettyPrintSeconds(60)).toBe('01:00');
  expect(prettyPrintSeconds(61)).toBe('01:01');
  expect(prettyPrintSeconds(3599)).toBe('59:59');
  expect(prettyPrintSeconds(3600)).toBe('01:00:00');
  expect(prettyPrintSeconds(3601)).toBe('01:00:01');
  expect(prettyPrintSeconds(3661)).toBe('01:01:01');

  expect(prettyPrintSeconds(233)).toBe('03:53');
  expect(prettyPrintSeconds(233.4)).toBe('03:53');
  expect(prettyPrintSeconds(233.5)).toBe('03:54');

  expect(prettyPrintSeconds(300)).toBe('05:00');
  expect(prettyPrintSeconds(299.4)).toBe('04:59');
  expect(prettyPrintSeconds(299.5)).toBe('05:00');
});
