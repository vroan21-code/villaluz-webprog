import React, { useState, createElement } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme, styled, useTheme, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ArticleIcon from "@mui/icons-material/Article";
import Button from "@mui/material/Button";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import HomeIcon from "@mui/icons-material/Home";
import { canAccessUsersPage, clearAuthSession, getAuthUser } from "../utils/auth";

const zinc950 = "#09090b";
const zinc900 = "#18181b";
const zinc800 = "#27272a";
const zinc500 = "#71717a";
const zinc200 = "#e4e4e7";
const zinc100 = "#f4f4f5";
const zinc50 = "#fafafa";

const dashboardTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: zinc900,
      dark: zinc950,
      light: zinc800,
      contrastText: zinc50,
    },
    background: {
      default: zinc100,
      paper: "#ffffff",
    },
    text: {
      primary: zinc900,
      secondary: zinc500,
    },
    divider: "rgba(24, 24, 27, 0.12)",
    success: {
      main: "#166534",
      contrastText: zinc50,
    },
    warning: {
      main: "#ea580c",
      contrastText: zinc50,
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 700 },
    h5: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Sora", "Inter", sans-serif', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: zinc100,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            backgroundColor: zinc800,
          },
        },
        containedWarning: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedSuccess: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        outlinedPrimary: {
          borderColor: zinc900,
          "&:hover": {
            borderColor: zinc800,
            backgroundColor: "rgba(24, 24, 27, 0.04)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: zinc800,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.main,
          },
        }),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: "rgba(24, 24, 27, 0.08)",
            "&:hover": {
              backgroundColor: "rgba(24, 24, 27, 0.12)",
            },
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        columnHeaders: {
          backgroundColor: zinc200,
          color: zinc900,
          fontWeight: 600,
        },
        footerContainer: {
          borderTopColor: "rgba(24, 24, 27, 0.12)",
        },
      },
    },
  },
});

const drawerWidth = 240;

const dashboardNavItems = [
    {
        label: "Dashboard",
        title: "Dashboard",
        to: "/dashboard",
        icon: DashboardIcon,
    },
    {
        label: "Reports",
        title: "Reports",
        to: "/dashboard/reports",
        icon: AssessmentIcon,
    },
    {
        label: "Users",
        title: "Users",
        to: "/dashboard/users",
        icon: PeopleIcon,
        adminOnly: true,
    },
    {
        label: "Articles",
        title: "Articles",
        to: "/dashboard/articles",
        icon: ArticleIcon,
    },
];

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#000",
  color: "#fff",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const getPageTitle = (pathname) =>
  dashboardNavItems.find(({ to }) => to === pathname)?.title ?? "Welcome";

const DashLayoutContent = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const navigate = useNavigate();
  const { firstName, type: userType } = getAuthUser();
  const roleLabel =
    userType === "admin" ? "Admin" : userType === "editor" ? "Editor" : userType || "";

  const visibleNavItems = dashboardNavItems.filter(
    (item) => !item.adminOnly || canAccessUsersPage()
  );

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/auth/signin");
  };

  return (
    <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
      <CssBaseline />
      {/* App Bar */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 5 }}
          >
            {open ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {pageTitle}
            {firstName && (
              <Typography component="span" variant="body2" sx={{ ml: 1.5, opacity: 0.75 }}>
                · {firstName}
                {roleLabel ? ` (${roleLabel})` : ""}
              </Typography>
            )}
          </Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>

          <Button
            color="inherit"
            variant="outlined"
            onClick={handleLogout}
            sx={{ borderColor: "rgba(255,255,255,0.45)", "&:hover": { borderColor: "#fff" } }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          {visibleNavItems.map(({ label, to, icon }) => (
            <ListItem key={to} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={Link}
                to={to}
                selected={location.pathname === to}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  justifyContent: open ? "initial" : "center",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {createElement(icon)}
                </ListItemIcon>

                <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: "auto", p: 1.5 }}>
          <ListItemButton
            component={Link}
            to="/"
            sx={{
              minHeight: 48,
              borderRadius: 1.5,
              px: 2.5,
              justifyContent: open ? "initial" : "center",
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Back to Home" sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
};

const DashLayout = () => (
  <ThemeProvider theme={dashboardTheme}>
    <DashLayoutContent />
  </ThemeProvider>
);

export default DashLayout;