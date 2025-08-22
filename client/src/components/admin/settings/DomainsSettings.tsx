"use client";

import React, { useEffect, useState } from "react";
import { WebsiteInfoType } from "@/types";
import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material";
import { Save, Edit, Add, Delete } from "@mui/icons-material";

const DomainsSettings: React.FC<{
  settings: WebsiteInfoType;
  onSave: (updated: Partial<WebsiteInfoType>) => void;
}> = ({ settings, onSave }) => {
  const [primaryDomain, setPrimaryDomain] = useState("");
  const [aliases, setAliases] = useState<string[]>([]);
  const [newAlias, setNewAlias] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (settings) {
      // Handle new domain structure with primary and aliases
      setPrimaryDomain(settings.domains?.primary || "");
      setAliases(settings.domains?.aliases || []);
    }
  }, [settings]);

  const addAlias = () => {
    if (
      !newAlias.trim() ||
      aliases.includes(newAlias.trim()) ||
      newAlias.trim() === primaryDomain
    )
      return;
    setAliases([...aliases, newAlias.trim()]);
    setNewAlias("");
  };

  const removeAlias = (aliasToRemove: string) => {
    setAliases(aliases.filter((alias) => alias !== aliasToRemove));
  };

  const save = () => {
    onSave({
      domains: {
        primary: primaryDomain,
        aliases: aliases,
      },
    } as any);
    setEditing(false);
  };

  const cancel = () => {
    setPrimaryDomain(settings.domains?.primary || "");
    setAliases(settings.domains?.aliases || []);
    setNewAlias("");
    setEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addAlias();
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
        <Typography variant="subtitle1">Domain Configuration</Typography>
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

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Configure all domains where this website should work. Useful for
        switching between production and investigation environments.
      </Typography>

      {editing && (
        <Stack spacing={2} sx={{ mb: 2 }}>
          {/* Primary Domain */}
          <TextField
            size="small"
            fullWidth
            label="Primary Domain"
            placeholder="Enter primary domain (e.g., example.com)"
            value={primaryDomain}
            onChange={(e) => setPrimaryDomain(e.target.value)}
            helperText="This is your main domain"
          />

          {/* Aliases */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <TextField
              size="small"
              fullWidth
              placeholder="Enter alias domain (e.g., www.example.com)"
              value={newAlias}
              onChange={(e) => setNewAlias(e.target.value)}
              onKeyPress={handleKeyPress}
              helperText="Press Enter to add alias"
            />
            <Button
              variant="contained"
              onClick={addAlias}
              startIcon={<Add />}
              disabled={
                !newAlias.trim() ||
                aliases.includes(newAlias.trim()) ||
                newAlias.trim() === primaryDomain
              }
            >
              Add Alias
            </Button>
          </Stack>
        </Stack>
      )}

      {/* Primary Domain Display */}
      {primaryDomain && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>
            Primary Domain:
          </Typography>
          <Chip
            label={primaryDomain}
            color="primary"
            variant="filled"
            sx={{ mb: 1 }}
          />
        </Box>
      )}

      {/* Aliases Display */}
      {aliases.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
            Alias Domains:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {aliases.map((alias, index) => (
              <Chip
                key={`${alias}-${index}`}
                label={alias}
                onDelete={editing ? () => removeAlias(alias) : undefined}
                color="secondary"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
        </Box>
      )}

      {!primaryDomain && aliases.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          No domains configured. Add at least one primary domain to enable the
          website.
        </Typography>
      )}

      {editing && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mt: 2, display: "block" }}
        >
          💡 Tip: You can easily switch between environments by changing the
          domains here. For production, keep your main domain. For
          investigation, add your local/development domain.
        </Typography>
      )}
    </Box>
  );
};

export default DomainsSettings;
