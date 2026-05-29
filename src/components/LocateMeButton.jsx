// --- KOMPONENTA: TLAČÍTKO PRO VYCENTROVÁNÍ NA POLOHU ---
function LocateMeButton() {
    const map = useMap();
    const theme = useTheme();
    // Přímá detekce mobilu v JavaScriptu
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const userLat = 49.7475;
    const userLng = 13.3776;

    const handleLocate = () => {
        map.flyTo([userLat, userLng], 15, {
            animate: true,
            duration: 1.2
        });
    };

    return (
        <Fab
            aria-label="moje poloha"
            size={isMobile ? "small" : "medium"}
            onClick={handleLocate}
            sx={{
                position: 'absolute',
                right: 16,
                // TVRDÁ LOGIKA: Pokud je mobil, dej top: 16 a smaž bottom. Jinak naopak.
                ...(isMobile ? { top: 16, bottom: 'auto' } : { top: 'auto', bottom: 24 }),
                zIndex: 1000,
                backgroundColor: '#FDFFF7',
                color: '#009FB7',
                '&:hover': {
                    backgroundColor: '#f5f7f0',
                }
            }}
        >
            <MyLocationIcon />
        </Fab>
    );
}