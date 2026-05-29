// Komponenta pro návrat na polohu uživatele
function LocateMeButton() {
    const map = useMap(); // Přístup k instanci mapy pro ovládání kamery
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Detekce mobilu pro responzivitu

    const userLat = 49.7475;
    const userLng = 13.3776;

    // Animovaný přelet kamery na souřadnice
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
                // Responsivní pozice: na mobilu nahoře, na PC dole
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