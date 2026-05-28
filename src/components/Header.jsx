import { useState } from 'react';
import { useStore } from '../store/useStore';
import {
    AppBar, Toolbar, Typography, IconButton, Drawer, Box,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider,
    InputBase, styled
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

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';


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

    const { isDarkMode, toggleDarkMode } = useStore();

    // Natažení funkcí a stavů ze Zustandu
    const {
        setIsAddingPlace,
        searchQuery,
        setSearchQuery,
        setIsPlanningRoute,
        setIsViewingRoutes,
        setIsViewingVisited, // <--- DOPLNĚNO ZDE
        setIsViewingCreatedPlaces,
        clearViews
    } = useStore();

    const handleAddPlaceClick = () => {
        clearViews();
        setIsAddingPlace(true);
        setIsMenuOpen(false);
    };

    return (
        <>
            <AppBar position="static" color="primary">
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

                        {/* PROFIL UŽIVATELE */}
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
                        justifyContent: 'center', // Vyhledávání zůstane uprostřed
                        alignItems: 'center',     // Ikonka se vycentruje na výšku s vyhledáváním
                        gap: 2,                   // TADY JE TA ZMĚNA: vytvoří mezeru mezi vyhledáváním a ikonou
                        px: { xs: 1, md: 2 }      // Upravený padding, aby to nebylo nalepené na krajích
                    }}>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Hledat místa..."
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
                        </Search>

                        {/* Tady je ta druhá změna: mr: 1 odsune ikonku od pravého okraje */}
                        <IconButton onClick={toggleDarkMode} sx={{ color: 'white', mr: 1 }}>
                            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>
                    </Box>

                </Toolbar>
            </AppBar>

            {/* Hamburger Menu */}
            <Drawer
                anchor="left"
                open={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            >
                <Box sx={{ width: 280 }} role="presentation">

                    {/* HLAVIČKA MENU SE ŠIPKOU */}
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
                            <ListItemButton onClick={handleAddPlaceClick}>
                                <ListItemIcon>
                                    <AddLocationAltIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText primary="Přidat vlastní místo" sx={{ '& .MuiTypography-root': { fontWeight: 'bold' } }} />
                            </ListItemButton>
                        </ListItem>
                    </List>

                    <Divider />

                    <List>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => {
                                clearViews();
                                setIsViewingVisited(true); // Zapne pohled navštívených
                                setIsMenuOpen(false);      // Zavře menu

                            }}>
                                <ListItemIcon>
                                    <CheckCircleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Mnou navštívené" />
                            </ListItemButton>
                        </ListItem>

                        {/* --- MOJE TRASY --- */}
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => {
                                clearViews();
                                setIsViewingRoutes(true); // Zapne pohled na trasy
                                setIsMenuOpen(false);    // Zavře menu
                            }}>
                                <ListItemIcon>
                                    <MapIcon />
                                </ListItemIcon>
                                <ListItemText primary="Moje trasy" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => {
                                clearViews();
                                setIsPlanningRoute(true);
                                setIsMenuOpen(false);
                            }}>
                                <ListItemIcon>
                                    <RouteIcon />
                                </ListItemIcon>
                                <ListItemText primary="Naplánovat trasu" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => {
                                clearViews();
                                setIsViewingCreatedPlaces(true); // Zapne pohled na vlastní místa
                                setIsMenuOpen(false);
                            }}>
                                <ListItemIcon>
                                    <PlaceIcon />
                                </ListItemIcon>
                                <ListItemText primary="Moje místa" />
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => {
                                setIsMenuOpen(false);
                                clearViews();
                            }}>
                                <ListItemIcon>
                                    <InfoOutlinedIcon />
                                </ListItemIcon>
                                <ListItemText primary="O aplikaci" />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
        </>
    );
}