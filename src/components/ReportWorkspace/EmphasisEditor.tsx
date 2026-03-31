import React, { useMemo, useRef } from 'react';
import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { EmphasisCapableContent, TextEmphasis, TextSegment } from '../../types/reportWorkspace';
import { isPlainContent, normalizeSegments, plainToSegments } from '../../utils/emphasisContent';

type EmphasisColor = NonNullable<TextEmphasis['color']>;
type EditorColorOption = EmphasisColor | 'none';

interface EmphasisEditorProps {
  label: string;
  value: EmphasisCapableContent;
  onChange: (value: TextSegment[]) => void;
  disabled?: boolean;
  minRows?: number;
  error?: boolean;
  helperText?: React.ReactNode;
}

const colorMap: Record<EmphasisColor, string> = {
  primary: 'primary.main',
  secondary: 'secondary.main',
  error: 'error.main',
  warning: 'warning.main',
  success: 'success.main',
};

const cloneEmphasis = (emphasis?: TextEmphasis): TextEmphasis | undefined => {
  if (!emphasis) {
    return undefined;
  }
  return { ...emphasis };
};

const normalizeEmphasis = (emphasis?: TextEmphasis): TextEmphasis | undefined => {
  if (!emphasis) {
    return undefined;
  }

  const next: TextEmphasis = {};
  if (emphasis.bold) {
    next.bold = true;
  }
  if (emphasis.color) {
    next.color = emphasis.color;
  }
  if (emphasis.larger) {
    next.larger = true;
  }
  if (emphasis.preserveNewline) {
    next.preserveNewline = true;
  }

  return Object.keys(next).length > 0 ? next : undefined;
};

const getSelectionOffsets = (root: HTMLElement): { start: number; end: number } | null => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) {
    return null;
  }

  const startRange = document.createRange();
  startRange.selectNodeContents(root);
  startRange.setEnd(range.startContainer, range.startOffset);

  const endRange = document.createRange();
  endRange.selectNodeContents(root);
  endRange.setEnd(range.endContainer, range.endOffset);

  return {
    start: startRange.toString().length,
    end: endRange.toString().length,
  };
};

const segmentsIntersectRange = (
  segments: TextSegment[],
  start: number,
  end: number
): TextSegment[] => {
  const result: TextSegment[] = [];
  let offset = 0;

  segments.forEach((segment) => {
    const segmentStart = offset;
    const segmentEnd = offset + segment.text.length;
    offset = segmentEnd;

    if (segmentEnd <= start || segmentStart >= end) {
      return;
    }

    result.push(segment);
  });

  return result;
};

const updateSegmentsInRange = (
  segments: TextSegment[],
  start: number,
  end: number,
  updater: (emphasis?: TextEmphasis) => TextEmphasis | undefined
): TextSegment[] => {
  if (start >= end) {
    return segments;
  }

  const result: TextSegment[] = [];
  let offset = 0;

  segments.forEach((segment) => {
    const segmentStart = offset;
    const segmentEnd = offset + segment.text.length;
    offset = segmentEnd;

    if (segmentEnd <= start || segmentStart >= end) {
      result.push({ ...segment, emphasis: cloneEmphasis(segment.emphasis) });
      return;
    }

    const beforeLength = Math.max(0, start - segmentStart);
    const afterLength = Math.max(0, segmentEnd - end);
    const middleStart = beforeLength;
    const middleEnd = segment.text.length - afterLength;

    if (beforeLength > 0) {
      result.push({
        text: segment.text.slice(0, beforeLength),
        emphasis: cloneEmphasis(segment.emphasis),
      });
    }

    const middleText = segment.text.slice(middleStart, middleEnd);
    if (middleText.length > 0) {
      result.push({
        text: middleText,
        emphasis: normalizeEmphasis(updater(cloneEmphasis(segment.emphasis))),
      });
    }

    if (afterLength > 0) {
      result.push({
        text: segment.text.slice(segment.text.length - afterLength),
        emphasis: cloneEmphasis(segment.emphasis),
      });
    }
  });

  return normalizeSegments(result.filter((segment) => segment.text.length > 0));
};

