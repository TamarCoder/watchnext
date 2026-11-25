import { describe, expect, it } from '@jest/globals';
import { pickLanguage, translate } from '@/lib/i18n';

describe('i18n', () => {
  it('translates into both languages', () => {
    expect(translate('en', 'tab.movies')).toBe('Movies');
    expect(translate('ka', 'tab.movies')).toBe('ფილმები');
  });

  it('fills in variables', () => {
    expect(translate('en', 'details.reviews', { count: 3 })).toBe('Reviews (3)');
  });

  it('leaves unknown variables visible', () => {
    expect(translate('en', 'details.reviews')).toBe('Reviews ({count})');
  });

  it('picks Georgian only for a Georgian device', () => {
    expect(pickLanguage('ka')).toBe('ka');
    expect(pickLanguage('de')).toBe('en');
    expect(pickLanguage(null)).toBe('en');
  });
});
