import {
  EmphasisCapableContent,
  TextSegment,
  EmphasisSupportedField,
} from '../types/reportWorkspace';

/**
 * Type guard to check if content is structured (TextSegment[]).
 */
export function isStructuredContent(
  content: EmphasisCapableContent
): content is TextSegment[] {
  return Array.isArray(content);
}

/**
 * Type guard to check if content is plain string (legacy format).
 */
export function isPlainContent(content: EmphasisCapableContent): content is string {
  return typeof content === 'string';
}

/**
 * Extract plain text from EmphasisCapableContent.
 * Used for character counting and governance.
 */
export function extractPlainText(content: EmphasisCapableContent): string {
  if (isPlainContent(content)) {
    return content;
  }
  return content.map((segment) => segment.text).join('');
}

/**
 * Calculate the plain text length of EmphasisCapableContent.
 * This is the canonical length used for field limits and governance.
 */
export function getPlainTextLength(content: EmphasisCapableContent): number {
  return extractPlainText(content).length;
}

/**
 * Create empty structured content (empty segment array).
 */
export function createEmptySegments(): TextSegment[] {
  return [];
}

/**
 * Convert plain string to structured content with a single segment.
 * Useful for backward compatibility when upgrading fields.
 */
export function plainToSegments(text: string): TextSegment[] {
  if (!text) {
    return [];
  }
  return [{ text }];
}

/**
 * Convert structured content to plain string.
 * Used for fallback display or legacy systems.
 */
export function segmentsToPlain(segments: TextSegment[]): string {
  return segments.map((s) => s.text).join('');
}

/**
 * Truncate structured content to a maximum plain text length.
 * Preserves segment boundaries when possible.
 * Returns the truncated content and whether truncation occurred.
 */
export function truncateStructuredContent(
  content: TextSegment[],
  maxLength: number
): { content: TextSegment[]; wasTruncated: boolean } {
  const plainText = extractPlainText(content);
  
  if (plainText.length <= maxLength) {
    return { content, wasTruncated: false };
  }

  // Truncate segment by segment
  const result: TextSegment[] = [];
  let currentLength = 0;

  for (const segment of content) {
    const remaining = maxLength - currentLength;
    
    if (remaining <= 0) {
      break;
    }

    if (segment.text.length <= remaining) {
      result.push(segment);
      currentLength += segment.text.length;
    } else {
      // Truncate this segment
      result.push({
        ...segment,
        text: segment.text.slice(0, remaining),
      });
      currentLength = maxLength;
      break;
    }
  }

  return { content: result, wasTruncated: true };
}

/**
 * Check if a field supports emphasis based on its name.
 */
export const EMPHASIS_SUPPORTED_FIELDS: readonly EmphasisSupportedField[] = [
  'weeklyStatusAndRisk',
  'supportPlan',
  'executiveDiscussion',
] as const;

export function fieldSupportsEmphasis(
  field: string
): field is EmphasisSupportedField {
  return EMPHASIS_SUPPORTED_FIELDS.includes(field as EmphasisSupportedField);
}

/**
 * Merge adjacent segments with the same emphasis for normalization.
 */
export function normalizeSegments(segments: TextSegment[]): TextSegment[] {
  if (segments.length === 0) {
    return [];
  }

  const result: TextSegment[] = [];
  let current: TextSegment | null = null;

  const emphasisEquals = (a?: TextSegment['emphasis'], b?: TextSegment['emphasis']): boolean => {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return (
      a.bold === b.bold &&
      a.color === b.color &&
      a.larger === b.larger &&
      a.preserveNewline === b.preserveNewline
    );
  };

  for (const segment of segments) {
    if (!current) {
      current = { ...segment, emphasis: segment.emphasis ? { ...segment.emphasis } : undefined };
    } else if (emphasisEquals(current.emphasis, segment.emphasis)) {
      current.text += segment.text;
    } else {
      result.push(current);
      current = { ...segment, emphasis: segment.emphasis ? { ...segment.emphasis } : undefined };
    }
  }

  if (current) {
    result.push(current);
  }

  return result;
}
