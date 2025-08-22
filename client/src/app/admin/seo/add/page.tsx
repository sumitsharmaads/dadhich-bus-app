"use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { routeOptions } from "@/utils/seo";
import { post } from "@/lib/service";
import { useRouter } from "next/navigation";

const AddSEOPage: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    route: "",
    title: "",
    description: "",
    keywords: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await post("/seo", form);
      router.push("/admin/seo");
    } finally {
      setSaving(false);
    }
  };

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
            Add SEO
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Create SEO metadata for a route
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
              {saving ? "Saving..." : "Save SEO"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AddSEOPage;
