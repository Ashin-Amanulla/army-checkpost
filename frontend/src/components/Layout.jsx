import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    AppBar,
    Box,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from '@mui/material';
import {
    Menu as MenuIcon,
    Dashboard,
    DirectionsCar,
    List as ListIcon,
    LocationOn,
    Category,
    Assessment,
    Logout,
    People
} from '@mui/icons-material';
import useStore from '../store/useStore';

const drawerWidth = 240;

function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useStore();

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/' },
        { text: 'Vehicle Entry', icon: <DirectionsCar />, path: '/vehicle-entry' },
        { text: 'Vehicle List', icon: <ListIcon />, path: '/vehicle-list' },
        { text: 'Checkposts', icon: <LocationOn />, path: '/checkposts', roles: ['super_admin'] },
        { text: 'Vehicle Types', icon: <Category />, path: '/vehicle-types', roles: ['super_admin', 'admin'] },
        { text: 'Reports', icon: <Assessment />, path: '/reports', roles: ['super_admin', 'admin'] },
        { text: 'User Management', icon: <People />, path: '/users', roles: ['super_admin'] }
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <Toolbar />
            <List>
                {menuItems.map((item) => (
                    (!item.roles || item.roles.includes(user?.role)) && (
                        <ListItem 
                            button 
                            key={item.text} 
                            onClick={() => navigate(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    )
                ))}
                <ListItem button onClick={logout}>
                    <ListItemIcon><Logout /></ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </List>
        </div>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Army Checkpost System
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
}

export default Layout; 