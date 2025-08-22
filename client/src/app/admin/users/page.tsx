"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Pagination,
  Typography,
  IconButton,
  Collapse,
  Chip,
  Card,
  CardContent,
  Stack,
  Divider,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  FilterAlt,
  Search,
  Clear,
  Edit,
  Add,
  Person,
  Delete,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { adminService } from "@/lib/api/services/admin.service";
import { AdminUser, UserListCondition } from "@/lib/api/types/admin.types";

const roleTypes = [
  { value: 0, label: "Admin", color: "error" as const },
  { value: 1, label: "Normal User", color: "primary" as const },
  { value: 2, label: "Captain", color: "warning" as const },
];

const accessTypes = [
  { value: -1, label: "Frozen", color: "error" as const },
  { value: 0, label: "Active", color: "success" as const },
  { value: 1, label: "Awaiting email activation", color: "warning" as const },
  { value: 2, label: "Requires password reset", color: "info" as const },
];

const AdminUsersList: React.FC = () => {
  const router = useRouter();
  const [filterVisible, setFilterVisible] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    email: "",
    username: "",
    fullname: "",
    roleType: "",
    access: "",
    isActive: "",
  });
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const condition: UserListCondition = {
        page,
        items: itemsPerPage,
        sort: { createdAt: -1 },
      };

      // Add search filters
      const search: any = {};
      if (filters.email.trim()) search.email = filters.email.trim();
      if (filters.fullname.trim()) search.fullname = filters.fullname.trim();
      if (filters.username.trim()) search.username = filters.username.trim();

      if (Object.keys(search).length > 0) {
        condition.search = search;
      }

      // Add other filters
      if (filters.roleType && filters.roleType !== "") {
        condition.roleTypes = Number(filters.roleType);
      }
      if (filters.access && filters.access !== "") {
        condition.access = Number(filters.access);
      }
      if (filters.isActive && filters.isActive !== "") {
        condition.isActive = filters.isActive === "true";
      }

      const response = await adminService.listUsers(condition);

      if (response.success && response.data) {
        const { count, users: tempUsers } = response.data;
        setTotalUsers(count || 0);
        setTotalPages(Math.ceil((count || 0) / itemsPerPage));
        setUsers(tempUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleFilterSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  const handleClearFilter = () => {
    setPage(1);
    setFilters({
      email: "",
      username: "",
      fullname: "",
      roleType: "",
      access: "",
      isActive: "",
    });
  };

  const handleEditUser = (userId: string) => {
    router.push(`/admin/users/${userId}/edit`);
  };

  const handleAddUser = () => {
    router.push("/admin/users/add");
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      await adminService.updateUserAccess(userId, { isActive: !currentStatus });
      // Refresh the user list
      fetchUsers();
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      try {
        await adminService.deleteUser(userId);
        // Refresh the user list
        fetchUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const getRoleTypeLabel = (roleType: number) => {
    return roleTypes.find((r) => r.value === roleType)?.label || "Unknown";
  };

  const getRoleTypeColor = (roleType: number) => {
    return roleTypes.find((r) => r.value === roleType)?.color || "default";
  };

  const getAccessTypeLabel = (access: number) => {
    return accessTypes.find((a) => a.value === access)?.label || "Unknown";
  };

  const getAccessTypeColor = (access: number) => {
    return accessTypes.find((a) => a.value === access)?.color || "default";
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Users Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all users, their roles, and access permissions
        </Typography>
      </Box>

      {/* Stats Card */}
      <Box sx={{ mb: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Person sx={{ fontSize: 40, color: "primary.main" }} />
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {totalUsers} Total Users
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Across all roles and access levels
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Paper sx={{ mb: 3, borderRadius: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h6"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <FilterAlt /> Filters
          </Typography>
          <IconButton onClick={() => setFilterVisible(!filterVisible)}>
            {filterVisible ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        <Collapse in={filterVisible} timeout="auto" unmountOnExit>
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                },
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Email"
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
                fullWidth
                size="small"
              />
              <TextField
                label="Username"
                name="username"
                value={filters.username}
                onChange={handleFilterChange}
                fullWidth
                size="small"
              />
              <TextField
                label="Full Name"
                name="fullname"
                value={filters.fullname}
                onChange={handleFilterChange}
                fullWidth
                size="small"
              />
              <FormControl fullWidth size="small">
                <InputLabel>Role Type</InputLabel>
                <Select
                  name="roleType"
                  value={filters.roleType}
                  label="Role Type"
                  onChange={handleFilterSelectChange}
                >
                  <MenuItem value="">
                    <em>All Roles</em>
                  </MenuItem>
                  {roleTypes.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Access Type</InputLabel>
                <Select
                  name="access"
                  value={filters.access}
                  label="Access Type"
                  onChange={handleFilterSelectChange}
                >
                  <MenuItem value="">
                    <em>All Access</em>
                  </MenuItem>
                  {accessTypes.map((access) => (
                    <MenuItem key={access.value} value={access.value}>
                      {access.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  name="isActive"
                  value={filters.isActive}
                  label="Status"
                  onChange={handleFilterSelectChange}
                >
                  <MenuItem value="">
                    <em>All Status</em>
                  </MenuItem>
                  <MenuItem value="true">Active</MenuItem>
                  <MenuItem value="false">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClearFilter}
              >
                Clear Filters
              </Button>
              <Button
                variant="contained"
                startIcon={<Search />}
                onClick={fetchUsers}
              >
                Search
              </Button>
            </Box>
          </Box>
        </Collapse>
      </Paper>

      {/* Actions */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddUser}>
          Add User
        </Button>
      </Box>

      {/* Users Table */}
      <Paper sx={{ borderRadius: 2, overflow: "hidden", width: "100%" }}>
        <TableContainer
          sx={{ maxHeight: 600, width: "100%", overflowX: "hidden" }}
        >
          <Table stickyHeader sx={{ width: "100%", tableLayout: "fixed" }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 600, width: "18%" }}>
                  User
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: "22%" }}>
                  Contact
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: "15%" }}>
                  Role
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: "20%" }}>
                  Access
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: "10%" }}>
                  Status
                </TableCell>
                <TableCell sx={{ fontWeight: 600, width: "15%" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell sx={{ width: "18%" }}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600} noWrap>
                        {user.fullname}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        @{user.username}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "22%" }}>
                    <Box>
                      <Typography variant="body2" noWrap>
                        {user.email}
                      </Typography>
                      {user.phone && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          {user.phone}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ width: "15%" }}>
                    <Chip
                      label={getRoleTypeLabel(user.roleType)}
                      color={getRoleTypeColor(user.roleType)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ width: "20%" }}>
                    <Chip
                      label={getAccessTypeLabel(user.access)}
                      color={getAccessTypeColor(user.access)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell sx={{ width: "10%" }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={user.isActive}
                          onChange={() =>
                            handleToggleUserStatus(user._id, user.isActive)
                          }
                          color="primary"
                          size="small"
                        />
                      }
                      label={user.isActive ? "Active" : "Inactive"}
                    />
                  </TableCell>
                  <TableCell sx={{ width: "15%" }}>
                    <Box
                      sx={{ display: "flex", gap: 1, flexDirection: "column" }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEditUser(user._id)}
                        sx={{ minWidth: "auto", px: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => handleDeleteUser(user._id)}
                        sx={{ minWidth: "auto", px: 1 }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </Box>
  );
};

export default AdminUsersList;
