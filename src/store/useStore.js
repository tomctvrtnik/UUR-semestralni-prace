import { create } from 'zustand';
import { mockPlaces } from '../data/mockPlaces';

export const useStore = create((set) => ({
    places: mockPlaces,
    selectedPlace: null,
    setSelectedPlace: (place) => set({ selectedPlace: place }),

    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),

    // --- ÚKLID POHLEDŮ (Zabrání překrývání) ---
    clearViews: () => set({
        selectedPlace: null,
        isAddingPlace: false,
        isPlanningRoute: false,
        isViewingRoutes: false,
        isViewingVisited: false,
        isViewingCreatedPlaces: false
    }),



    activeCategories: [],
    toggleCategory: (category) => set((state) => {
        if (state.activeCategories.includes(category)) {
            return { activeCategories: state.activeCategories.filter(c => c !== category) };
        } else {
            return { activeCategories: [...state.activeCategories, category] };
        }
    }),

    isDarkMode: false,
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

    sortBy: 'relevance',
    setSortBy: (sortType) => set({ sortBy: sortType }),

    mobileSnap: 0.5,
    setMobileSnap: (snap) => set({ mobileSnap: snap }),

    // --- NOVÉ FILTRY ---
    maxDistance: 50, // Výchozí hodnota slideru (do 50 km)
    setMaxDistance: (dist) => set({ maxDistance: dist }),

    hideVisited: false,
    setHideVisited: (hide) => set({ hideVisited: hide }),

    minRating: 0,
    setMinRating: (rating) => set({ minRating: rating }),

    activeTags: [],
    toggleTag: (tag) => set((state) => {
        if (state.activeTags.includes(tag)) {
            return { activeTags: state.activeTags.filter(t => t !== tag) };
        } else {
            return { activeTags: [...state.activeTags, tag] };
        }
    }),

    // --- PŘIDÁVÁNÍ MÍSTA ---
    isAddingPlace: false,
    setIsAddingPlace: (isAdding) => set({ isAddingPlace: isAdding, selectedPlace: null }),

    draftLocation: null,
    setDraftLocation: (location) => set({ draftLocation: location }),

    // --- PLÁNOVAČ TRAS ---
    isPlanningRoute: false,
    setIsPlanningRoute: (isPlanning) => set({ isPlanningRoute: isPlanning }),

    isViewingVisited: false,
    setIsViewingVisited: (viewing) => set({ isViewingVisited: viewing }),

    isViewingCreatedPlaces: false,
    setIsViewingCreatedPlaces: (viewing) => set({ isViewingCreatedPlaces: viewing }),

    clearRoute: () => set({
        isPlanningRoute: false, // Vypne režim plánování na mapě
        routePoints: [ // Vrátí pole s body do továrního nastavení
            {
                id: 'user-loc',
                title: 'Moje poloha',
                lat: 49.7475,
                lng: 13.3776,
                routeId: 'start',
                isFixed: true
            }
        ]
    }),

    // --- MOJE TRASY ---
    isViewingRoutes: false,
    setIsViewingRoutes: (isViewing) => set({ isViewingRoutes: isViewing }),
    savedRoutes: [],
    saveRoute: (route) => set((state) => ({ savedRoutes: [...state.savedRoutes, route] })),

    removeRoute: (id) => set((state) => ({
        savedRoutes: state.savedRoutes.filter(r => r.id !== id)
    })),

    routePoints: [
        {
            id: 'user-loc',
            title: 'Moje poloha',
            lat: 49.7475,
            lng: 13.3776,
            routeId: 'start',
            isFixed: true
        }
    ],

    addRoutePoint: (place) => set((state) => ({
        routePoints: [...state.routePoints, { ...place, routeId: Date.now().toString() }]
    })),

    removeRoutePoint: (routeId) => set((state) => ({
        routePoints: state.routePoints.filter(p => p.routeId !== routeId)
    })),

    setRoutePoints: (newPoints) => set({ routePoints: newPoints }),

    showMockRoute: false,
    setShowMockRoute: (show) => set({ showMockRoute: show }),

    // --- HODNOCENÍ A NAVŠTÍVENO ---
    // --- HODNOCENÍ A NAVŠTÍVENO ---
    toggleVisited: (id) => set((state) => {
        const updatedPlaces = state.places.map(p =>
            p.id === id ? { ...p, isVisited: !p.isVisited } : p
        );
        // Aktualizujeme i selectedPlace, pokud je to to samé místo
        const updatedSelected = state.selectedPlace?.id === id
            ? updatedPlaces.find(p => p.id === id)
            : state.selectedPlace;

        return { places: updatedPlaces, selectedPlace: updatedSelected };
    }),

    setRating: (id, rating) => set((state) => {
        const updatedPlaces = state.places.map(p =>
            p.id === id ? { ...p, rating: rating, isVisited: true } : p
        );
        // Aktualizujeme i selectedPlace, pokud je to to samé místo
        const updatedSelected = state.selectedPlace?.id === id
            ? updatedPlaces.find(p => p.id === id)
            : state.selectedPlace;

        return { places: updatedPlaces, selectedPlace: updatedSelected };
    }),

    // --- ADD PLACE ---
    addPlace: (newPlaceData) => set((state) => {
        const newPlace = {
            ...newPlaceData,
            id: Date.now().toString(),
            rating: 0,
            distance: '0 m',
            isCreatedByUser: true // <--- PŘIDÁNO: Označení vlastního místa
        };
        return {
            places: [...state.places, newPlace],
            isAddingPlace: false,
            draftLocation: null,
            selectedPlace: newPlace
        };
    }),

    // --- SMAZÁNÍ VLASTNÍHO MÍSTA ---
    removePlace: (id) => set((state) => ({
        places: state.places.filter(p => p.id !== id),
        // Pokud zrovna prohlížíme detail místa, které mažeme, tak ho zavřeme
        selectedPlace: state.selectedPlace?.id === id ? null : state.selectedPlace
    })),
}));