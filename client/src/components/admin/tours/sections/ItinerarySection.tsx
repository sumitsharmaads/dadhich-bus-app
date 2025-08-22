"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { CreateTourRequest, TourItineraryItem } from '@/lib/api/types/tour.types';

interface ItinerarySectionProps {
  form: CreateTourRequest;
  onFormChange: (field: keyof CreateTourRequest, value: any) => void;
  errors: Record<string, string>;
}

const ItinerarySection: React.FC<ItinerarySectionProps> = ({
  form,
  onFormChange,
  errors,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  // Itinerary form state
  const [itineraryForm, setItineraryForm] = useState<Partial<TourItineraryItem>>({
    title: '',
    shortDescription: '',
    toggles: [],
    sightseeing: [],
    order: 0,
    day: 0,
    duration: '',
    meals: [],
    accommodation: '',
    transportation: '',
    highlights: [],
    notes: '',
  });

  // Temporary states for dynamic fields
  const [newToggle, setNewToggle] = useState('');
  const [newSightseeing, setNewSightseeing] = useState('');
  const [newMeal, setNewMeal] = useState('');
  const [newHighlight, setNewHighlight] = useState('');

  const handleAddToggle = () => {
    if (newToggle.trim() && !itineraryForm.toggles?.includes(newToggle.trim())) {
      setItineraryForm(prev => ({
        ...prev,
        toggles: [...(prev.toggles || []), newToggle.trim()]
      }));
      setNewToggle('');
    }
  };

  const handleRemoveToggle = (index: number) => {
    setItineraryForm(prev => ({
      ...prev,
      toggles: prev.toggles?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddSightseeing = () => {
    if (newSightseeing.trim() && !itineraryForm.sightseeing?.includes(newSightseeing.trim())) {
      setItineraryForm(prev => ({
        ...prev,
        sightseeing: [...(prev.sightseeing || []), newSightseeing.trim()]
      }));
      setNewSightseeing('');
    }
  };

  const handleRemoveSightseeing = (index: number) => {
    setItineraryForm(prev => ({
      ...prev,
      sightseeing: prev.sightseeing?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddMeal = () => {
    if (newMeal.trim() && !itineraryForm.meals?.includes(newMeal.trim())) {
      setItineraryForm(prev => ({
        ...prev,
        meals: [...(prev.meals || []), newMeal.trim()]
      }));
      setNewMeal('');
    }
  };

  const handleRemoveMeal = (index: number) => {
    setItineraryForm(prev => ({
      ...prev,
      meals: prev.meals?.filter((_, i) => i !== index) || []
    }));
  };

  const handleAddHighlight = () => {
    if (newHighlight.trim() && !itineraryForm.highlights?.includes(newHighlight.trim())) {
      setItineraryForm(prev => ({
        ...prev,
        highlights: [...(prev.highlights || []), newHighlight.trim()]
      }));
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setItineraryForm(prev => ({
      ...prev,
      highlights: prev.highlights?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = () => {
    if (!itineraryForm.title) return;

    const newItinerary: TourItineraryItem = {
      title: itineraryForm.title,
      shortDescription: itineraryForm.shortDescription || '',
      toggles: itineraryForm.toggles || [],
      sightseeing: itineraryForm.sightseeing || [],
      order: itineraryForm.order || 0,
      day: itineraryForm.day || 0,
      duration: itineraryForm.duration || '',
      meals: itineraryForm.meals || [],
      accommodation: itineraryForm.accommodation || '',
      transportation: itineraryForm.transportation || '',
      highlights: itineraryForm.highlights || [],
      notes: itineraryForm.notes || '',
    };

    if (editingIndex !== null) {
      // Edit existing itinerary
      const updatedItinerary = [...(form.itinerary || [])];
      updatedItinerary[editingIndex] = newItinerary;
      onFormChange('itinerary', updatedItinerary);
      setEditingIndex(null);
    } else {
      // Add new itinerary
      onFormChange('itinerary', [...(form.itinerary || []), newItinerary]);
    }

    // Reset form
    setItineraryForm({
      title: '',
      shortDescription: '',
      toggles: [],
      sightseeing: [],
      order: 0,
      day: 0,
      duration: '',
      meals: [],
      accommodation: '',
      transportation: '',
      highlights: [],
      notes: '',
    });
  };

  const handleEdit = (index: number) => {
    const item = form.itinerary?.[index];
    if (item) {
      setItineraryForm({
        title: item.title,
        shortDescription: item.shortDescription || '',
        toggles: item.toggles || [],
        sightseeing: item.sightseeing || [],
        order: item.order || 0,
        day: item.day || 0,
        duration: item.duration || '',
        meals: item.meals || [],
        accommodation: item.accommodation || '',
        transportation: item.transportation || '',
        highlights: item.highlights || [],
        notes: item.notes || '',
      });
      setEditingIndex(index);
    }
  };

  const handleDelete = (index: number) => {
    const updatedItinerary = form.itinerary?.filter((_, i) => i !== index) || [];
    onFormChange('itinerary', updatedItinerary);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setItineraryForm({
      title: '',
      shortDescription: '',
      toggles: [],
      sightseeing: [],
      order: 0,
      day: 0,
      duration: '',
      meals: [],
      accommodation: '',
      transportation: '',
      highlights: [],
      notes: '',
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Section 3: Itinerary (Non-mandatory)
        </Typography>

        {/* Add/Edit Itinerary Form */}
        <Box sx={{ mb: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            {editingIndex !== null ? 'Edit Itinerary Item' : 'Add New Itinerary Item'}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Title *"
                value={itineraryForm.title}
                onChange={(e) => setItineraryForm(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Short Description"
                value={itineraryForm.shortDescription}
                onChange={(e) => setItineraryForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Order"
                type="number"
                value={itineraryForm.order}
                onChange={(e) => setItineraryForm(prev => ({ ...prev, order: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Day"
                type="number"
                value={itineraryForm.day}
                onChange={(e) => setItineraryForm(prev => ({ ...prev, day: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Duration"
                value={itineraryForm.duration}
                onChange={(e) => setItineraryForm(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="e.g., 2 hours, Full day"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Accommodation"
                value={itineraryForm.accommodation}
                onChange={(e) => setItineraryForm(prev => ({ ...prev, accommodation: e.target.value }))}
                placeholder="e.g., Hotel name, Camping"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Transportation"
                value={itineraryForm.transportation}
                onChange={(e) => setItineraryForm(prev => ({ ...prev, transportation: e.target.value }))}
                placeholder="e.g., Bus, Train, Flight"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={itineraryForm.notes}
                onChange={(e) => setItineraryForm(prev => ({ ...prev, notes: e.target.value }))}
                multiline
                rows={2}
                placeholder="Additional notes or instructions"
              />
            </Grid>

            {/* Toggles */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Toggles
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add toggle option"
                  value={newToggle}
                  onChange={(e) => setNewToggle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddToggle()}
                />
                <Button variant="contained" size="small" onClick={handleAddToggle}>
                  Add
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {itineraryForm.toggles?.map((toggle, index) => (
                  <Chip
                    key={index}
                    label={toggle}
                    onDelete={() => handleRemoveToggle(index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Grid>

            {/* Sightseeing */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Sightseeing Places
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add sightseeing place"
                  value={newSightseeing}
                  onChange={(e) => setNewSightseeing(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSightseeing()}
                />
                <Button variant="contained" size="small" onClick={handleAddSightseeing}>
                  Add
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {itineraryForm.sightseeing?.map((place, index) => (
                  <Chip
                    key={index}
                    label={place}
                    onDelete={() => handleRemoveSightseeing(index)}
                    color="secondary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Grid>

            {/* Meals */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Meals
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add meal option"
                  value={newMeal}
                  onChange={(e) => setNewMeal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddMeal()}
                />
                <Button variant="contained" size="small" onClick={handleAddMeal}>
                  Add
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {itineraryForm.meals?.map((meal, index) => (
                  <Chip
                    key={index}
                    label={meal}
                    onDelete={() => handleRemoveMeal(index)}
                    color="success"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Grid>

            {/* Highlights */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Highlights
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Add highlight"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddHighlight()}
                />
                <Button variant="contained" size="small" onClick={handleAddHighlight}>
                  Add
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {itineraryForm.highlights?.map((highlight, index) => (
                  <Chip
                    key={index}
                    label={highlight}
                    onDelete={() => handleRemoveHighlight(index)}
                    color="warning"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSubmit}>
              {editingIndex !== null ? 'Update' : 'Add'} Itinerary Item
            </Button>
            {editingIndex !== null && (
              <Button variant="outlined" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </Box>
        </Box>

        {/* Itinerary List */}
        {form.itinerary && form.itinerary.length > 0 ? (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Current Itinerary ({form.itinerary.length} items)
            </Typography>
            
            {form.itinerary.map((item, index) => (
              <Accordion
                key={index}
                expanded={expandedItem === index}
                onChange={() => setExpandedItem(expandedItem === index ? null : index)}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <Typography variant="subtitle2">
                      Day {item.day || index + 1}: {item.title}
                    </Typography>
                    <Box>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleEdit(index); }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(index); }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Description:</strong> {item.shortDescription || 'No description'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Duration:</strong> {item.duration || 'Not specified'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Accommodation:</strong> {item.accommodation || 'Not specified'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="textSecondary">
                        <strong>Transportation:</strong> {item.transportation || 'Not specified'}
                      </Typography>
                    </Grid>
                    {item.toggles && item.toggles.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Toggles:</strong>
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          {item.toggles.map((toggle, i) => (
                            <Chip key={i} label={toggle} size="small" />
                          ))}
                        </Stack>
                      </Grid>
                    )}
                    {item.sightseeing && item.sightseeing.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Sightseeing:</strong>
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          {item.sightseeing.map((place, i) => (
                            <Chip key={i} label={place} size="small" color="secondary" />
                          ))}
                        </Stack>
                      </Grid>
                    )}
                    {item.meals && item.meals.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Meals:</strong>
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          {item.meals.map((meal, i) => (
                            <Chip key={i} label={meal} size="small" color="success" />
                          ))}
                        </Stack>
                      </Grid>
                    )}
                    {item.highlights && item.highlights.length > 0 && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Highlights:</strong>
                        </Typography>
                        <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                          {item.highlights.map((highlight, i) => (
                            <Chip key={i} label={highlight} size="small" color="warning" />
                          ))}
                        </Stack>
                      </Grid>
                    )}
                    {item.notes && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Notes:</strong> {item.notes}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ) : (
          <Typography color="textSecondary" sx={{ fontStyle: 'italic' }}>
            No itinerary items added yet. Use the form above to add your tour itinerary.
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ItinerarySection;
