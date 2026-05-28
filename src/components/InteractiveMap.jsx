import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './InteractiveMap.css';
import { useStore } from '../store/useStore';
import { useMediaQuery, useTheme } from '@mui/material';

// --- POMOCNÁ FUNKCE PRO VZDÁLENOST ---
const getDistanceInKm = (distanceStr) => {
    if (!distanceStr) return 0;
    const val = parseFloat(distanceStr);
    if (distanceStr.includes('km')) return val;
    return val / 1000;
};

// --- DEFINICE IKON ---
const redIcon = L.divIcon({
    className: 'custom-pin-wrapper',
    html: '<div class="custom-pin"></div>',
    iconSize: [52, 52],
    iconAnchor: [26, 52],
    popupAnchor: [0, -50]
});

const blueIcon = L.divIcon({
    className: 'custom-pin-wrapper',
    html: '<div class="custom-pin" style="background-color: #009FB7;"></div>',
    iconSize: [52, 52],
    iconAnchor: [26, 52],
    popupAnchor: [0, -50]
});

const draftIcon = L.divIcon({
    className: 'custom-pin-wrapper',
    html: '<div class="custom-pin" style="background-color: #FF9800;"></div>',
    iconSize: [52, 52],
    iconAnchor: [26, 52],
    popupAnchor: [0, -50]
});

const userIcon = L.divIcon({
    className: 'user-location-wrapper',
    html: '<div class="user-location-pulse"></div><div class="user-location-dot"></div>',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
});

// --- ZACHYTÁVÁNÍ KLIKNUTÍ A ZOOMU ---
function MapEvents({ onZoomChange }) {
    const { isPlanningRoute, isAddingPlace, setDraftLocation, setSelectedPlace, setMobileSnap } = useStore();

    const map = useMapEvents({
        click: (e) => {
            if (isPlanningRoute) return;

            if (isAddingPlace) {
                setDraftLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
                return;
            }

            setSelectedPlace(null);
            setMobileSnap(0.1);
        },
        zoomend: () => {
            if (onZoomChange) onZoomChange(map.getZoom());
        }
    });
    return null;
}

// --- KONTROLÉR PRO KAMERU ---
function MapController() {
    const map = useMap();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const { selectedPlace } = useStore();

    useEffect(() => {
        if (selectedPlace) {
            const targetZoom = 16;
            const targetPoint = map.project([selectedPlace.lat, selectedPlace.lng], targetZoom);

            if (isMobile) {
                const yOffset = map.getSize().y / 4;
                targetPoint.y += yOffset;
            }

            const targetLatLng = map.unproject(targetPoint, targetZoom);

            map.flyTo(targetLatLng, targetZoom, {
                animate: true,
                duration: 1.5
            });
        }
    }, [selectedPlace, map, isMobile]);

    useEffect(() => {
        const mapContainer = map.getContainer();
        const resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.observe(mapContainer);
        return () => resizeObserver.disconnect();
    }, [map]);

    return null;
}

// =========================================================
export default function InteractiveMap() {
    const mapCenter = [49.745, 13.377];
    const mockedUserLocation = [49.7475, 13.3776];

    const [currentZoom, setCurrentZoom] = useState(15);
    const SHOW_LABELS_ZOOM_THRESHOLD = 16;

    const {
        places,
        setSelectedPlace,
        searchQuery,
        activeCategories,
        setMobileSnap,
        isAddingPlace,
        draftLocation,
        isPlanningRoute,
        routePoints,
        addRoutePoint,
        isViewingVisited,
        isViewingCreatedPlaces,
        maxDistance,
        hideVisited,
        minRating,
        activeTags,
        isDarkMode // Tmavý režim ze storu
    } = useStore();

    // --- FILTRAČNÍ LOGIKA ---
    let filteredPlaces = [];

    if (isViewingVisited) {
        filteredPlaces = (places || []).filter(p => p.isVisited);
    } else if (isViewingCreatedPlaces) {
        filteredPlaces = (places || []).filter(p => p.isCreatedByUser);
    } else {
        filteredPlaces = (places || []).filter(place => {
            const title = place.title || '';
            const matchesSearch = title.toLowerCase().includes((searchQuery || '').toLowerCase());
            const placeCategories = Array.isArray(place.category) ? place.category : [place.category].filter(Boolean);
            const matchesCategory = (activeCategories || []).length === 0 || placeCategories.some(c => activeCategories.includes(c));
            const matchesDistance = getDistanceInKm(place.distance) <= (maxDistance || 50);
            const matchesHideVisited = hideVisited ? !place.isVisited : true;
            const matchesRating = (place.rating || 0) >= (minRating || 0);
            const matchesTags = (activeTags || []).length === 0 || activeTags.every(tag => (place.tags || []).includes(tag));

            return matchesSearch && matchesCategory && matchesDistance && matchesHideVisited && matchesRating && matchesTags;
        });
    }

    const routeCoordinates = (routePoints || []).map(point => [point.lat, point.lng]);

    return (
        <MapContainer center={mapCenter} zoom={currentZoom} zoomControl={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>

            {/* Dynamický mapový podklad podle režimu */}
            {isDarkMode ? (
                <TileLayer
                    key="dark"
                    attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                />
            ) : (
                <TileLayer
                    key="light"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            )}
            <MapController />
            <MapEvents onZoomChange={setCurrentZoom} />

            <Marker position={mockedUserLocation} icon={userIcon} zIndexOffset={1000} />

            {/* TRASA */}
            {isPlanningRoute && (
                <>
                    {routeCoordinates.length > 1 && (
                        <Polyline positions={routeCoordinates} color="#009FB7" weight={5} opacity={0.8} />
                    )}
                    {(routePoints || []).map((point) => (
                        !point.isFixed && (
                            <Marker
                                key={`route-marker-${point.routeId}`}
                                position={[point.lat, point.lng]}
                                icon={blueIcon}
                                zIndexOffset={900}
                            />
                        )
                    ))}
                </>
            )}

            {/* BĚŽNÁ MÍSTA */}
            {filteredPlaces.map((place) => (
                <Marker
                    key={place.id}
                    position={[place.lat, place.lng]}
                    icon={redIcon}
                    eventHandlers={{
                        click: () => {
                            if (!isPlanningRoute) {
                                setSelectedPlace(place);
                                setMobileSnap(0.5);
                            } else {
                                addRoutePoint({ ...place, routeId: Date.now().toString() });
                            }
                        }
                    }}
                >
                    {currentZoom >= SHOW_LABELS_ZOOM_THRESHOLD && (
                        <Tooltip permanent direction="bottom" offset={[0, 0]} className="custom-tooltip-label">
                            {place.title}
                        </Tooltip>
                    )}
                </Marker>
            ))}

            {isAddingPlace && draftLocation && (
                <Marker position={[draftLocation.lat, draftLocation.lng]} icon={draftIcon} zIndexOffset={1000} />
            )}
        </MapContainer>
    );
}