const replaceRangeWithPlainText = (
  segments: TextSegment[],
  start: number,
  end: number,
  insertedText: string
): TextSegment[] => {
  const before: TextSegment[] = [];
  const after: TextSegment[] = [];
  let offset = 0;

  segments.forEach((segment) => {
    const segmentStart = offset;
    const segmentEnd = offset + segment.text.length;
    offset = segmentEnd;

    if (segmentEnd <= start) {
      before.push({ ...segment, emphasis: cloneEmphasis(segment.emphasis) });
      return;
    }

    if (segmentStart >= end) {
      after.push({ ...segment, emphasis: cloneEmphasis(segment.emphasis) });
      return;
    }

    const beforeLength = Math.max(0, start - segmentStart);
    const afterLength = Math.max(0, segmentEnd - end);

    if (beforeLength > 0) {
      before.push({
        text: segment.text.slice(0, beforeLength),
        emphasis: cloneEmphasis(segment.emphasis),
      });
    }

    if (afterLength > 0) {
      after.unshift({
        text: segment.text.slice(segment.text.length - afterLength),
        emphasis: cloneEmphasis(segment.emphasis),
      });
    }
  });

  const inserted = insertedText ? plainToSegments(insertedText) : [];
  return normalizeSegments([...before, ...inserted, ...after]);
};

const readElementEmphasis = (element: HTMLElement): TextEmphasis | undefined => {
  const next: TextEmphasis = {};
  if (element.dataset.emphasisBold === 'true') {
    next.bold = true;
  }
  if (element.dataset.emphasisColor) {
    next.color = element.dataset.emphasisColor as EmphasisColor;
  }
  if (element.dataset.emphasisLarger === 'true') {
    next.larger = true;
  }

  return Object.keys(next).length > 0 ? next : undefined;
};

const mergeEmphasis = (base?: TextEmphasis, extra?: TextEmphasis): TextEmphasis | undefined => {
  const next = {
    ...(base ?? {}),
    ...(extra ?? {}),
  };
  return normalizeEmphasis(next);
};

const parseSegmentsFromEditor = (root: HTMLElement): TextSegment[] => {
  const traverse = (node: Node, inherited?: TextEmphasis): TextSegment[] => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      return text.length > 0 ? [{ text, emphasis: cloneEmphasis(inherited) }] : [];
    }

    if (!(node instanceof HTMLElement)) {
      return [];
    }

    if (node.tagName === 'BR') {
      return [{ text: '\n', emphasis: cloneEmphasis(inherited) }];
    }

    const mergedEmphasis = mergeEmphasis(inherited, readElementEmphasis(node));
    const childSegments = Array.from(node.childNodes).flatMap((child) => traverse(child, mergedEmphasis));

    if ((node.tagName === 'DIV' || node.tagName === 'P') && node !== root && node.nextSibling) {
      childSegments.push({ text: '\n', emphasis: cloneEmphasis(inherited) });
    }

    return childSegments;
  };

  return normalizeSegments(traverse(root));
};

const toSegments = (value: EmphasisCapableContent): TextSegment[] => {
  const segments = isPlainContent(value) ? plainToSegments(value) : value;
  return normalizeSegments(segments.map((segment) => ({ ...segment, emphasis: cloneEmphasis(segment.emphasis) })));
};

