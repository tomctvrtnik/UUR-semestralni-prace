import { createTheme } from '@mui/material/styles';

// Funkce pro vytvoření tématu na základě zvoleného režimu (light/dark)
const getTheme = (mode) => createTheme({
    palette: {
        mode, // Určuje jestli je téma světlé nebo tmavé
        // Definice barev pro hlavní prvky aplikace
        primary: { main: '#79B159', contrastText: '#FDFFF7' },
        secondary: { main: '#009FB7', contrastText: '#FDFFF7' },
        error: { main: '#BB4430', contrastText: '#FDFFF7' },
        // Nastavení pozadí podle módu
        background: {
            default: mode === 'dark' ? '#121212' : '#FDFFF7',
            paper: mode === 'dark' ? '#1E1E1E' : '#FDFFF7',
        },
        // Nastavení barev textu podle módu
        text: {
            primary: mode === 'dark' ? '#FDFFF7' : '#1D1E18',
            secondary: mode === 'dark' ? '#A0A0A0' : 'rgba(29, 30, 24, 0.7)',
        },
    },
    // Nastavení typografie
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 600 },
    },
    // Globální zaoblení rohů prvků
    shape: { borderRadius: 12 },
});

export default getTheme;