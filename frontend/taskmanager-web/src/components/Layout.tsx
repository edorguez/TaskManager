import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import MobileNav from './MobileNav';

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fbf9f1' }}>
      <Sidebar />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <TopNavbar />
        <Box
          component="main"
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: { xs: '16px', md: '24px' },
            backgroundColor: '#f0eee6',
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <MobileNav />
    </Box>
  );
}
