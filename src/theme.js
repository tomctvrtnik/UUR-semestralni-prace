import { createTheme } from '@mui/material/styles';

// Definujeme funkci
const getTheme = (mode) => createTheme({
    palette: {
        mode,
        primary: { main: '#79B159', contrastText: '#FDFFF7' },
        secondary: { main: '#009FB7', contrastText: '#FDFFF7' },
        error: { main: '#BB4430', contrastText: '#FDFFF7' },
        background: {
            default: mode === 'dark' ? '#121212' : '#FDFFF7',
            paper: mode === 'dark' ? '#1E1E1E' : '#FDFFF7',
        },
        text: {
            primary: mode === 'dark' ? '#FDFFF7' : '#1D1E18',
            secondary: mode === 'dark' ? '#A0A0A0' : 'rgba(29, 30, 24, 0.7)',
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Helvetica", "Arial", sans-serif',
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
});

// Exportujeme funkci jako defaultní
export default getTheme;