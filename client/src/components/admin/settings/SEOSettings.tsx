"use client";

import React, { useEffect, useState } from "react";
import { WebsiteInfoType } from "@/types";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { Save, Edit, Add } from "@mui/icons-material";

const SEOSettings: React.FC<{
  settings: WebsiteInfoType;
  onSave: (updated: Partial<WebsiteInfoType>) => void;
}> = ({ settings, onSave }) => {
  const [form, setForm] = useState({
    metaTitle: "",
    metaDescription: "",
    metaKeywords: [] as string[],
    ogImageUrl: "",
  });
  const [newKeyword, setNewKeyword] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        metaTitle: settings.seo?.metaTitle || "",
        metaDescription: settings.seo?.metaDescription || "",
        metaKeywords: settings.seo?.metaKeywords || [],
        ogImageUrl: settings.seo?.ogImageUrl || "",
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addKeyword = () => {
    if (!newKeyword.trim() || form.metaKeywords.includes(newKeyword.trim()))
      return;
    setForm((prev) => ({
      ...prev,
      metaKeywords: [...prev.metaKeywords, newKeyword.trim()],
    }));
    setNewKeyword("");
  };

  const removeKeyword = (keywordToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      metaKeywords: prev.metaKeywords.filter(
        (keyword) => keyword !== keywordToRemove
      ),
    }));
  };

  const save = () => {
    onSave({
      seo: {
        metaTitle: form.metaTitle,
        metaDescription: form.metaDescription,
        metaKeywords: form.metaKeywords,
        ogImageUrl: form.ogImageUrl,
      },
    } as any);
    setEditing(false);
  };

  const cancel = () => {
    setForm({
      metaTitle: settings.seo?.metaTitle || "",
      metaDescription: settings.seo?.metaDescription || "",
      metaKeywords: settings.seo?.metaKeywords || [],
      ogImageUrl: settings.seo?.ogImageUrl || "",
    });
    setNewKeyword("");
    setEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="subtitle1">SEO Settings</Typography>
        {!editing ? (
          <Button
            startIcon={<Edit />}
            onClick={() => setEditing(true)}
            size="small"
          >
            Edit
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button onClick={cancel} size="small">
              Cancel
            </Button>
            <Button
              startIcon={<Save />}
              onClick={save}
              variant="contained"
              size="small"
            >
              Save
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Meta Title"
            name="metaTitle"
            value={form.metaTitle}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            placeholder="Enter page title for search engines"
            helperText="Recommended: 50-60 characters"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Meta Description"
            name="metaDescription"
            value={form.metaDescription}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            multiline
            rows={3}
            placeholder="Enter page description for search engines"
            helperText="Recommended: 150-160 characters"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="OG Image URL"
            name="ogImageUrl"
            value={form.ogImageUrl}
            onChange={handleChange}
            fullWidth
            size="small"
            disabled={!editing}
            placeholder="https://example.com/image.jpg"
            helperText="Image displayed when sharing on social media"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Meta Keywords
        </Typography>
        {editing && (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            sx={{ mb: 2 }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder="Add keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              helperText="Press Enter to add keyword"
            />
            <Button
              variant="contained"
              onClick={addKeyword}
              startIcon={<Add />}
              disabled={
                !newKeyword.trim() ||
                form.metaKeywords.includes(newKeyword.trim())
              }
            >
              Add
            </Button>
          </Stack>
        )}

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {form.metaKeywords.map((keyword, index) => (
            <Chip
              key={`${keyword}-${index}`}
              label={keyword}
              onDelete={editing ? () => removeKeyword(keyword) : undefined}
              color="secondary"
              variant="outlined"
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </Box>

      {!editing && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {!form.metaTitle && !form.metaDescription
            ? "No SEO settings configured. Add meta information to improve search engine visibility."
            : "SEO settings are configured for this website."}
        </Typography>
      )}
    </Box>
  );
};

export default SEOSettings;
