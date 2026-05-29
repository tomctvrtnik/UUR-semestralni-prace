import { useEffect } from 'react';
import { Drawer } from 'vaul';
import { Box, Typography, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import { useStore } from '../store/useStore';

// OPRAVA 1: Hodnoty musí být definované MÍMO komponentu!
// Tím zabráníme, aby Vaul při každém překreslení rušil animace.
const snapPoints = [0.17, 0.55, 0.98];

export default function MobileBottomSheet() {
    const theme = useTheme();

    // Vytáhneme si kromě mobileSnap i všechny stavy pohledů (záložek)
    const {
        mobileSnap, setMobileSnap,
        isAddingPlace, isViewingVisited, isViewingRoutes, isPlanningRoute, isViewingCreatedPlaces, selectedPlace
    } = useStore();

    // NOVÉ: Vycentrování při prvním načtení stránky
    useEffect(() => {
        // Zpoždění 100ms zaručí, že Vaul už je vykreslený a připravený přijmout povel
        const initTimer = setTimeout(() => {
            setMobileSnap(0.55);
        }, 100);
        return () => clearTimeout(initTimer);
    }, [setMobileSnap]);

    // OPRAVA 2: Reaktor na změnu záložky
    useEffect(() => {
        // Kdykoliv se jakýkoliv z těchto stavů změní na 'true' (uživatel přepnul pohled),
        // vyšleme do Vaul bezpečný povel k vysunutí do půlky.
        if (isAddingPlace || isViewingVisited || isViewingRoutes || isPlanningRoute || isViewingCreatedPlaces || selectedPlace) {
            // Malé zpoždění, aby se React stihl vykreslit
            const timer = setTimeout(() => {
                setMobileSnap(0.55);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isAddingPlace, isViewingVisited, isViewingRoutes, isPlanningRoute, isViewingCreatedPlaces, selectedPlace, setMobileSnap]);

    return (
        <Drawer.Root
            snapPoints={snapPoints}
            activeSnapPoint={mobileSnap}
            setActiveSnapPoint={(val) => {
                if (val === null || val === undefined) {
                    setMobileSnap(0.17);
                } else {
                    setMobileSnap(val);
                }
            }}
            onOpenChange={(isOpen) => {
                // Pokud uživatel prudce swipne dolů, pošleme šuplík do nejnižšího bodu
                if (!isOpen) setMobileSnap(0.17);
            }}
            open={true}
            dismissible={false}
            fadeFromIndex={1}
            modal={false}
        >
            <Drawer.Overlay
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1000,
                    pointerEvents: mobileSnap === 0.98 ? 'auto' : 'none'
                }}
            />

            <Drawer.Portal>
                <Drawer.Content
                    style={{
                        display: 'flex', flexDirection: 'column',
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#FDFFF7',
                        borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
                        height: '92dvh',
                        position: 'fixed', bottom: 0, left: 0, right: 0,
                        zIndex: 1001, boxShadow: '0px -5px 25px rgba(0,0,0,0.2)',
                    }}
                >
                    <Box className="vaul-drag-handle" sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'grab', touchAction: 'none' }}>
                        <Box sx={{
                            width: 45, height: 6,
                            backgroundColor: theme.palette.mode === 'dark' ? '#555' : '#cbd5e1',
                            borderRadius: 3, mb: 1
                        }} />
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                            NÁVRHY A DETAILY
                        </Typography>
                    </Box>

                    <Box data-vaul-no-drag sx={{ flexGrow: 1, overflowY: 'auto', px: 2, pb: 10 }}>
                        <Sidebar />
                    </Box>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
}