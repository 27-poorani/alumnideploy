import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  CssBaseline,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Forum as ForumIcon,
  Event as EventIcon,
  MonetizationOn as DonationIcon,
  ExitToApp as ExitToAppIcon,
  Message as MessageIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Navigation items for alumni users
const alumniNavItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Profile', icon: <PersonIcon />, path: '/details' },
  { text: 'Guidance', icon: <SchoolIcon />, path: '/mentorship' },
  { text: 'Events', icon: <EventIcon />, path: '/networking-events' },
  { text: 'Donations', icon: <DonationIcon />, path: '/donation' },
  { text: 'Messages', icon: <MessageIcon />, path: '/messages' },
];

function SideNav({ children, title = 'Alumni Portal', adminItems = [], isAdmin = false }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  // Handle drawer toggle
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // Determine if a nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Drawer content
  const drawer = (
    <div>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        p: 2,
        background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
        color: '#fff',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <Typography 
          variant="h6" 
          noWrap 
          component="div"
          sx={{
            fontWeight: 600,
            letterSpacing: 0.5,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isAdmin ? 'Admin Panel' : 'Alumni Portal'}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {isAdmin ? (
          <>
            {adminItems.map((item) => (
              <ListItem 
                key={item.text}
                onClick={() => {
                  if (item.onClick && item.onClick !== null) item.onClick();
                  handleNavigation(item.path);
                }}
                selected={item.active || isActive(item.path)}
                sx={{
                  backgroundColor: item.active ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                  color: item.active ? 'primary.main' : 'inherit',
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    color: 'primary.main',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                  mb: 0.8,
                  borderRadius: 1.5,
                  mx: 1,
                  transition: 'all 0.2s ease-in-out',
                  padding: '8px 16px',
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: item.active ? 'primary.main' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <ListItem 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                window.location.href = '/';
              }}
              sx={{
                '&:hover': {
                  backgroundColor: theme.palette.error.light,
                  color: '#fff',
                  '& .MuiListItemIcon-root': {
                    color: '#fff',
                  },
                },
                borderRadius: 1.5,
                mx: 1,
                mb: 0.8,
                transition: 'all 0.2s ease-in-out',
                padding: '8px 16px',
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40, 
                color: theme.palette.error.main,
                transition: 'all 0.2s ease-in-out',
              }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                primaryTypographyProps={{ 
                  fontWeight: 500,
                }} 
              />
            </ListItem>
          </>
        ) : alumniNavItems.map((item) => (
          <ListItem 
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={isActive(item.path)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: '#fff',
                '& .MuiListItemIcon-root': {
                  color: '#fff',
                },
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              },
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
              mb: 0.8,
              borderRadius: 1.5,
              mx: 1,
              transition: 'all 0.2s ease-in-out',
              padding: '8px 16px',
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: isActive(item.path) ? '#fff' : theme.palette.primary.main }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{ 
                fontWeight: isActive(item.path) ? 600 : 400,
              }} 
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <List>
        <ListItem 
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.location.href = '/';
          }}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.error.light,
              color: '#fff',
              '& .MuiListItemIcon-root': {
                color: '#fff',
              },
            },
            borderRadius: 1.5,
            mx: 1,
            mb: 0.8,
            transition: 'all 0.2s ease-in-out',
            padding: '8px 16px',
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: 40, 
            color: theme.palette.error.main,
            transition: 'all 0.2s ease-in-out',
          }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ 
              fontWeight: 500,
            }} 
          />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - 240px)` },
          ml: { md: `240px` },
          display: { md: 'none' },
          background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { md: 'none' },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{
              fontWeight: 600,
              letterSpacing: 0.5,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { md: `calc(100% - 240px)` },
          mt: { xs: 8, md: 0 }
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default SideNav;