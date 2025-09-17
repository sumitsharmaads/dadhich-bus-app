"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Paper,
  TextField,
  Stack,
} from "@mui/material";
import {
  Add,
  Delete,
  Save,
  ExpandMore,
  Restore,
  Refresh,
  CleaningServices,
} from "@mui/icons-material";
import { get, post } from "@/lib/service";
import RichTextEditor from "@/components/common/RichTextEditor";
import { successPopup, errorPopup } from "@/utils/errors/alerts";
import { faqsService } from "@/lib/api/services/faqs.service";

type FAQ = { question: string; answer: string };
interface FAQsDoc {
  _id?: string;
  questions?: FAQ[];
  faqs?: FAQ[];
}

const AdminFAQsPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [original, setOriginal] = useState<FAQ[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | false>(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const res = await faqsService.getCurrentFAQs();
      if (res.success && res.data?.questions) {
        setFaqs(res.data.questions);
        setOriginal(res.data.questions);
      } else {
        setFaqs([]);
        setOriginal([]);
      }
    } catch (e) {
      errorPopup("Failed to load FAQs");
      setFaqs([]);
      setOriginal([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFAQs();
  }, []);

  const handleChange = (
    idx: number,
    field: "question" | "answer",
    value: string
  ) => {
    setFaqs((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, [field]: value } : f))
    );
  };

  const addRow = () => {
    setFaqs((prev) => [...prev, { question: "", answer: "" }]);
    setExpandedIndex(faqs.length);
  };
  const deleteRow = (idx: number) =>
    setFaqs((prev) => prev.filter((_, i) => i !== idx));
  const toggleExpand = (idx: number) =>
    setExpandedIndex((cur) => (cur === idx ? false : idx));

  const handleSave = async () => {
    const invalid = faqs.some(
      (f) =>
        !f.question.trim() ||
        !f.answer ||
        !f.answer.replace(/<[^>]*>/g, "").trim()
    );
    if (invalid) {
      errorPopup("Please fill Question and Answer for all FAQs");
      return;
    }

    setSaving(true);
    try {
      const response = await faqsService.updateFAQs({ questions: faqs });
      if (response.success) {
        successPopup("FAQs saved successfully");
        setOriginal(faqs);
      } else {
        errorPopup(response.message || "Failed to save FAQs");
      }
    } catch (e) {
      errorPopup("Failed to save FAQs");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => setFaqs(original);

  const handleInitialize = async () => {
    try {
      setLoading(true);
      const response = await faqsService.initializeFAQs();
      if (response.success && response.data?.questions) {
        setFaqs(response.data.questions);
        setOriginal(response.data.questions);
        successPopup("FAQs initialized with defaults");
      } else {
        errorPopup(response.message || "Failed to initialize FAQs");
      }
    } catch (e) {
      errorPopup("Failed to initialize FAQs");
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    try {
      setLoading(true);
      const response = await faqsService.cleanupFAQs();
      if (response.success) {
        successPopup("FAQ cleanup completed successfully");
        // Refresh FAQs after cleanup
        await fetchFAQs();
      } else {
        errorPopup(response.message || "Failed to cleanup FAQs");
      }
    } catch (e) {
      errorPopup("Failed to cleanup FAQs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          FAQs
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage frequently asked questions displayed on the website
        </Typography>
      </Box>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <Button variant="outlined" startIcon={<Add />} onClick={addRow}>
            Add FAQ
          </Button>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleInitialize}
            disabled={loading}
            color="secondary"
          >
            Initialize Defaults
          </Button>
          <Button
            variant="outlined"
            startIcon={<CleaningServices />}
            onClick={handleCleanup}
            disabled={loading}
            color="warning"
          >
            Cleanup
          </Button>
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
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
        {loading ? (
          <Typography color="text.secondary">Loading...</Typography>
        ) : faqs.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              No FAQs available. Click "Initialize Defaults" to create sample
              FAQs.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleInitialize}
              disabled={loading}
            >
              Initialize Default FAQs
            </Button>
          </Box>
        ) : (
          faqs.map((faq, idx) => (
            <Accordion
              key={idx}
              expanded={expandedIndex === idx}
              onChange={() => toggleExpand(idx)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMore />}>
                <TextField
                  fullWidth
                  label={`Question #${idx + 1}`}
                  value={faq.question}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    handleChange(idx, "question", e.target.value)
                  }
                />
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ mt: 1 }}>
                  <RichTextEditor
                    value={faq.answer}
                    onChange={(v) => handleChange(idx, "answer", v)}
                  />
                </Box>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
                >
                  <IconButton color="error" onClick={() => deleteRow(idx)}>
                    <Delete />
                  </IconButton>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Paper>
    </Container>
  );
};

export default AdminFAQsPage;
