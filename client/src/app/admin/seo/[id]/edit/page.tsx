"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { routeOptions, getRouteKey } from "@/utils/seo";
import { useRouter, useParams } from "next/navigation";
import { get, put } from "@/lib/service";

const EditSEOPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [form, setForm] = useState({
    route: "",
    title: "",
    description: "",
    keywords: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const res = await get<{ success: boolean; data: any }>(`/seo/${id}`);
        const data = (res as any)?.data;
        const d = data?.data || data; // fallback if controller returns in different shape
        if (d) {
          setForm({
            route: d.route || "",
            title: d.title || "",
            description: d.description || "",
            keywords: d.keywords || "",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSEO();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await put(`/seo/${id}`, form);
      router.push("/admin/seo");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => router.push("/admin/seo")}
            sx={{ minWidth: "auto" }}
          />
          <Typography variant="h4" fontWeight={600}>
            Edit SEO
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Update route SEO metadata
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                label="Route"
                name="route"
                value={form.route}
                onChange={handleChange}
                fullWidth
                disabled
              >
                {Object.entries(routeOptions).map(([key, path]) => (
                  <MenuItem key={key} value={path}>
                    {key}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                value={form.title}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                fullWidth
                multiline
                minRows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Keywords (comma separated)"
                name="keywords"
                value={form.keywords}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}
          >
            <Button
              variant="outlined"
              onClick={() => router.push("/admin/seo")}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Updating..." : "Update SEO"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditSEOPage;
