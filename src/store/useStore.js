import { create } from 'zustand';
import { mockPlaces } from '../data/mockPlaces';

export const useStore = create((set) => ({
    places: mockPlaces,
    selectedPlace: null,
    setSelectedPlace: (place) => set({ selectedPlace: place }),

    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),

    // --- ÚKLID POHLEDŮ ---
    // Tato funkce vynuluje všechny aktivní stavy zobrazení.
    // Důležité pro to, aby se v sidebar neotvíraly formuláře přes sebe.
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

    // --- FILTRY ---
    maxDistance: 50,
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

    // --- STAVY POHLEDŮ ---
    isAddingPlace: false,
    setIsAddingPlace: (isAdding) => set({ isAddingPlace: isAdding, selectedPlace: null }),

    draftLocation: null,
    setDraftLocation: (location) => set({ draftLocation: location }),

    isAboutOpen: false,
    setIsAboutOpen: (isOpen) => set({ isAboutOpen: isOpen }),

    // --- PLÁNOVAČ TRAS ---
    isPlanningRoute: false,
    setIsPlanningRoute: (isPlanning) => set({ isPlanningRoute: isPlanning }),

    isViewingVisited: false,
    setIsViewingVisited: (viewing) => set({ isViewingVisited: viewing }),

    isViewingCreatedPlaces: false,
    setIsViewingCreatedPlaces: (viewing) => set({ isViewingCreatedPlaces: viewing }),

    // Resetuje trasu do výchozího stavu (pouze moje poloha)
    clearRoute: () => set({
        isPlanningRoute: false,
        routePoints: [
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

    // Smaže trasu ze seznamu uložených tras
    removeRoute: (id) => set((state) => ({
        savedRoutes: state.savedRoutes.filter(r => r.id !== id)
    })),

    // Body aktuálně plánované trasy
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

    // --- DATA MÍST ---
    // Přepne příznak navštívení u místa a aktualizuje i detail, pokud je otevřený
    toggleVisited: (id) => set((state) => {
        const updatedPlaces = state.places.map(p =>
            p.id === id ? { ...p, isVisited: !p.isVisited } : p
        );
        const updatedSelected = state.selectedPlace?.id === id
            ? updatedPlaces.find(p => p.id === id)
            : state.selectedPlace;

        return { places: updatedPlaces, selectedPlace: updatedSelected };
    }),

    // Nastaví hodnocení a automaticky označí místo jako navštívené
    setRating: (id, rating) => set((state) => {
        const updatedPlaces = state.places.map(p =>
            p.id === id ? { ...p, rating: rating, isVisited: true } : p
        );
        const updatedSelected = state.selectedPlace?.id === id
            ? updatedPlaces.find(p => p.id === id)
            : state.selectedPlace;

        return { places: updatedPlaces, selectedPlace: updatedSelected };
    }),

    // Přidá nové místo vytvořené uživatelem
    addPlace: (newPlaceData) => set((state) => {
        const newPlace = {
            ...newPlaceData,
            id: Date.now().toString(),
            rating: 0,
            distance: '0 m',
            isCreatedByUser: true
        };
        return {
            places: [...state.places, newPlace],
            isAddingPlace: false,
            draftLocation: null,
            selectedPlace: newPlace
        };
    }),

    // Odstraní uživatelem vytvořené místo
    removePlace: (id) => set((state) => ({
        places: state.places.filter(p => p.id !== id),
        selectedPlace: state.selectedPlace?.id === id ? null : state.selectedPlace
    })),
}));