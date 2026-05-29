import { Drawer } from 'vaul';
import { Box, Typography, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import { useStore } from '../store/useStore';

export default function MobileBottomSheet() {
    const snapPoints = [0.1, 0.5, 0.9];

    // Taháme data a funkci z našeho mozku (Zustandu)
    const { mobileSnap, setMobileSnap } = useStore();

    // Získáme aktuální MUI téma (obsahuje info, jestli je light nebo dark mode)
    const theme = useTheme();

    return (
        <Drawer.Root
            snapPoints={snapPoints}
            activeSnapPoint={mobileSnap}
            setActiveSnapPoint={setMobileSnap}
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
                    // OPRAVA: Pokud šuplík není na nejvyšším bodě (0.9), propouštíme kliknutí skrz!
                    pointerEvents: mobileSnap === 0.9 ? 'auto' : 'none'
                }}
            />

            <Drawer.Portal>
                <Drawer.Content
                    style={{
                        display: 'flex', flexDirection: 'column',
                        // ZDE JE OPRAVA: Dynamická barva pozadí podle tématu
                        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#FDFFF7',
                        borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
                        height: '100%', position: 'fixed', bottom: 0, left: 0, right: 0,
                        zIndex: 1001, boxShadow: '0px -5px 25px rgba(0,0,0,0.2)',
                    }}
                >
                    <Box className="vaul-drag-handle" sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'grab', touchAction: 'none' }}>
                        <Box sx={{
                            width: 45, height: 6,
                            // Dynamická barva pro tahátko (aby nesvítilo v noci)
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