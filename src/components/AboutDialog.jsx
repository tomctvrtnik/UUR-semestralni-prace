import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Divider, Avatar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CodeIcon from '@mui/icons-material/Code';

export default function AboutDialog({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            {/* Hlavička dialogu */}
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'primary.main', color: 'white' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoOutlinedIcon />
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>O aplikaci</Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'white' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ bgcolor: 'background.paper', pt: 3 }}>

                {/* Popis účelu */}
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Účel projektu
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        Tato aplikace vznikla jako semestrální práce k předmětu KIV/UUR. Slouží k objevování, ukládání a plánování tras mezi zajímavými místy. Je ideální například pro partu přátel, kteří chtějí objevit nová místa pro trávení volného času.
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Profil autora */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 64, height: 64 }}>
                        <CodeIcon fontSize="large" />
                    </Avatar>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                            Tomáš Čtvrtník
                        </Typography>
                        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Osobní číslo: A25B0036P
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Informační systémy
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box>
                    <Typography variant="caption" color="text.secondary" display="block" align="center">
                        Verze 1.0.0 • Vytvořeno v roce 2026
                    </Typography>
                </Box>

            </DialogContent>

            <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
                <Button onClick={onClose} variant="contained" color="primary" fullWidth size="large">
                    Zavřít
                </Button>
            </DialogActions>
        </Dialog>
    );
}