"use client";

import React from "react";
import { Container, Box, Typography } from "@mui/material";
import { SessionManagement } from "@/components/auth";
import { useAuth } from "@/contexts/AuthContextProvider";

const SessionsPage = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        <SessionManagement onLogout={handleLogout} />
      </Container>
    </Box>
  );
};

export default SessionsPage;
