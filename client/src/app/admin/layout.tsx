"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  ThemeProvider,
  createTheme,
  Collapse,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  People,
  DirectionsBus,
  Place,
  Settings,
  Article,
  QuestionAnswer,
  Search,
  Logout,
  AccountCircle,
  ExpandMore,
  ExpandLess,
  TravelExplore,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContextProvider";
import { useLoader } from "@/contexts/LoaderContext";

// Admin theme matching the original design
const adminTheme = createTheme({
  palette: {
    primary: {
      main: "#C22A54", // Tailwind 'primary' color
    },
    secondary: {
      main: "#202542", // Tailwind 'secondary' color
    },
    background: {
      default: "#f8f9fa", // Light background for admin
      paper: "#ffffff", // Paper background
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Volkhov', sans-serif", // Tailwind fonts
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      color: "#202542", // Secondary text color
    },
    button: {
      textTransform: "none", // Disable uppercase for buttons
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem", // Match Tailwind's rounded-md
          fontFamily: "'Poppins', sans-serif",
          textTransform: "none",
          padding: "8px 16px",
        },
        containedPrimary: {
          color: "#ffffff",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "0.75rem", // Match Tailwind's rounded-lg
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)", // Tailwind-style shadow-md
        },
      },
    },
  },
});

const drawerWidth = 280;

const adminMenuItems = [
  {
    text: "Dashboard",
    icon: <Dashboard />,
    path: "/admin",
    exact: true,
  },
  {
    text: "Users",
    icon: <People />,
    path: "/admin/users",
    children: [
      { text: "All Users", path: "/admin/users" },
      { text: "Add User", path: "/admin/users/add" },
    ],
  },
  {
    text: "Buses",
    icon: <DirectionsBus />,
    path: "/admin/buses",
    children: [
      { text: "All Buses", path: "/admin/buses" },
      { text: "Add Bus", path: "/admin/buses/add" },
    ],
  },
  {
    text: "Places",
    icon: <Place />,
    path: "/admin/places",
    children: [
      { text: "All Places", path: "/admin/places" },
      { text: "Countries", path: "/admin/places/countries" },
      { text: "States", path: "/admin/places/states" },
      { text: "Cities", path: "/admin/places/cities" },
      { text: "Add City", path: "/admin/cities/add" },
    ],
  },
  {
    text: "Tours",
    icon: <TravelExplore />,
    path: "/admin/tours",
    children: [
      { text: "All Tours", path: "/admin/tours" },
      { text: "Add Tour", path: "/admin/tours/add" },
    ],
  },
  {
    text: "SEO",
    icon: <Search />,
    path: "/admin/seo",
    children: [
      { text: "All SEO", path: "/admin/seo" },
      { text: "Add SEO", path: "/admin/seo/add" },
    ],
  },
  {
    text: "FAQs",
    icon: <QuestionAnswer />,
    path: "/admin/faqs",
  },
  {
    text: "Terms",
    icon: <Article />,
    path: "/admin/terms",
  },
  {
    text: "Settings",
    icon: <Settings />,
    path: "/admin/settings",
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const { logout, state: user, isAdmin } = useAuth();
  const { setLoading } = useLoader();

  // Check if user is admin, if not redirect to home
  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
    }
  }, [isAdmin, router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
    handleMenuClose();
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  const handleAccordionChange = (itemText: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemText)
        ? prev.filter((item) => item !== itemText)
        : [...prev, itemText]
    );
  };

  const isActive = (path: string, exact: boolean = false) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const drawer = (
    <Box>
      <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "divider" }}>
        <Typography variant="h6" noWrap component="div">
          Admin Panel
        </Typography>
      </Box>
      <List>
        {adminMenuItems.map((item) => {
          const isItemActive = isActive(item.path, item.exact);
          const hasChildren = item.children && item.children.length > 0;
          const isExpanded = expandedItems.includes(item.text);

          if (hasChildren) {
            return (
              <Box key={item.text}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleAccordionChange(item.text)}
                    selected={isItemActive}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <Box sx={{ py: 0, px: 0 }}>
                    <List dense>
                      {item.children?.map((child) => (
                        <ListItem key={child.path} disablePadding>
                          <ListItemButton
                            onClick={() => handleNavigation(child.path)}
                            selected={isActive(child.path)}
                            sx={{ pl: 4 }}
                          >
                            <ListItemText primary={child.text} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Collapse>
              </Box>
            );
          }

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isItemActive}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  // If not admin, don't render anything
  if (!isAdmin) {
    return null;
  }

  return (
    <ThemeProvider theme={adminTheme}>
      <Box sx={{ display: "flex", minHeight: "calc(100vh - 80px)" }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer - Fixed Position */}
        <Box
          sx={{
            display: { xs: "none", md: "block" },
            width: drawerWidth,
            flexShrink: 0,
            position: "fixed",
            left: 0,
            top: 80, // Account for header height
            height: "calc(100vh - 80px)",
            zIndex: 1200,
          }}
        >
          <Box
            sx={{
              width: drawerWidth,
              height: "100%",
              bgcolor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
              overflowY: "auto",
            }}
          >
            {drawer}
          </Box>
        </Box>

        {/* Main Content - With Left Margin for Fixed Sidebar */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: "background.default",
            minHeight: "100%",
            ml: { xs: 0, md: `${drawerWidth}px` },
          }}
        >
          {/* Mobile Top Bar: hamburger + avatar aligned */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ color: "primary.main" }}
            >
              <MenuIcon />
            </IconButton>
            <Box>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuClick}
                sx={{ color: "primary.main" }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleMenuClose}>
                  <AccountCircle sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>

          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;
