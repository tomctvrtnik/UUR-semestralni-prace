import { useState, useEffect, useRef, useMemo } from 'react';
import { Box, IconButton, useMediaQuery, useTheme, ThemeProvider, CssBaseline } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useSearchParams } from 'react-router-dom';
import { useStore } from './store/useStore';
import Header from './components/Header';
import InteractiveMap from './components/InteractiveMap';
import Sidebar from './components/Sidebar';
import MobileBottomSheet from './components/MobileBottomSheet';
import getTheme from './theme'

function App() {
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  // Všechny potřebné stavy vytažené z useStore na jednom místě
  const { selectedPlace, setSelectedPlace, places, searchQuery, isDarkMode } = useStore();
  const isInitialLoad = useRef(true);

  // Vytvoření dynamického tématu
  const themeInstance = useMemo(() => getTheme(isDarkMode ? 'dark' : 'light'), [isDarkMode]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const placeIdFromUrl = searchParams.get('place');
    if (placeIdFromUrl) {
      const placeToSelect = places.find(p => p.id === placeIdFromUrl);
      if (placeToSelect) setSelectedPlace(placeToSelect);
    }
    isInitialLoad.current = false;
  }, []);

  useEffect(() => {
    if (isInitialLoad.current) return;
    if (selectedPlace) setSearchParams({ place: selectedPlace.id });
    else setSearchParams({});
  }, [selectedPlace, setSearchParams]);

  useEffect(() => {
    if (selectedPlace) {
      setIsDesktopOpen(true);
    }
  }, [selectedPlace]);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      setIsDesktopOpen(true);
    }
  }, [searchQuery]);

  return (
    <ThemeProvider theme={themeInstance}>
      <CssBaseline /> {/* Automaticky se postará o barvu pozadí podle tématu */}

      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Header />
        <Box sx={{ display: 'flex', flexDirection: 'row', flexGrow: 1, overflow: 'hidden', position: 'relative' }}>

          <Box sx={{ flexGrow: 1, height: '100%', position: 'relative' }}>
            <InteractiveMap />
          </Box>

          <IconButton
            disableRipple
            onClick={() => setIsDesktopOpen(!isDesktopOpen)}
            sx={{
              display: { xs: 'none', md: 'flex' },
              position: 'absolute',
              right: isDesktopOpen ? '400px' : '0px',
              top: '50%',
              transform: 'translate(20%, -50%)',
              zIndex: 1000,
              transition: 'all 0.3s ease',
              // OPRAVA: Tady chyběl otazník: isDarkMode ? ... : ...
              color: isDarkMode ? '#FDFFF7' : '#1D1E18',
              '&:hover': {
                bgcolor: 'transparent',
                transform: 'translate(10%, -50%) scale(1.2)'
              }
            }}
          >
            {isDesktopOpen ? (
              <ChevronRightIcon sx={{
                fontSize: 50,
                // OPRAVA: Dynamický filtr podle režimu
                filter: isDarkMode
                  ? 'drop-shadow(0px 0px 4px rgba(255,255,255,0.4))'
                  : 'drop-shadow(0px 2px 4px rgba(0,0,0,0.4))'
              }} />
            ) : (
              <ChevronLeftIcon sx={{
                fontSize: 50,
                filter: isDarkMode
                  ? 'drop-shadow(0px 0px 4px rgba(255,255,255,0.4))'
                  : 'drop-shadow(0px 2px 4px rgba(0,0,0,0.4))'
              }} />
            )}
          </IconButton>

          <Box sx={{
            display: { xs: 'none', md: 'block' },
            width: isDesktopOpen ? '400px' : '0px', height: '100%',
            borderLeft: isDesktopOpen ? '1px solid #e0e0e0' : 'none',
            bgcolor: 'background.paper', overflowX: 'hidden', overflowY: 'auto',
            transition: 'width 0.3s ease',
          }}>
            <Box sx={{ width: '400px', p: 2 }}>
              <Sidebar />
            </Box>
          </Box>

          {isMobile && <MobileBottomSheet />}

        </Box>
      </Box>
    </ThemeProvider >
  );
}

export default App;