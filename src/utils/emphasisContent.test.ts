import { describe, expect, it } from 'vitest';
import {
  isStructuredContent,
  isPlainContent,
  extractPlainText,
  getPlainTextLength,
  createEmptySegments,
  plainToSegments,
  segmentsToPlain,
  truncateStructuredContent,
  fieldSupportsEmphasis,
  normalizeSegments,
  EMPHASIS_SUPPORTED_FIELDS,
} from './emphasisContent';

describe('emphasisContent utilities', () => {
  describe('isStructuredContent', () => {
    it('returns true for TextSegment[]', () => {
      expect(isStructuredContent([{ text: 'hello' }])).toBe(true);
      expect(isStructuredContent([{ text: 'hello', emphasis: { bold: true } }])).toBe(true);
      expect(isStructuredContent([])).toBe(true);
    });

    it('returns false for plain string', () => {
      expect(isStructuredContent('hello')).toBe(false);
      expect(isStructuredContent('')).toBe(false);
    });
  });

  describe('isPlainContent', () => {
    it('returns true for plain string', () => {
      expect(isPlainContent('hello')).toBe(true);
      expect(isPlainContent('')).toBe(true);
    });

    it('returns false for TextSegment[]', () => {
      expect(isPlainContent([{ text: 'hello' }])).toBe(false);
      expect(isPlainContent([])).toBe(false);
    });
  });

  describe('extractPlainText', () => {
    it('returns string as-is for plain content', () => {
      expect(extractPlainText('hello world')).toBe('hello world');
      expect(extractPlainText('')).toBe('');
    });

    it('concatenates text from all segments for structured content', () => {
      const content = [
        { text: 'Hello ' },
        { text: 'world', emphasis: { bold: true } },
        { text: '!' },
      ];
      expect(extractPlainText(content)).toBe('Hello world!');
    });

    it('returns empty string for empty segments', () => {
      expect(extractPlainText([])).toBe('');
    });
  });

  describe('getPlainTextLength', () => {
    it('counts characters in plain string', () => {
      expect(getPlainTextLength('hello')).toBe(5);
      expect(getPlainTextLength('你好世界')).toBe(4);
    });

    it('counts plain text characters in segments (excludes emphasis metadata)', () => {
      const content = [
        { text: 'Hello ', emphasis: { bold: true } },
        { text: 'world', emphasis: { color: 'primary' as const } },
      ];
      expect(getPlainTextLength(content)).toBe(11);
    });

    it('includes spaces and newlines in count', () => {
      expect(getPlainTextLength('hello\nworld  test')).toBe(17);
      
      const content = [
        { text: 'line1\n' },
        { text: 'line2  ' },
      ];
      expect(getPlainTextLength(content)).toBe(13);
    });
  });

  describe('createEmptySegments', () => {
    it('returns empty array', () => {
      expect(createEmptySegments()).toEqual([]);
    });
  });

  describe('plainToSegments', () => {
    it('converts non-empty string to single segment without emphasis', () => {
      expect(plainToSegments('hello')).toEqual([{ text: 'hello' }]);
    });

    it('returns empty array for empty string', () => {
      expect(plainToSegments('')).toEqual([]);
    });
  });

  describe('segmentsToPlain', () => {
    it('concatenates all segment texts', () => {
      const segments = [
        { text: 'Hello ' },
        { text: 'world', emphasis: { bold: true } },
      ];
      expect(segmentsToPlain(segments)).toBe('Hello world');
    });

    it('returns empty string for empty array', () => {
      expect(segmentsToPlain([])).toBe('');
    });
  });

  describe('truncateStructuredContent', () => {
    it('does not truncate when content fits', () => {
      const content = [{ text: 'hello world' }];
      const result = truncateStructuredContent(content, 20);
      expect(result.content).toEqual(content);
      expect(result.wasTruncated).toBe(false);
    });

    it('truncates to exact length when content exceeds', () => {
      const content = [{ text: 'hello world' }];
      const result = truncateStructuredContent(content, 5);
      expect(extractPlainText(result.content)).toBe('hello');
      expect(result.wasTruncated).toBe(true);
    });

    it('preserves emphasis on truncated segments', () => {
      const content = [{ text: 'hello world', emphasis: { bold: true } }];
      const result = truncateStructuredContent(content, 5);
      expect(result.content).toEqual([
        { text: 'hello', emphasis: { bold: true } },
      ]);
    });

    it('handles multi-segment content', () => {
      const content = [
        { text: 'abc' },
        { text: 'def', emphasis: { bold: true } },
        { text: 'ghi' },
      ];
      const result = truncateStructuredContent(content, 5);
      expect(extractPlainText(result.content)).toBe('abcde');
      expect(result.content).toHaveLength(2);
      expect(result.content[0]).toEqual({ text: 'abc' });
      expect(result.content[1]).toEqual({ text: 'de', emphasis: { bold: true } });
    });

    it('handles empty content', () => {
      const result = truncateStructuredContent([], 10);
      expect(result.content).toEqual([]);
      expect(result.wasTruncated).toBe(false);
    });
  });

  describe('fieldSupportsEmphasis', () => {
    it('returns true for the three narrative fields', () => {
      expect(fieldSupportsEmphasis('weeklyStatusAndRisk')).toBe(true);
      expect(fieldSupportsEmphasis('supportPlan')).toBe(true);
      expect(fieldSupportsEmphasis('executiveDiscussion')).toBe(true);
    });

    it('returns false for other fields', () => {
      expect(fieldSupportsEmphasis('workItem')).toBe(false);
      expect(fieldSupportsEmphasis('plannedBuildDate')).toBe(false);
      expect(fieldSupportsEmphasis('approvalDate')).toBe(false);
    });

    it('returns false for unknown field names', () => {
      expect(fieldSupportsEmphasis('unknownField')).toBe(false);
    });
  });

  describe('EMPHASIS_SUPPORTED_FIELDS', () => {
    it('contains exactly the three supported fields', () => {
      expect(EMPHASIS_SUPPORTED_FIELDS).toEqual([
        'weeklyStatusAndRisk',
        'supportPlan',
        'executiveDiscussion',
      ]);
    });
  });

  describe('normalizeSegments', () => {
    it('merges adjacent segments with same emphasis', () => {
      const segments = [
        { text: 'Hello ' },
        { text: 'world' },
        { text: '!' },
      ];
      expect(normalizeSegments(segments)).toEqual([
        { text: 'Hello world!' },
      ]);
    });

    it('does not merge segments with different emphasis', () => {
      const segments = [
        { text: 'Hello ' },
        { text: 'world', emphasis: { bold: true } },
        { text: '!' },
      ];
      expect(normalizeSegments(segments)).toEqual([
        { text: 'Hello ' },
        { text: 'world', emphasis: { bold: true } },
        { text: '!' },
      ]);
    });

    it('merges segments with same emphasis properties', () => {
      const segments = [
        { text: 'Hello ', emphasis: { bold: true } },
        { text: 'world', emphasis: { bold: true } },
      ];
      expect(normalizeSegments(segments)).toEqual([
        { text: 'Hello world', emphasis: { bold: true } },
      ]);
    });

    it('returns empty array for empty input', () => {
      expect(normalizeSegments([])).toEqual([]);
    });

    it('handles segments with different emphasis types', () => {
      const segments = [
        { text: 'normal ' },
        { text: 'bold', emphasis: { bold: true } },
        { text: ' ' },
        { text: 'colored', emphasis: { color: 'primary' as const } },
      ];
      expect(normalizeSegments(segments)).toEqual([
        { text: 'normal ' },
        { text: 'bold', emphasis: { bold: true } },
        { text: ' ' },
        { text: 'colored', emphasis: { color: 'primary' } },
      ]);
    });
  });
});
