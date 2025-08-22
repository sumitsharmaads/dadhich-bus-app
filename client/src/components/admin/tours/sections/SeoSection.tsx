"use client";

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Stack,
  Grid,
  Paper,
  Alert,
} from '@mui/material';
import { CreateTourRequest } from '@/lib/api/types/tour.types';

interface SeoSectionProps {
  form: CreateTourRequest;
  onFormChange: (field: keyof CreateTourRequest, value: any) => void;
  onNestedFormChange: (parentField: keyof CreateTourRequest, field: string, value: any) => void;
  errors: Record<string, string>;
}

const SeoSection: React.FC<SeoSectionProps> = ({
  form,
  onFormChange,
  onNestedFormChange,
  errors,
}) => {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !form.seo?.keywords?.includes(newKeyword.trim())) {
      const currentKeywords = form.seo?.keywords || [];
      onNestedFormChange('seo', 'keywords', [...currentKeywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (index: number) => {
    const currentKeywords = form.seo?.keywords || [];
    const updatedKeywords = currentKeywords.filter((_, i) => i !== index);
    onNestedFormChange('seo', 'keywords', updatedKeywords);
  };

  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const generateSeoRoutePath = () => {
    if (form.tourName) {
      const routePath = form.tourName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim();
      
      onNestedFormChange('seo', 'seoRoutePath', routePath);
    }
  };

  const generateSeoTitle = () => {
    if (form.tourName) {
      const seoTitle = `${form.tourName} - Best Tour Package | Your Company Name`;
      onNestedFormChange('seo', 'title', seoTitle);
    }
  };

  const generateSeoDescription = () => {
    if (form.shortDescription) {
      const seoDescription = `${form.shortDescription} Book your ${form.tourName} tour package with us. Get best deals and amazing experience.`;
      onNestedFormChange('seo', 'description', seoDescription);
    }
  };

  const generateSeoKeywords = () => {
    if (form.tourName || form.type?.length || form.category) {
      const baseKeywords = [form.tourName, form.category];
      const typeKeywords = form.type || [];
      const allKeywords = [...baseKeywords, ...typeKeywords, 'tour', 'package', 'travel', 'vacation'];
      
      // Remove duplicates and empty values
      const uniqueKeywords = [...new Set(allKeywords.filter(Boolean))];
      onNestedFormChange('seo', 'keywords', uniqueKeywords);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Section 7: SEO (Non-mandatory)
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>SEO Information:</strong> These fields help improve your tour's visibility in search engines. 
            You can use the auto-generate buttons to create SEO content based on your tour information.
          </Typography>
        </Alert>

        {/* SEO Title */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">SEO Title</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={generateSeoTitle}
              disabled={!form.tourName}
            >
              Auto-generate
            </Button>
          </Box>
          
          <TextField
            fullWidth
            label="SEO Title"
            value={form.seo?.title || ''}
            onChange={(e) => onNestedFormChange('seo', 'title', e.target.value)}
            placeholder="Enter SEO title for search engines (recommended: 50-60 characters)"
            helperText={`${(form.seo?.title || '').length}/60 characters`}
            multiline
            rows={2}
          />
        </Box>

        {/* SEO Description */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">SEO Description</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={generateSeoDescription}
              disabled={!form.shortDescription || !form.tourName}
            >
              Auto-generate
            </Button>
          </Box>
          
          <TextField
            fullWidth
            label="SEO Description"
            value={form.seo?.description || ''}
            onChange={(e) => onNestedFormChange('seo', 'description', e.target.value)}
            placeholder="Enter SEO description for search engines (recommended: 150-160 characters)"
            helperText={`${(form.seo?.description || '').length}/160 characters`}
            multiline
            rows={3}
          />
        </Box>

        {/* SEO Keywords */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">SEO Keywords</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={generateSeoKeywords}
              disabled={!form.tourName}
            >
              Auto-generate
            </Button>
          </Box>
          
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <TextField
              size="small"
              placeholder="Add SEO keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={handleKeywordKeyPress}
              sx={{ flex: 1 }}
            />
            <Button variant="contained" size="small" onClick={handleAddKeyword}>
              Add
            </Button>
          </Stack>
          
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {form.seo?.keywords?.map((keyword, index) => (
              <Chip
                key={index}
                label={keyword}
                onDelete={() => handleRemoveKeyword(index)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
          
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            Add relevant keywords that people might search for when looking for this type of tour.
          </Typography>
        </Box>

        {/* SEO Route Path */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="subtitle1">SEO Route Path</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={generateSeoRoutePath}
              disabled={!form.tourName}
            >
              Auto-generate
            </Button>
          </Box>
          
          <TextField
            fullWidth
            label="SEO Route Path"
            value={form.seoRoutePath || ''}
            onChange={(e) => onFormChange('seoRoutePath', e.target.value)}
            placeholder="Enter SEO-friendly URL path (e.g., 'best-kashmir-tour-package')"
            helperText="This will be used to create SEO-friendly URLs for your tour"
          />
        </Box>

        {/* SEO Preview */}
        {(form.seo?.title || form.seo?.description) && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Search Result Preview
            </Typography>
            
            <Paper sx={{ p: 2, bgcolor: 'grey.50', border: '1px solid #e0e0e0' }}>
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#1a0dab',
                    fontSize: '18px',
                    fontWeight: 400,
                    lineHeight: 1.2,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {form.seo?.title || 'SEO Title will appear here'}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#006621',
                    fontSize: '14px',
                    lineHeight: 1.2,
                  }}
                >
                  {form.seoRoutePath ? `yoursite.com/tours/${form.seoRoutePath}` : 'yoursite.com/tours/...'}
                </Typography>
              </Box>
              
              <Typography
                variant="body2"
                sx={{
                  color: '#545454',
                  fontSize: '13px',
                  lineHeight: 1.4,
                }}
              >
                {form.seo?.description || 'SEO description will appear here'}
              </Typography>
            </Paper>
            
            <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
              This is how your tour might appear in Google search results.
            </Typography>
          </Box>
        )}

        {/* SEO Tips */}
        <Paper sx={{ p: 2, bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            SEO Best Practices
          </Typography>
          <Typography variant="body2" color="primary.dark" sx={{ mb: 1 }}>
            • <strong>Title:</strong> Keep it under 60 characters, include your main keyword
          </Typography>
          <Typography variant="body2" color="primary.dark" sx={{ mb: 1 }}>
            • <strong>Description:</strong> Keep it under 160 characters, make it compelling
          </Typography>
          <Typography variant="body2" color="primary.dark" sx={{ mb: 1 }}>
            • <strong>Keywords:</strong> Use relevant, specific keywords (avoid overstuffing)
          </Typography>
          <Typography variant="body2" color="primary.dark">
            • <strong>Route Path:</strong> Use hyphens, keep it short and descriptive
          </Typography>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default SeoSection;