export const EmphasisEditor: React.FC<EmphasisEditorProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  minRows = 3,
  error = false,
  helperText,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const lastSelectionRef = useRef<{ start: number; end: number } | null>(null);
  const segments = useMemo(() => toSegments(value), [value]);

  const captureSelection = () => {
    if (!editorRef.current) {
      return;
    }

    const range = getSelectionOffsets(editorRef.current);
    if (range) {
      lastSelectionRef.current = range;
    }
  };

  const withSelectedRange = (
    callback: (range: { start: number; end: number }) => void,
    allowCollapsed = false
  ) => {
    const currentRange = editorRef.current ? getSelectionOffsets(editorRef.current) : null;
    const range = currentRange ?? lastSelectionRef.current;
    if (!range) {
      return;
    }

    if (!allowCollapsed && range.start >= range.end) {
      return;
    }

    lastSelectionRef.current = range;
    callback(range);
  };

  const applyBooleanToggle = (flag: 'bold' | 'larger') => {
    withSelectedRange((range) => {
      const selectedSegments = segmentsIntersectRange(segments, range.start, range.end);
      if (selectedSegments.length === 0) {
        return;
      }

      const shouldEnable = selectedSegments.some((segment) => !segment.emphasis?.[flag]);
      const next = updateSegmentsInRange(segments, range.start, range.end, (emphasis) => {
        const updated: TextEmphasis = { ...(emphasis ?? {}) };
        if (shouldEnable) {
          updated[flag] = true;
        } else {
          delete updated[flag];
        }
        return normalizeEmphasis(updated);
      });
      onChange(next);
    });
  };

  const applyColor = (nextColor: EditorColorOption) => {
    withSelectedRange((range) => {
      const next = updateSegmentsInRange(segments, range.start, range.end, (emphasis) => {
        const updated: TextEmphasis = { ...(emphasis ?? {}) };
        if (nextColor === 'none') {
          delete updated.color;
        } else {
          updated.color = nextColor;
        }
        return normalizeEmphasis(updated);
      });
      onChange(next);
    });
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const pastedPlainText = event.clipboardData.getData('text/plain');

    withSelectedRange(
      (range) => {
        const next = replaceRangeWithPlainText(segments, range.start, range.end, pastedPlainText);
        onChange(next);
        const nextCaret = range.start + pastedPlainText.length;
        lastSelectionRef.current = { start: nextCaret, end: nextCaret };
      },
      true
    );
  };

  const handleInput = () => {
    if (!editorRef.current) {
      return;
    }
    onChange(parseSegmentsFromEditor(editorRef.current));
    captureSelection();
  };

  return (
    <Box sx={{ display: 'grid', gap: 0.75 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>

      <Stack direction="row" spacing={0.75} alignItems="center" data-testid="emphasis-editor-toolbar">
        <Button
          size="small"
          variant="outlined"
          onMouseDown={captureSelection}
          onClick={() => applyBooleanToggle('bold')}
          disabled={disabled}
          aria-label="粗體"
          sx={{ minWidth: 40, px: 1 }}
        >
          粗體
        </Button>
        <Button
          size="small"
          variant="outlined"
          onMouseDown={captureSelection}
          onClick={() => applyBooleanToggle('larger')}
          disabled={disabled}
          aria-label="大字"
          sx={{ minWidth: 40, px: 1 }}
        >
          大字
        </Button>
        <TextField
          select
          size="small"
          label="文字顏色"
          defaultValue="none"
          onMouseDown={captureSelection}
          onChange={(event) => applyColor(event.target.value as EditorColorOption)}
          disabled={disabled}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="none">預設</MenuItem>
          <MenuItem value="primary">主色</MenuItem>
          <MenuItem value="error">紅色</MenuItem>
          <MenuItem value="success">綠色</MenuItem>
        </TextField>
      </Stack>

      <Box
        ref={editorRef}
        role="textbox"
        aria-label={label}
        aria-multiline="true"
        contentEditable={!disabled}
        suppressContentEditableWarning
        onMouseUp={captureSelection}
        onKeyUp={captureSelection}
        onInput={handleInput}
        onPaste={handlePaste}
        sx={{
          border: '1px solid',
          borderColor: error ? 'error.main' : 'divider',
          borderRadius: 1,
          px: 1.5,
          py: 1,
          minHeight: `${minRows * 24}px`,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          lineHeight: 1.6,
          fontSize: '0.95rem',
          outline: 'none',
          bgcolor: disabled ? 'action.disabledBackground' : 'background.paper',
          '&:focus-visible': {
            borderColor: error ? 'error.main' : 'primary.main',
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}33`,
          },
        }}
      >
        {segments.length === 0
          ? null
          : segments.map((segment, index) => (
            <Box
              key={index}
              component="span"
              data-emphasis-bold={segment.emphasis?.bold ? 'true' : undefined}
              data-emphasis-color={segment.emphasis?.color}
              data-emphasis-larger={segment.emphasis?.larger ? 'true' : undefined}
              sx={{
                fontWeight: segment.emphasis?.bold ? 700 : undefined,
                color: segment.emphasis?.color ? colorMap[segment.emphasis.color] : undefined,
                fontSize: segment.emphasis?.larger ? '1.15em' : undefined,
              }}
            >
              {segment.text}
            </Box>
          ))}
      </Box>

      {helperText ? (
        <Typography variant="caption" color={error ? 'error.main' : 'text.secondary'}>
          {helperText}
        </Typography>
      ) : null}
    </Box>
  );
};

export default EmphasisEditor;
