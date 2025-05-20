'use client';

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  IconButton,
  Typography,
  Avatar,
  Button,
  AppBar,
  Toolbar,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrderIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalOffer as OfferIcon,
  Assessment as AssessmentIcon,
  ChevronLeft as ChevronLeftIcon,
  ListAlt as AttributesIcon,
} from '@mui/icons-material';
import { signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

const DRAWER_WIDTH = 280;

export default function AdminLayout({ children }) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/admin/login');
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Categories', icon: <CategoryIcon />, path: '/admin/dashboard/categories' },
    { text: 'Attributes', icon: <AttributesIcon />, path: '/admin/dashboard/attributes' },
    { text: 'Products', icon: <InventoryIcon />, path: '/admin/dashboard/products' },
    { text: 'Orders', icon: <OrderIcon />, path: '/admin/dashboard/orders' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/admin/dashboard/customers' },
    { text: 'Drivers', icon: <PeopleIcon />, path: '/admin/dashboard/drivers' },
    { text: 'Sellers', icon: <PeopleIcon />, path: '/admin/dashboard/sellers' },
  ];

  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === pathname);
    return currentItem ? currentItem.text : 'Dashboard';
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.05)',
            background: 'linear-gradient(180deg, #2b5876 0%, #4e4376 100%)',
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'white' }}>
            Geniezy Admin
          </Typography>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{ color: 'white' }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                mr: 2,
              }}
            >
              A
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Admin User
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Administrator
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.25)',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: pathname === item.path ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 'auto', p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: 'white',
              borderColor: 'rgba(255, 255, 255, 0.3)',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${DRAWER_WIDTH}px)`,
            ml: `${DRAWER_WIDTH}px`,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            zIndex: theme.zIndex.drawer + 1,
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                color: 'text.primary',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {getPageTitle()}
            </Typography>
            <IconButton sx={{ color: 'text.secondary', mr: 1 }}>
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton sx={{ color: 'text.secondary', mr: 1 }}>
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box sx={{ pt: 10, pb: 4 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
} 