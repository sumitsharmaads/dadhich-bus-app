"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Divider,
  Container,
  Alert,
  AlertTitle,
  Skeleton,
  useTheme,
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  Group as GroupIcon,
  Devices as DevicesIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContextProvider";
import { post } from "@/lib/service";
import { successPopup, errorPopup } from "@/utils/errors/alerts";
import User from "@/utils/User";
import Link from "next/link";
import { authService } from "@/lib/api/services/auth.service";
import ChangePasswordModal from "@/components/auth/ChangePasswordModal";

interface UserGuest {
  name: string;
  age: string;
  gender: string;
}

const ProfilePage = () => {
  const theme = useTheme();
  const { state: user, updateUserInfo, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({
    fullname: user?.fullname || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    username: user?.username || "",
  });
  const [newGuest, setNewGuest] = useState<UserGuest>({
    name: "",
    age: "",
    gender: "",
  });
  const [guestList, setGuestList] = useState<UserGuest[]>([
    {
      name: "Creative Associate",
      age: "30",
      gender: "Male",
    },
  ]);

  const handleUserChange = (field: string, value: string) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewGuestChange = (field: string, value: string) => {
    setNewGuest((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addGuest = () => {
    if (newGuest.name && newGuest.age && newGuest.gender) {
      setGuestList([...guestList, newGuest]);
      setNewGuest({ name: "", age: "", gender: "" });
      setIsAddingGuest(false);
    }
  };

  const cancelAddGuest = () => {
    setNewGuest({ name: "", age: "", gender: "" });
    setIsAddingGuest(false);
  };

  const deleteGuest = (index: number) => {
    setGuestList(guestList.filter((_, i) => i !== index));
  };

  const saveEditRow = (index: number, updatedGuest: UserGuest) => {
    const updatedList = [...guestList];
    updatedList[index] = updatedGuest;
    setGuestList(updatedList);
    setEditingRowIndex(null);
  };

  const cancelEditRow = () => {
    setEditingRowIndex(null);
  };

  const handleUpdateUser = async () => {
    try {
      const response = await post(`users/update-user/${user?._id}`, userInfo);
      if (response.data) {
        updateUserInfo(userInfo);
        setIsEditing(false);
        successPopup("Profile updated successfully!");
      }
    } catch (error) {
      errorPopup("Failed to update profile");
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
      // Still logout locally even if API call fails
      logout();
    }
  };

  const handleChangePassword = () => {
    setIsChangePasswordOpen(true);
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ mb: 4 }}>
          <AlertTitle>Authentication Required</AlertTitle>
          Please log in to view your profile
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 2,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            My Profile
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ fontFamily: "Volkhov, serif" }}
          >
            Manage your personal information and quick ticket guests
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 4,
          }}
        >
          {/* Left Section - User Info */}
          <Box sx={{ flex: { xs: "1", lg: "0 0 33.333%" } }}>
            <Card
              elevation={8}
              sx={{
                borderRadius: 3,
                background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* User Avatar & Basic Info */}
                <Box sx={{ textAlign: "center", mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      mx: "auto",
                      mb: 3,
                      fontSize: "2.5rem",
                      background:
                        "linear-gradient(45deg, #ff6b6b 30%, #ee5a24 90%)",
                      boxShadow: "0 8px 32px rgba(255, 107, 107, 0.3)",
                    }}
                  >
                    {user.fullname?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>

                  {isEditing ? (
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={userInfo.fullname}
                      onChange={(e) =>
                        handleUserChange("fullname", e.target.value)
                      }
                      sx={{ mb: 3 }}
                      InputProps={{
                        style: { fontSize: "1.25rem", fontWeight: 600 },
                      }}
                    />
                  ) : (
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: "text.primary",
                        mb: 2,
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {user.fullname || "User"}
                    </Typography>
                  )}

                  <Chip
                    label={User.getRoleString()}
                    color="primary"
                    size="medium"
                    sx={{
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      "& .MuiChip-label": { fontSize: "0.875rem" },
                    }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Personal Information */}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    color: "text.primary",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Personal Information
                </Typography>

                <Box sx={{ space: 3 }}>
                  {/* Phone */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PhoneIcon
                        sx={{ mr: 1, color: "primary.main", fontSize: 20 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Phone Number
                      </Typography>
                    </Box>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="medium"
                        value={userInfo.phone}
                        onChange={(e) =>
                          handleUserChange("phone", e.target.value)
                        }
                        variant="outlined"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    ) : (
                      <Typography
                        variant="body1"
                        sx={{
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "grey.200",
                        }}
                      >
                        {user.phone || "Not provided"}
                      </Typography>
                    )}
                  </Box>

                  {/* Email */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <EmailIcon
                        sx={{ mr: 1, color: "primary.main", fontSize: 20 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Email Address
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        p: 2,
                        bgcolor: "grey.50",
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "grey.200",
                        color: "text.secondary",
                        fontStyle: "italic",
                      }}
                    >
                      {user.email} (Uneditable)
                    </Typography>
                  </Box>

                  {/* Gender */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <PersonIcon
                        sx={{ mr: 1, color: "primary.main", fontSize: 20 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Gender
                      </Typography>
                    </Box>
                    {isEditing ? (
                      <FormControl fullWidth size="medium">
                        <Select
                          value={userInfo.gender}
                          onChange={(e) =>
                            handleUserChange("gender", e.target.value)
                          }
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        >
                          <MenuItem value="Male">Male</MenuItem>
                          <MenuItem value="Female">Female</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Typography
                        variant="body1"
                        sx={{
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "grey.200",
                        }}
                      >
                        {user.gender || "Not specified"}
                      </Typography>
                    )}
                  </Box>

                  {/* Username */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <BadgeIcon
                        sx={{ mr: 1, color: "primary.main", fontSize: 20 }}
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        Username
                      </Typography>
                    </Box>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        size="medium"
                        value={userInfo.username}
                        onChange={(e) =>
                          handleUserChange("username", e.target.value)
                        }
                        variant="outlined"
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                      />
                    ) : (
                      <Typography
                        variant="body1"
                        sx={{
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "grey.200",
                        }}
                      >
                        {user.username || "Not provided"}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {isEditing ? (
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setUserInfo({
                            fullname: user.fullname || "",
                            phone: user.phone || "",
                            gender: user.gender || "",
                            username: user.username || "",
                          });
                          setIsEditing(false);
                        }}
                        startIcon={<CancelIcon />}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          textTransform: "none",
                          fontWeight: 600,
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleUpdateUser}
                        startIcon={<SaveIcon />}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1.5,
                          textTransform: "none",
                          fontWeight: 600,
                          background:
                            "linear-gradient(45deg, #ff6b6b 30%, #ee5a24 90%)",
                          "&:hover": {
                            background:
                              "linear-gradient(45deg, #ee5a24 30%, #ff6b6b 90%)",
                          },
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      variant="outlined"
                      onClick={() => setIsEditing(true)}
                      startIcon={<EditIcon />}
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "1rem",
                      }}
                    >
                      Edit Profile
                    </Button>
                  )}

                  {/* Sessions Management Button */}
                  <Link href="/profile/sessions" passHref>
                    <Button
                      variant="outlined"
                      startIcon={<DevicesIcon />}
                      fullWidth
                      sx={{
                        borderRadius: 2,
                        py: 1.5,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "1rem",
                        borderColor: "primary.main",
                        color: "primary.main",
                        "&:hover": {
                          borderColor: "primary.dark",
                          backgroundColor: "primary.50",
                        },
                      }}
                    >
                      Manage Sessions
                    </Button>
                  </Link>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right Section - Guest Management */}
          <Box sx={{ flex: { xs: "1", lg: "0 0 66.667%" } }}>
            <Card
              elevation={8}
              sx={{
                borderRadius: 3,
                background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
                border: "1px solid rgba(0,0,0,0.05)",
              }}
            >
              <CardContent sx={{ p: 4 }}>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 4,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <GroupIcon
                      sx={{ mr: 2, color: "primary.main", fontSize: 28 }}
                    />
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 700,
                        color: "text.primary",
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Quick Ticket Guests
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => setIsAddingGuest(true)}
                    startIcon={<AddIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      textTransform: "none",
                      fontWeight: 600,
                      background:
                        "linear-gradient(45deg, #4CAF50 30%, #45a049 90%)",
                      "&:hover": {
                        background:
                          "linear-gradient(45deg, #45a049 30%, #4CAF50 90%)",
                      },
                    }}
                  >
                    Add Guest
                  </Button>
                </Box>

                {/* Add Guest Form */}
                {isAddingGuest && (
                  <Paper
                    sx={{
                      p: 3,
                      mb: 4,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                      border: "1px solid #90caf9",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ mb: 3, fontWeight: 600, color: "primary.main" }}
                    >
                      Add New Guest
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          flex: {
                            xs: "1 1 100%",
                            sm: "0 0 calc(33.333% - 16px)",
                          },
                        }}
                      >
                        <TextField
                          fullWidth
                          size="medium"
                          label="Full Name"
                          value={newGuest.name}
                          onChange={(e) =>
                            handleNewGuestChange("name", e.target.value)
                          }
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          flex: { xs: "1 1 100%", sm: "0 0 calc(25% - 16px)" },
                        }}
                      >
                        <FormControl fullWidth size="medium">
                          <InputLabel>Gender</InputLabel>
                          <Select
                            value={newGuest.gender}
                            onChange={(e) =>
                              handleNewGuestChange("gender", e.target.value)
                            }
                            label="Gender"
                            sx={{
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                            }}
                          >
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                      <Box
                        sx={{
                          flex: {
                            xs: "1 1 100%",
                            sm: "0 0 calc(16.667% - 16px)",
                          },
                        }}
                      >
                        <TextField
                          fullWidth
                          size="medium"
                          label="Age"
                          value={newGuest.age}
                          onChange={(e) =>
                            handleNewGuestChange("age", e.target.value)
                          }
                          variant="outlined"
                          sx={{
                            "& .MuiOutlinedInput-root": { borderRadius: 2 },
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          flex: { xs: "1 1 100%", sm: "0 0 calc(25% - 16px)" },
                        }}
                      >
                        <Box sx={{ display: "flex", gap: 2 }}>
                          <Button
                            variant="contained"
                            onClick={addGuest}
                            size="medium"
                            sx={{
                              borderRadius: 2,
                              px: 3,
                              py: 1.5,
                              textTransform: "none",
                              fontWeight: 600,
                              background:
                                "linear-gradient(45deg, #4CAF50 30%, #45a049 90%)",
                              "&:hover": {
                                background:
                                  "linear-gradient(45deg, #45a049 30%, #4CAF50 90%)",
                              },
                            }}
                          >
                            Add Guest
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={cancelAddGuest}
                            size="medium"
                            sx={{
                              borderRadius: 2,
                              px: 3,
                              py: 1.5,
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                )}

                {/* Guest List Table */}
                <TableContainer
                  component={Paper}
                  sx={{
                    mb: 4,
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: "primary.main" }}>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: "1rem",
                          }}
                        >
                          Name
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: "1rem",
                          }}
                        >
                          Age
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: "1rem",
                          }}
                        >
                          Gender
                        </TableCell>
                        <TableCell
                          sx={{
                            color: "white",
                            fontWeight: 600,
                            fontSize: "1rem",
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {guestList.map((guest, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:nth-of-type(odd)": { bgcolor: "grey.50" },
                            "&:hover": { bgcolor: "grey.100" },
                          }}
                        >
                          {editingRowIndex === index ? (
                            <>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={guest.name}
                                  onChange={(e) =>
                                    setGuestList((prev) => {
                                      const updated = [...prev];
                                      updated[index] = {
                                        ...updated[index],
                                        name: e.target.value,
                                      };
                                      return updated;
                                    })
                                  }
                                  variant="outlined"
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 1,
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={guest.age}
                                  onChange={(e) =>
                                    setGuestList((prev) => {
                                      const updated = [...prev];
                                      updated[index] = {
                                        ...updated[index],
                                        age: e.target.value,
                                      };
                                      return updated;
                                    })
                                  }
                                  variant="outlined"
                                  sx={{
                                    "& .MuiOutlinedInput-root": {
                                      borderRadius: 1,
                                    },
                                  }}
                                />
                              </TableCell>
                              <TableCell>
                                <FormControl size="small" fullWidth>
                                  <Select
                                    value={guest.gender}
                                    onChange={(e) =>
                                      setGuestList((prev) => {
                                        const updated = [...prev];
                                        updated[index] = {
                                          ...updated[index],
                                          gender: e.target.value,
                                        };
                                        return updated;
                                      })
                                    }
                                    variant="outlined"
                                    sx={{
                                      "& .MuiOutlinedInput-root": {
                                        borderRadius: 1,
                                      },
                                    }}
                                  >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                  </Select>
                                </FormControl>
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      saveEditRow(index, guestList[index])
                                    }
                                    color="primary"
                                    sx={{
                                      bgcolor: "success.main",
                                      color: "white",
                                      "&:hover": { bgcolor: "success.dark" },
                                    }}
                                  >
                                    <SaveIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={cancelEditRow}
                                    color="error"
                                    sx={{
                                      bgcolor: "error.main",
                                      color: "white",
                                      "&:hover": { bgcolor: "error.dark" },
                                    }}
                                  >
                                    <CancelIcon />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell sx={{ fontWeight: 500 }}>
                                {guest.name}
                              </TableCell>
                              <TableCell>{guest.age}</TableCell>
                              <TableCell>
                                <Chip
                                  label={guest.gender}
                                  size="small"
                                  color={
                                    guest.gender === "Male"
                                      ? "primary"
                                      : "secondary"
                                  }
                                  sx={{ fontWeight: 500 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => setEditingRowIndex(index)}
                                    color="primary"
                                    sx={{
                                      bgcolor: "primary.main",
                                      color: "white",
                                      "&:hover": { bgcolor: "primary.dark" },
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => deleteGuest(index)}
                                    color="error"
                                    sx={{
                                      bgcolor: "error.main",
                                      color: "white",
                                      "&:hover": { bgcolor: "error.dark" },
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </Box>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 3,
                  }}
                >
                  <Box sx={{ flex: { xs: "1", sm: "0 0 calc(50% - 12px)" } }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleChangePassword}
                      startIcon={<SecurityIcon />}
                      sx={{
                        borderRadius: 2,
                        py: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "1rem",
                        background:
                          "linear-gradient(45deg, #2196F3 30%, #1976D2 90%)",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #1976D2 30%, #2196F3 90%)",
                        },
                      }}
                    >
                      Change Password
                    </Button>
                  </Box>
                  <Box sx={{ flex: { xs: "1", sm: "0 0 calc(50% - 12px)" } }}>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleLogout}
                      startIcon={<LogoutIcon />}
                      sx={{
                        borderRadius: 2,
                        py: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        fontSize: "1rem",
                        background:
                          "linear-gradient(45deg, #f44336 30%, #d32f2f 90%)",
                        "&:hover": {
                          background:
                            "linear-gradient(45deg, #d32f2f 30%, #f44336 90%)",
                        },
                      }}
                    >
                      Logout
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* Change Password Modal */}
      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </Box>
  );
};

export default ProfilePage;
