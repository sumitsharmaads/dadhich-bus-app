"use client";

import React, { useEffect, useState } from "react";
import { WebsiteInfoType } from "@/types";
import { Box, Button, Chip, Stack, TextField, Typography } from "@mui/material";

type Emails = {
  infoEmails: string[];
  supportEmail: string;
} | null;

const EmailSettings: React.FC<{
  emails: Emails;
  onSave: (updated: Partial<WebsiteInfoType>) => void;
}> = ({ emails, onSave }) => {
  const [temp, setTemp] = useState<Emails>({
    infoEmails: [],
    supportEmail: "",
  });
  const [newEmail, setNewEmail] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setTemp(emails ?? { infoEmails: [], supportEmail: "" });
  }, [emails]);

  const addEmail = () => {
    if (!temp || !newEmail.trim()) return;
    setTemp({
      ...temp,
      infoEmails: [...(temp.infoEmails || []), newEmail.trim()],
    });
    setNewEmail("");
  };

  const removeEmail = (idx: number) => {
    if (!temp) return;
    const arr = [...(temp.infoEmails || [])];
    arr.splice(idx, 1);
    setTemp({ ...temp, infoEmails: arr });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!temp) return;
    setTemp({ ...temp, supportEmail: e.target.value });
  };

  const save = () => {
    onSave({ emails: temp } as any);
    setEditing(false);
  };

  const cancel = () => {
    setTemp(emails ?? { infoEmails: [], supportEmail: "" });
    setNewEmail("");
    setEditing(false);
  };

  return (
    <Box>
      <Typography variant="subtitle1">Support Email</Typography>
      {editing ? (
        <TextField
          size="small"
          fullWidth
          sx={{ mt: 1, mb: 2 }}
          value={temp?.supportEmail || ""}
          onChange={handleChange}
        />
      ) : (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {temp?.supportEmail || "Not set"}
        </Typography>
      )}

      <Typography variant="subtitle1">Info Emails</Typography>
      {editing ? (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ mt: 1, mb: 1 }}
        >
          <TextField
            size="small"
            fullWidth
            placeholder="Add email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Button variant="contained" onClick={addEmail}>
            Add
          </Button>
        </Stack>
      ) : null}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {(temp?.infoEmails || []).map((e, i) => (
          <Chip
            key={`${e}-${i}`}
            label={e}
            onDelete={editing ? () => removeEmail(i) : undefined}
          />
        ))}
        {!temp?.infoEmails?.length && (
          <Typography color="text.secondary">No emails added yet</Typography>
        )}
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 1 }}>
        {editing ? (
          <>
            <Button variant="contained" onClick={save}>
              Save
            </Button>
            <Button variant="outlined" onClick={cancel}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default React.memo(EmailSettings);
