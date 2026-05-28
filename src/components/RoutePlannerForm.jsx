import { useState } from 'react';
import { Box, Button, Typography, ToggleButtonGroup, ToggleButton, List, ListItem, ListItemText, IconButton, Autocomplete, TextField, Paper, Divider } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PlaceIcon from '@mui/icons-material/Place';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { useStore } from '../store/useStore';

// --- DND KIT IMPORTY ---
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableRouteItem({ point, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: point.routeId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 'auto',
        position: 'relative',
        borderRadius: '8px',
    };

    return (
        <ListItem
            ref={setNodeRef}
            style={style}
            disablePadding
            sx={{ mb: 0.5 }}
            secondaryAction={
                <IconButton edge="end" size="small" onClick={() => onRemove(point.routeId)} sx={{ color: 'error.main' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            }
        >
            <Box {...attributes} {...listeners} sx={{ display: 'flex', alignItems: 'center', cursor: 'grab', p: 1, touchAction: 'none' }}>
                <DragIndicatorIcon color="disabled" sx={{ mr: 0.5, fontSize: 20 }} />
                <PlaceIcon color="action" sx={{ mr: 1, fontSize: 20 }} />
            </Box>
            <ListItemText primary={point.title} primaryTypographyProps={{ variant: 'body2', color: 'text.primary' }} />
        </ListItem>
    );
}

export default function RoutePlannerForm({ onClose }) {
    const [transportMode, setTransportMode] = useState('car');
    const { places, routePoints, addRoutePoint, removeRoutePoint, setRoutePoints, saveRoute } = useStore();

    const handleClose = () => { if (onClose) onClose(); };

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = routePoints.findIndex((item) => item.routeId === active.id);
        const newIndex = routePoints.findIndex((item) => item.routeId === over.id);
        setRoutePoints(arrayMove(routePoints, oldIndex, newIndex));
    };

    const fixedPoint = routePoints[0];
    const draggablePoints = routePoints.slice(1);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1, overflowY: 'auto', pb: 2 }}>
            <ToggleButtonGroup
                value={transportMode}
                exclusive
                onChange={(e, newValue) => { if (newValue !== null) setTransportMode(newValue); }}
                fullWidth
                size="small"
            >
                <ToggleButton value="car"><DirectionsCarIcon sx={{ mr: 1 }} /> Autem</ToggleButton>
                <ToggleButton value="walk"><DirectionsWalkIcon sx={{ mr: 1 }} /> Pěšky</ToggleButton>
            </ToggleButtonGroup>

            <Autocomplete
                options={places}
                getOptionLabel={(option) => option.title}
                value={null}
                onChange={(event, newValue) => { if (newValue) addRoutePoint({ ...newValue, routeId: Date.now().toString() }); }}
                renderInput={(params) => <TextField {...params} label="Přidat místo do trasy" variant="outlined" />}
                renderOption={(props, option) => {
                    const { key, ...otherProps } = props;
                    return (
                        <Box component="li" key={key} {...otherProps} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ flexGrow: 1 }}>{option.title}</Typography>
                            <AddIcon color="primary" fontSize="small" />
                        </Box>
                    );
                }}
            />

            {/* Zde proběhla změna na background.paper a dynamický border */}
            <Paper variant="outlined" sx={{
                borderRadius: 2,
                bgcolor: 'background.paper',
                p: 1,
                height: '260px',
                overflowY: 'auto',
                overflowX: 'hidden', // Tohle tam máš, to je správně
                boxSizing: 'border-box', // PŘIDAT: Zajistí, že padding se nepočítá do šířky
                flexShrink: 0,
                borderColor: 'divider',
                width: '100%' // PŘIDAT: Explicitní šířka pro jistotu
            }}>
                <List dense disablePadding>
                    {fixedPoint && (
                        <ListItem disablePadding sx={{ mb: 1, p: 1, borderBottom: 1, borderColor: 'divider' }}>
                            <Box sx={{ width: 28, mr: 0.5 }} />
                            <MyLocationIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                            <ListItemText primary={fixedPoint.title} primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold', color: 'text.primary' }} />
                        </ListItem>
                    )}

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={draggablePoints.map(p => p.routeId)} strategy={verticalListSortingStrategy}>
                            {draggablePoints.map((point) => (
                                <SortableRouteItem key={point.routeId} point={point} onRemove={removeRoutePoint} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </List>
            </Paper>

            <Box sx={{ flexGrow: 1 }} />

            <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => {
                    saveRoute({
                        id: Date.now().toString(),
                        name: `Trasa: ${fixedPoint?.title || 'Start'} -> ${draggablePoints.length > 0 ? draggablePoints[0].title : '...'}`,
                        points: routePoints,
                        date: new Date().toLocaleDateString()
                    });
                    handleClose();
                }}
                sx={{ mb: 1 }}
            >
                Uložit trasu
            </Button>

            <Button variant="outlined" color="inherit" size="large" fullWidth onClick={handleClose} sx={{ mb: 2 }}>
                Zpět na přehled
            </Button>
        </Box>
    );
}