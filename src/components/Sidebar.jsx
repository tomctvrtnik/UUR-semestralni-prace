import { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, FormControl, Accordion, AccordionSummary, AccordionDetails, IconButton, List, Rating, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Slider, Switch, Chip, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useStore } from '../store/useStore';
import AddPlaceForm from './AddPlaceForm';
import RoutePlannerForm from './RoutePlannerForm';

const getDistanceInKm = (distanceStr) => {
    if (!distanceStr) return 0;
    const val = parseFloat(distanceStr);
    if (distanceStr.includes('km')) return val;
    return val / 1000;
};

const getDistanceInMeters = (distanceStr) => {
    return getDistanceInKm(distanceStr) * 1000;
};

export default function Sidebar() {
    const [placeToDelete, setPlaceToDelete] = useState(null);

    const {
        places, selectedPlace, setSelectedPlace, searchQuery, activeCategories, toggleCategory,
        sortBy, setSortBy, isAddingPlace, setIsAddingPlace, isPlanningRoute, setIsPlanningRoute,
        setRoutePoints, isViewingRoutes, setIsViewingRoutes, savedRoutes, toggleVisited, setRating,
        isViewingVisited, setIsViewingVisited, isViewingCreatedPlaces, setIsViewingCreatedPlaces,
        removePlace, clearViews, maxDistance, setMaxDistance, hideVisited, setHideVisited,
        minRating, setMinRating, activeTags, toggleTag
    } = useStore();

    let processedPlaces = places.filter(place => {
        const matchesSearch = place.title.toLowerCase().includes(searchQuery.toLowerCase());
        const placeCategories = Array.isArray(place.category) ? place.category : [place.category].filter(Boolean);
        const matchesCategory = activeCategories.length === 0 || placeCategories.some(c => activeCategories.includes(c));
        const matchesDistance = getDistanceInKm(place.distance) <= maxDistance;
        const matchesHideVisited = hideVisited ? !place.isVisited : true;
        const matchesRating = (place.rating || 0) >= minRating;
        const matchesTags = activeTags.length === 0 || activeTags.every(tag => (place.tags || []).includes(tag));

        return matchesSearch && matchesCategory && matchesDistance && matchesHideVisited && matchesRating && matchesTags;
    });

    processedPlaces.sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'distance') return getDistanceInMeters(a.distance) - getDistanceInMeters(b.distance);
        return 0;
    });

    // --- POHLEDY ---
    if (isAddingPlace) {
        return (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                <Button variant="outlined" onClick={() => clearViews()} sx={{ mb: 2, alignSelf: 'flex-start' }} color="inherit">
                    Zrušit přidávání
                </Button>
                <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 'bold' }}>Nové místo</Typography>
                <AddPlaceForm onClose={() => clearViews()} />
            </Box>
        );
    }

    if (isViewingVisited) {
        const visitedPlaces = places.filter(p => p.isVisited);
        return (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                    <IconButton onClick={() => clearViews()} sx={{ mr: 1, ml: -1 }}><ArrowBackIcon /></IconButton>
                    <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold', m: 0 }}>Navštívená místa</Typography>
                </Box>
                <List sx={{ flex: 1, overflowY: 'auto' }}>
                    {visitedPlaces.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>Zatím jsi neoznačil žádné místo jako navštívené.</Typography>
                    ) : (
                        visitedPlaces.map((place) => (
                            <Card key={place.id} sx={{ mb: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                                onClick={() => { clearViews(); setSelectedPlace(place); }}>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{place.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">Hodnocení: {place.rating || 0} ★</Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </List>
            </Box>
        );
    }

    if (isViewingCreatedPlaces) {
        const createdPlaces = places.filter(p => p.isCreatedByUser);
        return (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                    <IconButton onClick={() => clearViews()} sx={{ mr: 1, ml: -1 }}><ArrowBackIcon /></IconButton>
                    <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold', m: 0 }}>Moje místa</Typography>
                </Box>
                <List sx={{ flex: 1, overflowY: 'auto' }}>
                    {createdPlaces.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>Zatím jsi nevytvořil žádné vlastní místo.</Typography>
                    ) : (
                        createdPlaces.map((place) => (
                            <Card key={place.id} sx={{ mb: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                                onClick={() => { clearViews(); setSelectedPlace(place); }}>
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: '16px !important' }}>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{place.title}</Typography>
                                        {/* OPRAVA KATEGORIE */}
                                        <Typography variant="body2" color="text.secondary">
                                            Kategorie: {Array.isArray(place.category) ? place.category.join(', ') : place.category}
                                        </Typography>
                                    </Box>
                                    <IconButton color="error" onClick={(e) => { e.stopPropagation(); setPlaceToDelete(place); }}>
                                        <DeleteIcon />
                                    </IconButton>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </List>
                <Dialog open={Boolean(placeToDelete)} onClose={() => setPlaceToDelete(null)}>
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Jste si jistý?</DialogTitle>
                    <DialogContent><DialogContentText>Opravdu smazat {placeToDelete?.title}?</DialogContentText></DialogContent>
                    <DialogActions sx={{ p: 2 }}>
                        <Button onClick={() => setPlaceToDelete(null)} color="inherit">Zrušit</Button>
                        <Button onClick={() => { removePlace(placeToDelete.id); setPlaceToDelete(null); }} color="error" variant="contained">Smazat</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
    }

    if (isViewingRoutes) {
        return (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexShrink: 0 }}>
                    <IconButton onClick={() => clearViews()} sx={{ mr: 1, ml: -1 }}><ArrowBackIcon /></IconButton>
                    <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold', m: 0 }}>Moje trasy</Typography>
                </Box>
                <List sx={{ flex: 1, overflowY: 'auto' }}>
                    {savedRoutes.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>Zatím nemáš uložené žádné trasy.</Typography>
                    ) : (
                        savedRoutes.map((route) => (
                            <Card key={route.id} sx={{ mb: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                                onClick={() => { clearViews(); setRoutePoints(route.points); setIsPlanningRoute(true); }}>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{route.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">Uloženo: {route.date} • {route.points.length} bodů</Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </List>
            </Box>
        );
    }

    if (isPlanningRoute) {
        return (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0, bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, flexShrink: 0 }}>
                    <IconButton onClick={() => clearViews()} sx={{ mr: 1, ml: -1 }}><ArrowBackIcon /></IconButton>
                    <Typography variant="h5" color="text.primary" sx={{ fontWeight: 'bold', m: 0 }}>Plánování trasy</Typography>
                </Box>
                <RoutePlannerForm onClose={() => clearViews()} />
            </Box>
        );
    }

    if (selectedPlace) {
        return (
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Button variant="outlined" onClick={() => clearViews()} color="primary">Zpět na návrhy</Button>
                    <Button variant="contained" startIcon={<AddIcon />}
                        onClick={() => {
                            setRoutePoints([{ title: 'Moje poloha', lat: 49.7475, lng: 13.3776, routeId: 'start', isFixed: true }, { ...selectedPlace, routeId: Date.now().toString() }]);
                            clearViews();
                            setIsPlanningRoute(true);
                        }}
                        sx={{ ml: 2 }}
                    >Trasa</Button>
                </Box>
                <Typography variant="h4" color="text.primary" sx={{ fontWeight: 'bold' }} gutterBottom>{selectedPlace.title}</Typography>

                {/* OPRAVA KATEGORIE V DETAILU */}
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Kategorie: {Array.isArray(selectedPlace.category) ? selectedPlace.category.join(', ') : selectedPlace.category} • Hodnocení: {selectedPlace.rating || 0} ★
                </Typography>

                <Typography variant="body1" sx={{ mt: 2 }}>{selectedPlace.description}</Typography>
                {selectedPlace.tags && selectedPlace.tags.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedPlace.tags.map(tag => <Chip key={tag} label={tag} size="small" />)}
                    </Box>
                )}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'action.selected', borderRadius: 2 }}>
                    <FormControlLabel
                        control={<Checkbox checked={!!selectedPlace.isVisited} onChange={() => toggleVisited(selectedPlace.id)} color="primary" />}
                        label="Místo jsem navštívil(a)"
                    />
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">Hodnocení:</Typography>
                        <Rating value={selectedPlace.rating || 0} onChange={(event, newValue) => setRating(selectedPlace.id, newValue)} />
                    </Box>
                </Box>
            </Box>
        );
    }

    // --- HLAVNÍ OBRAZOVKA (SEZNAM) ---
    const categories = ['Příroda', 'Veřejné', 'Placené'];
    const availableTags = ['Vhodné pro děti', 'Se psem', 'Parkování', 'Historie', 'Krásný výhled', 'Filmové lokace'];

    return (
        <Box sx={{ position: 'relative', bgcolor: 'background.paper', minHeight: '100%' }}>
            <Box sx={{ position: 'sticky', top: '-16px', pt: '16px', pb: 1, zIndex: 10, bgcolor: 'background.paper' }}>
                <Accordion variant="outlined" sx={{ borderRadius: 2, borderColor: 'primary.main', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>FILTRY A ŘAZENÍ</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Typography variant="body2" sx={{ mr: 2, fontWeight: 'bold' }}>ŘADIT PODLE:</Typography>
                            <FormControl size="small" sx={{ flexGrow: 1 }}>
                                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} sx={{ borderRadius: 2 }}>
                                    <MenuItem value="relevance">Relevance</MenuItem>
                                    <MenuItem value="rating">Nejlépe hodnocené</MenuItem>
                                    <MenuItem value="distance">Nejblíže</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <FormGroup row sx={{ mb: 1 }}>
                            {categories.map(cat => (
                                <FormControlLabel key={cat}
                                    control={<Checkbox checked={activeCategories.includes(cat)} onChange={() => toggleCategory(cat)} size="small" color="primary" />}
                                    label={<Typography variant="body2">{cat}</Typography>}
                                />
                            ))}
                        </FormGroup>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>VZDÁLENOST (do {maxDistance} km):</Typography>
                        <Slider value={maxDistance} onChange={(e, val) => setMaxDistance(val)} min={1} max={100} valueLabelDisplay="auto" size="small" />
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2 }}>
                            <Typography variant="body2" sx={{ mr: 2, fontWeight: 'bold' }}>MIN. HODNOCENÍ:</Typography>
                            <Rating value={minRating} onChange={(e, val) => setMinRating(val || 0)} size="small" />
                        </Box>
                        <FormControlLabel
                            control={<Switch checked={hideVisited} onChange={(e) => setHideVisited(e.target.checked)} size="small" color="primary" />}
                            label={<Typography variant="body2">Skrýt navštívené</Typography>}
                            sx={{ mb: 1 }}
                        />
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>ŠTÍTKY:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {availableTags.map(tag => (
                                <Chip key={tag} label={tag} size="small" onClick={() => toggleTag(tag)}
                                    color={activeTags.includes(tag) ? "primary" : "default"}
                                    variant={activeTags.includes(tag) ? "filled" : "outlined"}
                                    sx={{ cursor: 'pointer' }}
                                />
                            ))}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>

            <Typography variant="h6" color="text.primary" gutterBottom sx={{ mt: 1 }}>Návrhy</Typography>

            {processedPlaces.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Zadaným filtrům neodpovídá žádné místo.</Typography>
            ) : (
                processedPlaces.map((place) => (
                    <Card key={place.id} sx={{ mb: 2, cursor: 'pointer', bgcolor: 'background.paper', '&:hover': { bgcolor: 'action.hover' } }} onClick={() => setSelectedPlace(place)}>
                        <CardContent>
                            <Typography variant="h6" color="text.primary">{place.title}</Typography>

                            {/* OPRAVA KATEGORIE A ZACHOVÁNÍ VZDÁLENOSTI I HODNOCENÍ */}
                            <Typography variant="body2" color="text.secondary">
                                {Array.isArray(place.category) ? place.category.join(', ') : place.category} • {place.distance} • {place.rating || 0} ★
                            </Typography>

                            {place.tags && place.tags.length > 0 && (
                                <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                    {place.tags.slice(0, 3).map(tag => (
                                        <Typography key={tag} variant="caption" sx={{ bgcolor: 'action.hover', px: 1, borderRadius: 1 }}>{tag}</Typography>
                                    ))}
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))
            )}
        </Box>
    );
}