"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Stack,
  Grid,
  Card,
  CardContent,
  TextField,
} from "@mui/material";
import { Save, Restore } from "@mui/icons-material";
import { termsService } from "@/lib/api/services/terms.service";
import RichTextEditor from "@/components/common/RichTextEditor";
import { successPopup, errorPopup } from "@/utils/errors/alerts";
import dayjs from "dayjs";

interface TermsDoc {
  _id: string;
  title: string;
  text: string;
  version: number;
  isCurrent: boolean;
  updatedAt: string;
  createdAt: string;
}

const AdminTermsPage: React.FC = () => {
  const [termsTitle, setTermsTitle] = useState("Terms & Conditions");
  const [originalTitle, setOriginalTitle] = useState("Terms & Conditions");
  const [termsHtml, setTermsHtml] = useState("");
  const [originalHtml, setOriginalHtml] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | undefined>(undefined);

  const fetchTerms = async () => {
    setLoading(true);
    try {
      const res = await termsService.getCurrentTerms();
      if (res.success && res.data) {
        setTermsTitle(res.data.title);
        setOriginalTitle(res.data.title);
        setTermsHtml(res.data.text);
        setOriginalHtml(res.data.text);
        setUpdatedAt(res.data.updatedAt);
      } else {
        setTermsTitle("Terms & Conditions");
        setOriginalTitle("Terms & Conditions");
        setTermsHtml("");
        setOriginalHtml("");
        setUpdatedAt(undefined);
      }
    } catch (e) {
      errorPopup("Failed to load terms");
      setTermsTitle("Terms & Conditions");
      setOriginalTitle("Terms & Conditions");
      setTermsHtml("");
      setOriginalHtml("");
      setUpdatedAt(undefined);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTerms();
  }, []);

  const handleSave = async () => {
    // validate title and content
    if (!termsTitle.trim()) {
      errorPopup("Please enter a title for the terms");
      return;
    }
    const plain = termsHtml.replace(/<[^>]*>/g, "").trim();
    if (!plain) {
      errorPopup("Please enter terms content before saving");
      return;
    }
    setSaving(true);
    try {
      const res = await termsService.createTerms({
        title: termsTitle,
        text: termsHtml,
        isCurrent: true,
      });
      if (res.success) {
        successPopup("Terms saved successfully");
        setOriginalHtml(termsHtml);
        // Refresh the terms to get the updated data
        await fetchTerms();
      } else {
        errorPopup(res.message || "Failed to save terms");
      }
    } catch (e) {
      errorPopup("Failed to save terms");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setTermsTitle(originalTitle);
    setTermsHtml(originalHtml);
  };

  const getPlain = (html: string) =>
    html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const plainText = getPlain(termsHtml);
  const wordCount = plainText ? plainText.split(" ").length : 0;
  const charCount = plainText.length;
  const lastUpdatedLabel = updatedAt
    ? dayjs(updatedAt).format("DD MMM YYYY, HH:mm")
    : "-";

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Terms & Conditions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage the Terms & Conditions content displayed on the website
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.5 }}>
                {lastUpdatedLabel}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Word Count
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.5 }}>
                {wordCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Characters
              </Typography>
              <Typography variant="h6" sx={{ mt: 0.5 }}>
                {charCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Box sx={{ flex: 1 }} />
          <Button
            variant="outlined"
            startIcon={<Restore />}
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save Terms"}
          </Button>
        </Stack>

        {loading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : (
          <>
            <TextField
              fullWidth
              label="Title"
              value={termsTitle}
              onChange={(e) => setTermsTitle(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="Enter terms title"
            />
            <RichTextEditor
              value={termsHtml}
              onChange={setTermsHtml}
              minHeight={300}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default AdminTermsPage;
