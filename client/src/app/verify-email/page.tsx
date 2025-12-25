"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import { CheckCircle, Error, Email } from "@mui/icons-material";
import { authService } from "@/lib/api";

const VerifyEmailPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage(
          "Verification token is missing. Please check your email for the correct verification link."
        );
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        setStatus("success");
        setMessage(response.message || "Email verified successfully!");
        setUserData(response.data);
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Email verification failed. The link may be expired or invalid."
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  const handleGoToLogin = () => {
    router.push("/login");
  };

  const handleResendEmail = () => {
    if (userData?.email) {
      router.push(
        `/resend-verification?email=${encodeURIComponent(userData.email)}`
      );
    } else {
      router.push("/resend-verification");
    }
  };

  return (
    <div className="min-h-screen bg-surface-primary">
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Card
          elevation={3}
          sx={{
            borderRadius: 2,
            background: "var(--color-surface-primary)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box textAlign="center" mb={4}>
              {status === "loading" && (
                <>
                  <CircularProgress
                    size={60}
                    sx={{
                      mb: 2,
                      color: "var(--color-primary-500)",
                    }}
                  />
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    Verifying Your Email...
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    Please wait while we verify your email address.
                  </Typography>
                </>
              )}

              {status === "success" && (
                <>
                  <CheckCircle
                    sx={{
                      fontSize: 60,
                      color: "var(--color-success-500)",
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: "var(--color-success-500)",
                    }}
                  >
                    Email Verified Successfully!
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {message}
                  </Typography>
                  {userData && (
                    <Alert
                      severity="success"
                      sx={{
                        mb: 3,
                        textAlign: "left",
                        backgroundColor: "var(--color-success-50)",
                        borderColor: "var(--color-success-200)",
                      }}
                    >
                      <Typography variant="body2">
                        <strong>Welcome, {userData.fullname}!</strong>
                        <br />
                        Your account is now fully activated. You can log in and
                        start using our services.
                      </Typography>
                    </Alert>
                  )}
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleGoToLogin}
                    sx={{
                      mb: 2,
                      backgroundColor: "var(--color-primary-500)",
                      "&:hover": {
                        backgroundColor: "var(--color-primary-600)",
                      },
                    }}
                  >
                    Go to Login
                  </Button>
                </>
              )}

              {status === "error" && (
                <>
                  <Error
                    sx={{
                      fontSize: 60,
                      color: "var(--color-error-500)",
                      mb: 2,
                    }}
                  />
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: "var(--color-error-500)",
                    }}
                  >
                    Verification Failed
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 3,
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {message}
                  </Typography>
                  <Alert
                    severity="error"
                    sx={{
                      mb: 3,
                      textAlign: "left",
                      backgroundColor: "var(--color-error-50)",
                      borderColor: "var(--color-error-200)",
                    }}
                  >
                    <Typography variant="body2">
                      This could happen if:
                      <br />• The verification link has expired (links expire
                      after 24 hours)
                      <br />• The link has already been used
                      <br />• The link is invalid or corrupted
                    </Typography>
                  </Alert>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      onClick={handleResendEmail}
                      startIcon={<Email />}
                      sx={{
                        borderColor: "var(--color-primary-500)",
                        color: "var(--color-primary-500)",
                        "&:hover": {
                          borderColor: "var(--color-primary-600)",
                          backgroundColor: "var(--color-primary-50)",
                        },
                      }}
                    >
                      Resend Verification Email
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handleGoToLogin}
                      sx={{
                        backgroundColor: "var(--color-primary-500)",
                        "&:hover": {
                          backgroundColor: "var(--color-primary-600)",
                        },
                      }}
                    >
                      Go to Login
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default VerifyEmailPage;
