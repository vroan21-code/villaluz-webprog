import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { fetchUsers, createUser, updateUser } from "../../services/userService";

const ROLE_OPTIONS = ["Admin", "Viewer", "Editor"];
const GENDER_OPTIONS = ["Female", "Male"];

const emptyFormErrors = () => ({
  fullName: "",
  username: "",
  contactNumber: "",
  age: "",
  password: "",
});

/** Map backend type to frontend role label */
function typeToRole(type) {
  if (!type) return "Viewer";
  const map = { admin: "Admin", editor: "Editor", viewer: "Viewer" };
  return map[type.toLowerCase()] || "Viewer";
}

/** Map frontend role label to backend type */
function roleToType(role) {
  const map = { Admin: "admin", Editor: "editor", Viewer: "viewer" };
  return map[role] || "viewer";
}

/** Transform a backend user document into a frontend row */
function toRow(user) {
  return {
    id: user._id,
    fullName: [user.firstName, user.lastName].filter(Boolean).join(" "),
    username: user.username,
    age: user.age != null ? Number(user.age) : "",
    gender: user.gender || "Male",
    contactNumber: user.contactNumber || "",
    email: user.email || "",
    role: typeToRole(user.type),
    status: user.isActive ? "Active" : "Inactive",
  };
}

/** Returns error map; empty object means valid. */
function validateUserForm(form, { isEdit }) {
  const errors = emptyFormErrors();

  if (!form.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  const usernameTrim = form.username.trim();
  if (!usernameTrim) {
    errors.username = "Username is required.";
  } else if (/\s/.test(form.username)) {
    errors.username = "Username must not contain spaces.";
  }

  const contactDigits = form.contactNumber.replace(/\D/g, "");
  if (contactDigits.length !== 11) {
    errors.contactNumber = "Contact number must be exactly 11 digits.";
  }

  const ageStr = form.age.trim();
  if (!ageStr) {
    errors.age = "Age is required.";
  } else if (!/^\d+$/.test(ageStr)) {
    errors.age = "Age must be a number only.";
  } else {
    const ageNum = parseInt(ageStr, 10);
    if (ageNum < 1 || ageNum > 120) {
      errors.age = "Enter an age between 1 and 120.";
    }
  }

  if (!isEdit) {
    if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }
  } else if (form.password.length > 0 && form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  const hasErr = Object.values(errors).some(Boolean);
  return hasErr ? errors : {};
}

function matchesSearch(row, q) {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  const hay = [
    row.fullName,
    row.username,
    row.email,
    row.contactNumber,
    String(row.id),
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(needle);
}

const UsersPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    age: "",
    gender: "Female",
    contactNumber: "",
    email: "",
    password: "",
    role: "Viewer",
    status: "Active",
  });
  const [formErrors, setFormErrors] = useState(emptyFormErrors);

  // Fetch users from the database on mount
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchUsers();
      const users = response.data.users || response.data;
      setRows(Array.isArray(users) ? users.map(toRow) : []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Failed to load users. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (roleFilter !== "all" && row.role !== roleFilter) return false;
      if (genderFilter !== "all" && row.gender !== genderFilter) return false;
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      return matchesSearch(row, search);
    });
  }, [rows, search, roleFilter, genderFilter, statusFilter]);

  const openAdd = () => {
    setEditingId(null);
    setFormErrors(emptyFormErrors());
    setForm({
      fullName: "",
      username: "",
      age: "",
      gender: "Female",
      contactNumber: "",
      email: "",
      password: "",
      role: "Viewer",
      status: "Active",
    });
    setDialogOpen(true);
  };

  const openEdit = useCallback((row) => {
    setEditingId(row.id);
    setFormErrors(emptyFormErrors());
    setForm({
      fullName: row.fullName,
      username: row.username.replace(/\s/g, ""),
      age: String(row.age ?? ""),
      gender: row.gender,
      contactNumber: String(row.contactNumber ?? "").replace(/\D/g, "").slice(0, 11),
      email: row.email,
      password: "",
      role: row.role,
      status: row.status,
    });
    setDialogOpen(true);
  }, []);

  const closeDialog = () => {
    setDialogOpen(false);
    setFormErrors(emptyFormErrors());
  };

  /** Build the payload that matches the backend User model */
  function buildPayload() {
    const nameParts = form.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || firstName; // fallback if single name

    const payload = {
      firstName,
      lastName,
      username: form.username.trim().toLowerCase(),
      age: form.age.trim(),
      gender: form.gender,
      contactNumber: form.contactNumber.replace(/\D/g, ""),
      email: form.email.trim(),
      type: roleToType(form.role),
      isActive: form.status === "Active",
      address: "N/A", // required field in schema — use placeholder
    };

    if (form.password) {
      payload.password = form.password;
    }

    return payload;
  }

  const saveUser = async () => {
    const fieldErrors = validateUserForm(form, { isEdit: editingId != null });
    if (Object.keys(fieldErrors).length > 0) {
      setFormErrors(fieldErrors);
      return;
    }
    setFormErrors(emptyFormErrors());

    const payload = buildPayload();

    try {
      setSaving(true);
      if (editingId != null) {
        await updateUser(editingId, payload);
      } else {
        await createUser(payload);
      }
      closeDialog();
      // Refresh the list from the database
      await loadUsers();
    } catch (err) {
      console.error("Failed to save user:", err);
      const msg =
        err.response?.data?.message || "Failed to save user. Please try again.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = useCallback(
    async (id) => {
      const row = rows.find((r) => r.id === id);
      if (!row) return;
      const newIsActive = row.status !== "Active";
      try {
        await updateUser(id, { isActive: newIsActive });
        await loadUsers();
      } catch (err) {
        console.error("Failed to toggle user status:", err);
        setError("Failed to update user status.");
      }
    },
    [rows, loadUsers]
  );

  const columns = useMemo(
    () => [
      { field: "id", headerName: "ID", flex: 0.8 },
      { field: "fullName", headerName: "Full Name", flex: 1.2 },
      { field: "username", headerName: "Username", flex: 1 },
      { field: "age", headerName: "Age", type: "number", flex: 0.4 },
      { field: "gender", headerName: "Gender", flex: 0.6 },
      {
        field: "contactNumber",
        headerName: "Contact",
        flex: 0.9,
      },
      { field: "email", headerName: "Email", flex: 1.2 },
      { field: "role", headerName: "Role", flex: 0.6 },
      {
        field: "status",
        headerName: "Status",
        flex: 0.6,
        renderCell: (params) =>
          params.value === "Active" ? (
            <Chip label="Active" size="small" color="success" sx={{ fontWeight: 600 }} />
          ) : (
            <Chip
              label="Inactive"
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 600,
                borderColor: "rgba(24, 24, 27, 0.35)",
                color: "text.primary",
                bgcolor: "background.paper",
              }}
            />
          ),
      },
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        filterable: false,
        flex: 1.2,
        renderCell: (params) => (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 0.5 }}>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={() => openEdit(params.row)}
            >
              EDIT
            </Button>
            {params.row.status === "Active" ? (
              <Button
                size="small"
                variant="contained"
                color="warning"
                onClick={() => toggleActive(params.row.id)}
              >
                DISABLE
              </Button>
            ) : (
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => toggleActive(params.row.id)}
              >
                ACTIVATE
              </Button>
            )}
          </Stack>
        ),
      },
    ],
    [openEdit, toggleActive]
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, width: "100%" }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          p: { xs: 2, md: 3 },
          background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
          color: "common.white",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "stretch", sm: "flex-start" }}
          justifyContent="space-between"
          spacing={2}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Users
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>
              Manage accounts, search the directory, and control roles and activation status.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={openAdd}
            sx={{
              alignSelf: { xs: "stretch", sm: "flex-start" },
              flexShrink: 0,
              bgcolor: "#fafafa",
              color: "#18181b",
              boxShadow: "none",
              fontWeight: 700,
              "&:hover": {
                bgcolor: "#e4e4e7",
                boxShadow: "none",
              },
            }}
          >
            ADD USER
          </Button>
        </Stack>
      </Paper>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
      >
        <TextField
          fullWidth
          placeholder="Search Users"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ flex: 1 }}
        />
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="filter-role">Role</InputLabel>
            <Select
              labelId="filter-role"
              label="Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <MenuItem value="all">All Roles</MenuItem>
              {ROLE_OPTIONS.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="filter-gender">Gender</InputLabel>
            <Select
              labelId="filter-gender"
              label="Gender"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <MenuItem value="all">All Genders</MenuItem>
              {GENDER_OPTIONS.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="filter-status">Status</InputLabel>
            <Select
              labelId="filter-status"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ width: "100%", height: 520, overflow: "hidden" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
              <CircularProgress />
            </Box>
          ) : (
            <DataGrid
              rows={filteredRows}
              columns={columns}
              pageSizeOptions={[5, 10]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5, page: 0 } },
              }}
              disableRowSelectionOnClick
              sx={{
                border: 0,
                color: "text.primary",
                "& .MuiDataGrid-cell": { borderColor: "divider" },
              }}
            />
          )}
        </Box>
      </Paper>

      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        maxWidth="md"
        fullWidth
        scroll="body"
        PaperProps={{
          sx: {
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            maxHeight: "none",
            width: "100%",
            m: { xs: 1, sm: 2 },
          },
        }}
      >
        <DialogTitle sx={{ color: "text.primary", fontFamily: '"Sora", "Inter", sans-serif' }}>
          {editingId != null ? "Edit user" : "Add user"}
        </DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            pt: 0,
            overflow: "visible",
          }}
        >
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              label="Full name"
              size="small"
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              error={Boolean(formErrors.fullName)}
              helperText={formErrors.fullName || " "}
              fullWidth
              margin="dense"
            />
            <TextField
              label="Username"
              size="small"
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({ ...f, username: e.target.value.replace(/\s/g, "") }))
              }
              error={Boolean(formErrors.username)}
              helperText={formErrors.username || "No spaces allowed."}
              fullWidth
              margin="dense"
              autoComplete="username"
            />
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              label="Age"
              size="small"
              value={form.age}
              onChange={(e) =>
                setForm((f) => ({ ...f, age: e.target.value.replace(/[^\d]/g, "") }))
              }
              error={Boolean(formErrors.age)}
              helperText={formErrors.age || "Numbers only."}
              fullWidth
              margin="dense"
              inputProps={{ inputMode: "numeric", maxLength: 3 }}
              autoComplete="off"
            />
            <FormControl fullWidth margin="dense" size="small">
              <InputLabel>Gender</InputLabel>
              <Select
                label="Gender"
                value={form.gender}
                onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
              >
                {GENDER_OPTIONS.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              label="Contact number"
              size="small"
              value={form.contactNumber}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  contactNumber: e.target.value.replace(/\D/g, "").slice(0, 11),
                }))
              }
              error={Boolean(formErrors.contactNumber)}
              helperText={formErrors.contactNumber || "Must be exactly 11 digits (e.g. 09xxxxxxxxx)."}
              fullWidth
              margin="dense"
              inputProps={{ inputMode: "numeric", maxLength: 11 }}
              autoComplete="tel"
            />
            <TextField
              label="Email"
              type="email"
              size="small"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              fullWidth
              margin="dense"
              autoComplete="email"
            />
          </Stack>
          <TextField
            label={editingId != null ? "New password (optional)" : "Password"}
            type="password"
            size="small"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            error={Boolean(formErrors.password)}
            helperText={
              formErrors.password ||
              (editingId != null
                ? "Leave blank to keep unchanged. Min. 8 characters if set."
                : "At least 8 characters.")
            }
            fullWidth
            margin="dense"
            autoComplete="new-password"
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <FormControl fullWidth margin="dense" size="small">
              <InputLabel>Role</InputLabel>
              <Select
                label="Role"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              >
                {ROLE_OPTIONS.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense" size="small">
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={saveUser} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
