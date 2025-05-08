'use client';

import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrderIcon,
} from '@mui/icons-material';

export default function DashboardPage() {
  const theme = useTheme();

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <Card
      sx={{
        height: '100%',
        borderRadius: 4,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.8) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            p: 1.5,
            borderRadius: 2,
            background: alpha(color, 0.1),
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: alpha(color, 0.2),
              mr: 2,
            }}
          >
            <Icon sx={{ fontSize: 28, color: color }} />
          </Box>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            mb: 1,
          }}
        >
          {value}
        </Typography>
        {trend && (
          <Typography
            variant="body2"
            sx={{
              color: trend > 0 ? 'success.main' : 'error.main',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            {trend > 0 ? '+' : ''}{trend}% from last month
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ px: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: 'text.primary',
            mb: 1,
          }}
        >
          Welcome Back!
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Here&apos;s what&apos;s happening with your store today.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Categories"
            value="0"
            icon={CategoryIcon}
            color={theme.palette.primary.main}
            trend={12}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Products"
            value="0"
            icon={InventoryIcon}
            color={theme.palette.success.main}
            trend={8}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Orders"
            value="0"
            icon={OrderIcon}
            color={theme.palette.warning.main}
            trend={-3}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
