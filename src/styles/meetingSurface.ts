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
