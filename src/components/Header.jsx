import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import {
    AppBar, Toolbar, Typography, IconButton, Drawer, Box,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
    InputBase, styled, Dialog, Slide, useMediaQuery, useTheme // <-- Přidán useMediaQuery a useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RouteIcon from '@mui/icons-material/Route';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MapIcon from '@mui/icons-material/Map';
import PlaceIcon from '@mui/icons-material/Place';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

// --- ANIMACE PRO FULLSCREEN VYHLEDÁVÁNÍ ---
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

// --- STYLY PRO VYHLEDÁVACÍ POLE ---
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: '#FDFFF7',
    color: '#333',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    '&:hover': {
        backgroundColor: '#f5f7f0',
    },
    width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#009FB7',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1.2, 1, 1.2, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        paddingRight: theme.spacing(4),
        width: '100%',
    },
}));
// ----------------------------------

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const { isDarkMode, toggleDarkMode } = useStore();

    // Detekce, zda je uživatel na mobilu/menším tabletu
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const {
        setIsAddingPlace,
        searchQuery,
        setSearchQuery,
        setIsPlanningRoute,
        setIsViewingRoutes,
        setIsViewingVisited,
        setIsViewingCreatedPlaces,
        clearViews,
        setMobileSnap
    } = useStore();

    const handleMenuClick = (actionFn) => {
        setIsMenuOpen(false);
        if (actionFn) actionFn();
        setTimeout(() => {
            setMobileSnap(0.55);
        }, 150);
    };

    const openSearch = () => {
        setMobileSnap(0.17);
        setIsSearchModalOpen(true);
    };

    return (
        <>
            <AppBar position="sticky" color="primary" sx={{ top: 0, zIndex: 9999 }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>

                    {/* LEVÁ ČÁST: Menu, Nadpis a Profil */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 1 }}
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mr: 4 }}>
                            Objevuj
                        </Typography>

                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
                            <PersonIcon sx={{ fontSize: 36, mr: 1, opacity: 0.9 }} />
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.1 }}>
                                    Tomáš Čtvrtník
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1.1 }}>
                                    A25B0036P
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* PRAVÁ ČÁST: Vyhledávání */}
                    <Box sx={{
                        width: { xs: '100%', md: '400px' },
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 2,
                        px: { xs: 1, md: 2 }
                    }}>
                        {/* Rozhodnutí: Kurzíva pointer pro klikání na mobilu, normální text na PC */}
                        <Search
                            onClick={isMobile ? openSearch : undefined}
                            sx={{ cursor: isMobile ? 'pointer' : 'text' }}
                        >
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>

                            {/* Dynamické vykreslení podle zařízení */}
                            {isMobile ? (
                                // FAKE POLE PRO MOBIL
                                <>
                                    <Box sx={{
                                        py: 1.2, pl: 6, pr: 4, width: '100%',
                                        color: searchQuery ? 'inherit' : 'text.secondary',
                                        boxSizing: 'border-box'
                                    }}>
                                        {searchQuery || "Hledat"}
                                    </Box>

                                    {searchQuery && (
                                        <IconButton
                                            size="small"
                                            aria-label="vymazat hledání"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSearchQuery('');
                                            }}
                                            sx={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', color: '#009FB7' }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </>
                            ) : (
                                // SKUTEČNÉ POLE PRO POČÍTAČ (Původní chování)
                                <StyledInputBase
                                    placeholder="Hledat"
                                    inputProps={{ 'aria-label': 'search' }}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    endAdornment={
                                        searchQuery ? (
                                            <IconButton
                                                size="small"
                                                aria-label="vymazat hledání"
                                                onClick={() => setSearchQuery('')}
                                                sx={{ color: '#009FB7', mr: 0.5 }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                        ) : null
                                    }
                                />
                            )}
                        </Search>

                        <IconButton onClick={toggleDarkMode} sx={{ color: 'white', mr: 1 }}>
                            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* FULLSCREEN VYHLEDÁVACÍ MODAL (Otevírá se jen na mobilu) */}
            <Dialog
                fullScreen
                open={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                TransitionComponent={Transition}
                sx={{ zIndex: 10000 }}
            >
                <AppBar position="static" color="inherit" elevation={1}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => setIsSearchModalOpen(false)}
                            aria-label="close"
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <InputBase
                            sx={{ ml: 1, flex: 1, fontSize: '1.1rem' }}
                            placeholder="Hledat"
                            autoFocus
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            inputProps={{ 'aria-label': 'search real' }}
                        />
                        {searchQuery && (
                            <IconButton onClick={() => setSearchQuery('')}>
                                <CloseIcon />
                            </IconButton>
                        )}
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: 2, bgcolor: 'background.default', height: '100%', overflowY: 'auto' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                        {searchQuery ? "Hledám: " + searchQuery : "Začněte psát pro vyhledávání..."}
                    </Typography>
                </Box>
            </Dialog>

            {/* Hamburger Menu */}
            <Drawer anchor="left" open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                <Box sx={{ width: 280 }} role="presentation">
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            Menu
                        </Typography>
                        <IconButton onClick={() => setIsMenuOpen(false)}>
                            <ChevronLeftIcon />
                        </IconButton>
                    </Box>
                    <Divider />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleMenuClick(() => setIsAddingPlace(true))}>
                                <ListItemIcon><AddLocationAltIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="Přidat vlastní místo" sx={{ '& .MuiTypography-root': { fontWeight: 'bold' } }} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleMenuClick(() => setIsViewingVisited(true))}>
                                <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                                <ListItemText primary="Mnou navštívené" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleMenuClick(() => setIsViewingRoutes(true))}>
                                <ListItemIcon><MapIcon /></ListItemIcon>
                                <ListItemText primary="Moje trasy" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleMenuClick(() => setIsPlanningRoute(true))}>
                                <ListItemIcon><RouteIcon /></ListItemIcon>
                                <ListItemText primary="Naplánovat trasu" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleMenuClick(() => setIsViewingCreatedPlaces(true))}>
                                <ListItemIcon><PlaceIcon /></ListItemIcon>
                                <ListItemText primary="Moje místa" />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => handleMenuClick()}>
                                <ListItemIcon><InfoOutlinedIcon /></ListItemIcon>
                                <ListItemText primary="O aplikaci" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
}