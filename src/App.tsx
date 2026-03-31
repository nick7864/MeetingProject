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
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  useTheme,
  alpha,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  KeyboardArrowRight as KeyboardArrowRightIcon,
  Slideshow as SlideshowIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './styles/theme';
import { ReportWorkspacePage } from './components/ReportWorkspace';
import { PresentationPage } from './components/PresentationPage';
import logoImg from './assets/images/logo.png';

const drawerWidth = 260;
const collapsedDrawerWidth = 72;

// 主應用程式
const App: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isPresentationFullscreen, setIsPresentationFullscreen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const currentDrawerWidth = isCollapsed ? collapsedDrawerWidth : drawerWidth;
  const theme = useTheme();
  const location = useLocation();
  const hideChrome = location.pathname === '/presentation' && isPresentationFullscreen;

  const menuItems = [
    { text: '報表工作台', icon: <DescriptionIcon />, path: '/report-workspace' },
    { text: '會議呈現', icon: <SlideshowIcon />, path: '/presentation' },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
      {/* Logo Area */}
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          gap: 1.5,
          minHeight: 80,
        }}
      >
        <Box sx={{ display: { xs: 'flex', md: isCollapsed ? 'none' : 'flex' }, alignItems: 'center', gap: 1.5 }}>
          <img src={logoImg} alt="Logo" width={43} height={40} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.2 }}>
              專案例會系統
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Project Control Center
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={() => setIsCollapsed(!isCollapsed)}
          sx={{ display: { xs: 'none', md: 'flex' } }}
          size="small"
        >
          {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, py: 2 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ px: 3, py: 1, display: isCollapsed ? 'none' : 'block', fontWeight: 600, letterSpacing: '0.05em' }}
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
                    px: isCollapsed ? 1 : 2,
                    justifyContent: isCollapsed ? 'end' : 'flex-start',
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
                  <ListItemIcon
                    sx={{
                      minWidth: isCollapsed ? 0 : 40,
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{ fontWeight: isActive ? 600 : 500 }}
                    sx={{ display: { xs: 'block', md: isCollapsed ? 'none' : 'block' } }}
                  />
                  {isActive && (
                    <KeyboardArrowRightIcon
                      fontSize="small"
                      color="primary"
                      sx={{ display: { xs: 'block', md: isCollapsed ? 'none' : 'block' } }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Area */}
      <Box sx={{ p: isCollapsed ? 1 : 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: isCollapsed ? 'end' : 'flex-start' }}>
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
          <Box sx={{ flex: 1, display: { xs: 'block', md: isCollapsed ? 'none' : 'block' } }}>
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
      {!hideChrome && <AppBar
        position="fixed"
        elevation={0}
        data-testid="app-header"
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 1 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 2, display: { md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
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
      </AppBar>}

      {/* Navigation Drawer */}
      {!hideChrome && <Box component="nav" data-testid="app-sidebar" sx={{
        width: { md: currentDrawerWidth },
        flexShrink: { md: 0 },
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}>
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
              width: currentDrawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        {!hideChrome && <Toolbar />}
        <Container
          maxWidth={hideChrome ? false : 'xl'}
          sx={{
            py: hideChrome ? 0 : 3,
            px: { xs: 2, sm: 3 },
          }}
        >
          <Routes>
            <Route path="/" element={<ReportWorkspacePage />} />
            <Route path="/report-workspace" element={<ReportWorkspacePage />} />
            <Route path="/presentation" element={<PresentationPage onFullscreenChange={setIsPresentationFullscreen} />} />
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
