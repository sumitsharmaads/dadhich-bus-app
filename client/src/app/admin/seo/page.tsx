"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Grid,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Search,
  Refresh,
  ContentCopy,
  Preview,
} from "@mui/icons-material";
import {
  seoService,
  SEOEntry,
  CreateSEORequest,
} from "@/lib/api/services/seo.service";
import { successPopup, errorPopup, confirmPopup } from "@/utils/errors/alerts";

const SEOAdminPage: React.FC = () => {
  const [seoEntries, setSeoEntries] = useState<SEOEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SEOEntry | null>(null);
  const [formData, setFormData] = useState<CreateSEORequest>({
    routePath: "",
    pageName: "",
    meta: { title: "", description: "", keywords: [] },
    openGraph: { title: "", description: "", imageUrl: "" },
    twitter: { card: "summary", title: "", description: "", imageUrl: "" },
    canonicalUrl: "",
    robots: { noindex: false, nofollow: false },
    structuredData: null,
    isPublished: true,
  });
  const [newKeyword, setNewKeyword] = useState("");

  useEffect(() => {
    fetchSEOEntries();
  }, []);

  const fetchSEOEntries = async () => {
    setLoading(true);
    try {
      const entries = await seoService.listSEO();
      setSeoEntries(entries);
    } catch (error) {
      console.error("Failed to fetch SEO entries:", error);
      errorPopup("Failed to fetch SEO entries");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (entry?: SEOEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        routePath: entry.routePath,
        pageName: entry.pageName || "",
        meta: entry.meta || { title: "", description: "", keywords: [] },
        openGraph: entry.openGraph || {
          title: "",
          description: "",
          imageUrl: "",
        },
        twitter: entry.twitter || {
          card: "summary",
          title: "",
          description: "",
          imageUrl: "",
        },
        canonicalUrl: entry.canonicalUrl || "",
        robots: entry.robots || { noindex: false, nofollow: false },
        structuredData: entry.structuredData,
        isPublished: entry.isPublished,
      });
    } else {
      setEditingEntry(null);
      setFormData({
        routePath: "",
        pageName: "",
        meta: { title: "", description: "", keywords: [] },
        openGraph: { title: "", description: "", imageUrl: "" },
        twitter: { card: "summary", title: "", description: "", imageUrl: "" },
        canonicalUrl: "",
        robots: { noindex: false, nofollow: false },
        structuredData: null,
        isPublished: true,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingEntry(null);
    setFormData({
      routePath: "",
      pageName: "",
      meta: { title: "", description: "", keywords: [] },
      openGraph: { title: "", description: "", imageUrl: "" },
      twitter: { card: "summary", title: "", description: "", imageUrl: "" },
      canonicalUrl: "",
      robots: { noindex: false, nofollow: false },
      structuredData: null,
      isPublished: true,
    });
    setNewKeyword("");
  };

  const handleFormChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CreateSEORequest] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const addKeyword = () => {
    if (
      !newKeyword.trim() ||
      formData.meta?.keywords?.includes(newKeyword.trim())
    )
      return;
    setFormData((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        keywords: [...(prev.meta?.keywords || []), newKeyword.trim()],
      },
    }));
    setNewKeyword("");
  };

  const removeKeyword = (keyword: string) => {
    setFormData((prev) => ({
      ...prev,
      meta: {
        ...prev.meta,
        keywords: prev.meta?.keywords?.filter((k) => k !== keyword) || [],
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      if (editingEntry) {
        await seoService.updateSEO(editingEntry._id, formData);
        successPopup("SEO entry updated successfully");
      } else {
        await seoService.createSEO(formData);
        successPopup("SEO entry created successfully");
      }
      handleCloseDialog();
      fetchSEOEntries();
    } catch (error) {
      console.error("Failed to save SEO entry:", error);
      errorPopup("Failed to save SEO entry");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmPopup(
      "Are you sure you want to delete this SEO entry?"
    );
    if (confirmed) {
      try {
        await seoService.deleteSEO(id);
        successPopup("SEO entry deleted successfully");
        fetchSEOEntries();
      } catch (error) {
        console.error("Failed to delete SEO entry:", error);
        errorPopup("Failed to delete SEO entry");
      }
    }
  };

  const handleTogglePublished = async (id: string, currentStatus: boolean) => {
    try {
      await seoService.togglePublished(id, currentStatus);
      successPopup(
        `SEO entry ${currentStatus ? "unpublished" : "published"} successfully`
      );
      fetchSEOEntries();
    } catch (error) {
      console.error("Failed to toggle published status:", error);
      errorPopup("Failed to update published status");
    }
  };

  const filteredEntries = seoEntries.filter(
    (entry) =>
      entry.routePath.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.pageName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.meta?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    successPopup("Copied to clipboard");
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          SEO Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage SEO settings for different routes and pages to improve search
          engine visibility
        </Typography>
      </Box>

      {/* SEO Statistics */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                {seoEntries.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total SEO Entries
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h4" color="success.main" sx={{ mb: 1 }}>
                {seoEntries.filter((entry) => entry.isPublished).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Published
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h4" color="warning.main" sx={{ mb: 1 }}>
                {seoEntries.filter((entry) => entry.robots?.noindex).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                No-Index Pages
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h4" color="info.main" sx={{ mb: 1 }}>
                {
                  seoEntries.filter(
                    (entry) => entry.meta?.title && entry.meta?.description
                  ).length
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete Meta
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Quick Setup */}
      <Box sx={{ mb: 3 }}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            🚀 Quick Setup
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create common SEO entries for your main pages
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {seoService.getCommonRoutes().map((route) => (
              <Button
                key={route}
                variant="outlined"
                size="small"
                onClick={() => {
                  setFormData({
                    routePath: route,
                    pageName:
                      route === "/"
                        ? "Homepage"
                        : route.slice(1).charAt(0).toUpperCase() +
                          route.slice(2),
                    meta: { title: "", description: "", keywords: [] },
                    openGraph: { title: "", description: "", imageUrl: "" },
                    twitter: {
                      card: "summary",
                      title: "",
                      description: "",
                      imageUrl: "",
                    },
                    canonicalUrl: "",
                    robots: { noindex: false, nofollow: false },
                    structuredData: null,
                    isPublished: true,
                  });
                  setEditingEntry(null);
                  setDialogOpen(true);
                }}
                disabled={seoEntries.some((entry) => entry.routePath === route)}
              >
                {route === "/"
                  ? "Homepage"
                  : route.slice(1).charAt(0).toUpperCase() + route.slice(2)}
                {seoEntries.some((entry) => entry.routePath === route) && (
                  <Chip label="✓" size="small" color="success" sx={{ ml: 1 }} />
                )}
              </Button>
            ))}
          </Stack>
        </Paper>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by route, page name, or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={fetchSEOEntries}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleOpenDialog()}
              >
                Add SEO Entry
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {filteredEntries.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No SEO entries found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first SEO entry to get started"}
          </Typography>
          {!searchTerm && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
            >
              Add First SEO Entry
            </Button>
          )}
        </Paper>
      ) : (
        <Paper elevation={3}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Route</TableCell>
                  <TableCell>Page Name</TableCell>
                  <TableCell>Meta Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Robots</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry._id} hover>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {entry.routePath}
                      </Typography>
                    </TableCell>
                    <TableCell>{entry.pageName || "-"}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {entry.meta?.title || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={entry.isPublished ? "Published" : "Draft"}
                        color={entry.isPublished ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5}>
                        {entry.robots?.noindex && (
                          <Chip label="No Index" color="warning" size="small" />
                        )}
                        {entry.robots?.nofollow && (
                          <Chip
                            label="No Follow"
                            color="warning"
                            size="small"
                          />
                        )}
                        {!entry.robots?.noindex && !entry.robots?.nofollow && (
                          <Chip label="Index" color="success" size="small" />
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(entry.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Preview">
                          <IconButton
                            size="small"
                            onClick={() =>
                              window.open(entry.routePath, "_blank")
                            }
                          >
                            <Preview />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Copy Route">
                          <IconButton
                            size="small"
                            onClick={() => copyToClipboard(entry.routePath)}
                          >
                            <ContentCopy />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={entry.isPublished ? "Unpublish" : "Publish"}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleTogglePublished(
                                entry._id,
                                entry.isPublished
                              )
                            }
                          >
                            {entry.isPublished ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(entry)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(entry._id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* SEO Entry Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingEntry ? "Edit SEO Entry" : "Add New SEO Entry"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Basic Information
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Route Path"
                  value={formData.routePath}
                  onChange={(e) =>
                    handleFormChange("routePath", e.target.value)
                  }
                  placeholder="/about"
                  helperText="e.g., /about, /contact, /"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Page Name"
                  value={formData.pageName}
                  onChange={(e) => handleFormChange("pageName", e.target.value)}
                  placeholder="About Us"
                  helperText="Human-readable page name"
                />
              </Grid>

              {/* Meta Tags */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Meta Tags
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Title"
                  value={formData.meta?.title || ""}
                  onChange={(e) =>
                    handleFormChange("meta.title", e.target.value)
                  }
                  placeholder="Page title for search engines"
                  helperText="Recommended: 50-60 characters"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Meta Description"
                  value={formData.meta?.description || ""}
                  onChange={(e) =>
                    handleFormChange("meta.description", e.target.value)
                  }
                  placeholder="Page description for search engines"
                  multiline
                  rows={3}
                  helperText="Recommended: 150-160 characters"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Meta Keywords
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Add keyword"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={addKeyword}
                    disabled={!newKeyword.trim()}
                  >
                    Add
                  </Button>
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {formData.meta?.keywords?.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={keyword}
                      onDelete={() => removeKeyword(keyword)}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Stack>
              </Grid>

              {/* Open Graph */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Open Graph (Social Media)
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="OG Title"
                  value={formData.openGraph?.title || ""}
                  onChange={(e) =>
                    handleFormChange("openGraph.title", e.target.value)
                  }
                  placeholder="Title for social media sharing"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="OG Description"
                  value={formData.openGraph?.description || ""}
                  onChange={(e) =>
                    handleFormChange("openGraph.description", e.target.value)
                  }
                  placeholder="Description for social media sharing"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="OG Image URL"
                  value={formData.openGraph?.imageUrl || ""}
                  onChange={(e) =>
                    handleFormChange("openGraph.imageUrl", e.target.value)
                  }
                  placeholder="https://example.com/image.jpg"
                  helperText="Image displayed when sharing on social media"
                />
              </Grid>

              {/* Twitter Card */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Twitter Card
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Twitter Title"
                  value={formData.twitter?.title || ""}
                  onChange={(e) =>
                    handleFormChange("twitter.title", e.target.value)
                  }
                  placeholder="Title for Twitter sharing"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Twitter Description"
                  value={formData.twitter?.description || ""}
                  onChange={(e) =>
                    handleFormChange("twitter.description", e.target.value)
                  }
                  placeholder="Description for Twitter sharing"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Twitter Image URL"
                  value={formData.twitter?.imageUrl || ""}
                  onChange={(e) =>
                    handleFormChange("twitter.imageUrl", e.target.value)
                  }
                  placeholder="https://example.com/twitter-image.jpg"
                  helperText="Image displayed when sharing on Twitter"
                />
              </Grid>

              {/* Advanced Settings */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Advanced Settings
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Canonical URL"
                  value={formData.canonicalUrl || ""}
                  onChange={(e) =>
                    handleFormChange("canonicalUrl", e.target.value)
                  }
                  placeholder="https://example.com/canonical-page"
                  helperText="Preferred URL for this page (optional)"
                />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" spacing={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.robots?.noindex || false}
                        onChange={(e) =>
                          handleFormChange("robots.noindex", e.target.checked)
                        }
                      />
                    }
                    label="No Index"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.robots?.nofollow || false}
                        onChange={(e) =>
                          handleFormChange("robots.nofollow", e.target.checked)
                        }
                      />
                    }
                    label="No Follow"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPublished}
                        onChange={(e) =>
                          handleFormChange("isPublished", e.target.checked)
                        }
                      />
                    }
                    label="Published"
                  />
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEntry ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Helpful Tips */}
      <Box sx={{ mt: 4 }}>
        <Paper elevation={1} sx={{ p: 3, bgcolor: "grey.50" }}>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            💡 SEO Best Practices
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Meta Tags
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Title: Keep between 50-60 characters for optimal display in
                search results
                <br />
                • Description: Aim for 150-160 characters to avoid truncation
                <br />• Keywords: Use relevant, specific terms (though less
                important for modern SEO)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Social Media
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Open Graph: Optimize for Facebook, LinkedIn sharing
                <br />
                • Twitter Cards: Customize for Twitter appearance
                <br />• Images: Use high-quality, relevant images (1200x630px
                recommended)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Technical SEO
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Canonical URLs: Prevent duplicate content issues
                <br />
                • Robots: Use noindex for admin pages, nofollow for external
                links
                <br />• Route paths: Use clean, descriptive URLs
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Common Routes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Homepage: /<br />
                • About: /about
                <br />
                • Contact: /contact
                <br />• Services: /services, /booking, /rental
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default SEOAdminPage;
