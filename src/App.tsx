import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Container,
  useTheme,
  alpha,
  Avatar,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Construction as ConstructionIcon,
  Slideshow as SlideshowIcon,
} from '@mui/icons-material';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './styles/theme';
import { ReportWorkspacePage } from './components/ReportWorkspace';
import { PresentationPage } from './components/PresentationPage';

const drawerWidth = 260;

// 主應用程式
const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const location = useLocation();

  const menuItems = [
    // { text: '專案總覽', icon: <DashboardIcon />, path: '/' },
    // { text: '紅燈警示', icon: <WarningIcon />, path: '/red-lights', badge: mockRedLights.length },
    // { text: '文件管理', icon: <DescriptionIcon />, path: '/documents' },
    // { text: '文件搜尋', icon: <DescriptionIcon />, path: '/search' },
    { text: '報表工作台', icon: <DescriptionIcon />, path: '/report-workspace' },
    { text: '會議呈現', icon: <SlideshowIcon />, path: '/presentation' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo Area */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
          }}
        >
          <ConstructionIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
            專案例會系統
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Project Control Center
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ px: 3, py: 1, display: 'block', fontWeight: 600, letterSpacing: '0.05em' }}
        >
          功能選單
        </Typography>
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    py: 1.25,
                    px: 2,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                      },
                      '& .MuiListItemIcon-root': {
                        color: theme.palette.primary.main,
                      },
                      '& .MuiListItemText-primary': {
                        color: theme.palette.primary.main,
                        fontWeight: 600,
                      },
                    },
                  }}
                >
                  {/* <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.badge ? (
                      <Badge
                        badgeContent={item.badge}
                        color="error"
                        sx={{
                          '& .MuiBadge-badge': {
                            fontSize: '0.65rem',
                            height: 18,
                            minWidth: 18,
                            fontWeight: 700,
                          },
                        }}
                      >
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon> */}
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }}
                  />
                  {isActive && <KeyboardArrowRightIcon fontSize="small" color="primary" />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Area */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 600,
            }}
          >
            A
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              系統管理員
            </Typography>
            <Typography variant="caption" color="text.secondary">
              管理者
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Top Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              A
            </Avatar>
            <Typography variant="body2" fontWeight={500} sx={{ display: { xs: 'none', sm: 'block' } }}>
              系統管理員
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Container
          maxWidth="xl"
          sx={{
            py: 3,
            px: { xs: 2, sm: 3 },
          }}
        >
          <Routes>
            <Route path="/" element={<ReportWorkspacePage />} />
            <Route path="/report-workspace" element={<ReportWorkspacePage />} />
            <Route path="/presentation" element={<PresentationPage />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

// 包裝 Router
const AppWithRouter: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  );
};

export default AppWithRouter;
