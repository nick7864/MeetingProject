import { SxProps, Theme, alpha } from '@mui/material/styles';

export const meetingSurfaceSx: SxProps<Theme> = {
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  bgcolor: 'background.paper',
};

export const meetingHeaderSx: SxProps<Theme> = {
  fontWeight: 700,
  letterSpacing: '0.01em',
};

export const meetingHintTextSx: SxProps<Theme> = {
  color: 'text.secondary',
  fontSize: '0.875rem',
  lineHeight: 1.6,
};

export const meetingDesktopNoticeSx: SxProps<Theme> = {
  mt: 0.5,
  mb: 1.5,
  px: 1,
  py: 0.5,
  borderRadius: 1,
  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
  color: 'text.secondary',
  fontSize: '0.8125rem',
};

export const meetingSlideSectionSx: SxProps<Theme> = {
  py: 1.5,
  borderBottom: '1px solid',
  borderColor: 'divider',
};

/**
 * Report field heading style with restrained left-accent visual language.
 * Uses proportion (size, weight, spacing) rather than decoration to establish hierarchy,
 * while keeping content as the primary visual focus.
 *
 * Design rationale:
 * - Left border accent: Subtle 3px solid bar for field identification without visual noise
 * - Font: Slightly larger (0.875rem) and bolder (500) than caption for scanning
 * - Padding: Left padding aligns with border, vertical rhythm for separation
 * - Color: text.secondary maintains low contrast, content stays primary
 */
export const meetingFieldHeadingSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  pl: 1,
  mb: 0,
  borderLeft: '3px solid',
  borderColor: 'primary.light',
  fontSize: '0.9375rem',
  fontWeight: 600,
  color: 'text.primary',
  lineHeight: 1.45,
  letterSpacing: '0.01em',
};

export const meetingFieldContentGapSx: SxProps<Theme> = {
  mt: 0.75,
};
