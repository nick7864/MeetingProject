import React from 'react';
import { Box, Typography } from '@mui/material';
import { EmphasisCapableContent, TextEmphasis } from '../../types/reportWorkspace';
import { isPlainContent } from '../../utils/emphasisContent';

interface EmphasisContentRendererProps {
  content: EmphasisCapableContent;
  /** Base font size in rem units */
  baseFontSize?: number;
  /** Line height */
  lineHeight?: number;
  /** Whether to preserve whitespace (pre-wrap) */
  preserveWhitespace?: boolean;
  /** Additional sx styles for the container */
  sx?: object;
}

/**
 * Maps emphasis color values to MUI theme color paths.
 */
const colorMap: Record<NonNullable<TextEmphasis['color']>, string> = {
  primary: 'primary.main',
  secondary: 'secondary.main',
  error: 'error.main',
  warning: 'warning.main',
  success: 'success.main',
};

/**
 * Renders EmphasisCapableContent with proper emphasis styling.
 * Supports bold, color, larger text, and newline preservation.
 * 
 * For plain string content, renders as-is with whitespace preservation.
 * For structured content (TextSegment[]), applies emphasis styles to each segment.
 */
export const EmphasisContentRenderer: React.FC<EmphasisContentRendererProps> = ({
  content,
  baseFontSize = 0.95,
  lineHeight = 1.7,
  preserveWhitespace = true,
  sx = {},
}) => {
  // For plain string content, just render with whitespace preservation
  if (isPlainContent(content)) {
    return (
      <Typography
        component="span"
        sx={{
          fontSize: `${baseFontSize}rem`,
          lineHeight,
          whiteSpace: preserveWhitespace ? 'pre-wrap' : 'normal',
          ...sx,
        }}
      >
        {content || '（未填寫）'}
      </Typography>
    );
  }

  // Empty segments
  if (content.length === 0) {
    return (
      <Typography
        component="span"
        sx={{
          fontSize: `${baseFontSize}rem`,
          lineHeight,
          ...sx,
        }}
      >
        （未填寫）
      </Typography>
    );
  }

  // Render structured content with emphasis
  return (
    <Box
      component="span"
      sx={{
        fontSize: `${baseFontSize}rem`,
        lineHeight,
        whiteSpace: preserveWhitespace ? 'pre-wrap' : 'normal',
        ...sx,
      }}
    >
      {content.map((segment, index) => {
        const { text, emphasis } = segment;
        
        if (!emphasis) {
          // No emphasis, render plain text
          return <React.Fragment key={index}>{text}</React.Fragment>;
        }

        const segmentSx: Record<string, string | number> = {};
        
        if (emphasis.bold) {
          segmentSx.fontWeight = 700;
        }
        
        if (emphasis.color) {
          segmentSx.color = colorMap[emphasis.color];
        }
        
        if (emphasis.larger) {
          segmentSx.fontSize = `${baseFontSize * 1.2}rem`;
        }

        return (
          <Box
            key={index}
            component="span"
            data-emphasis-bold={emphasis.bold ? 'true' : undefined}
            data-emphasis-color={emphasis.color}
            data-emphasis-larger={emphasis.larger ? 'true' : undefined}
            sx={segmentSx}
          >
            {text}
          </Box>
        );
      })}
    </Box>
  );
};

export default EmphasisContentRenderer;
