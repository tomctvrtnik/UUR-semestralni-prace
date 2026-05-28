import { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
    OutlinedInput,
    Typography,
    Alert
} from '@mui/material';
import { useStore } from '../store/useStore';

const categories = ['Příroda', 'Veřejné', 'Placené'];
const availableTags = ['Vhodné pro děti', 'Se psem', 'Parkování', 'Historie', 'Krásný výhled', 'Filmové lokace'];

export default function AddPlaceForm({ onClose }) {
    const { addPlace, draftLocation } = useStore();

    // Lokální stavy formuláře
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Záchytná brzda, kdyby náhodou uživatel neklikl do mapy
        if (!draftLocation) return;

        // Odeslání nového místa do storu
        addPlace({
            title,
            description,
            category: selectedCategories, // Uloží se už jako pole
            tags: selectedTags,
            lat: draftLocation.lat,
            lng: draftLocation.lng
        });
    };

    // Zpracování změny u multi-selectu
    const handleTagChange = (event) => {
        const {
            target: { value },
        } = event;
        // typeof value === 'string' je pojistka pro určité způsoby vybrání v MUI
        setSelectedTags(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleCategoryChange = (event) => {
        const { target: { value } } = event;
        setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

            {!draftLocation && (
                <Alert severity="info">
                    Kliknutím do mapy vyberte, kde se místo nachází.
                </Alert>
            )}

            <TextField
                label="Název místa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
            />

            <TextField
                label="Popis"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                required
                fullWidth
            />

            <FormControl required fullWidth>
                <InputLabel id="category-label">Kategorie (lze vybrat více)</InputLabel>
                <Select
                    labelId="category-label"
                    multiple
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                    input={<OutlinedInput label="Kategorie (lze vybrat více)" />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            <Checkbox checked={selectedCategories.indexOf(cat) > -1} />
                            <ListItemText primary={cat} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* MULTI-SELECT PRO ŠTÍTKY */}
            <FormControl fullWidth>
                <InputLabel id="tags-label">Štítky (lze vybrat více)</InputLabel>
                <Select
                    labelId="tags-label"
                    multiple
                    value={selectedTags}
                    onChange={handleTagChange}
                    input={<OutlinedInput label="Štítky (lze vybrat více)" />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {availableTags.map((tag) => (
                        <MenuItem key={tag} value={tag}>
                            <Checkbox checked={selectedTags.indexOf(tag) > -1} />
                            <ListItemText primary={tag} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                // Opraveno: kontrolujeme, jestli pole selectedCategories není prázdné
                disabled={!draftLocation || !title || selectedCategories.length === 0}
                sx={{ mt: 2 }}
            >
                Vytvořit místo
            </Button>
        </Box>
    );
}