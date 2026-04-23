import { Box, Paper, Stack, Typography, Avatar, Chip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const users = [
  { id: 1, name: "Roan Villaluz", email: "roan.villaluz@email.com", role: "Admin", status: "Active", location: "Quezon City" },
  { id: 2, name: "Christiana Kyle Dela Cruz", email: "christiana.dc@email.com", role: "Editor", status: "Active", location: "Las Piñas" },
  { id: 3, name: "Mark Dela Cruz", email: "mark.dc@email.com", role: "Viewer", status: "Inactive", location: "Makati" },
  { id: 4, name: "Joy Santos", email: "joy.santos@email.com", role: "Admin", status: "Active", location: "Makati" },
  { id: 5, name: "John Villanueva", email: "john.v@email.com", role: "Viewer", status: "Pending", location: "Taguig" },
  { id: 6, name: "Carlo Lim", email: "carlo.lim@email.com", role: "Editor", status: "Active", location: "Mandaluyong" },
];

const columns = [
  {
    field: "name",
    headerName: "User",
    minWidth: 200,
    flex: 1.2,
    renderCell: (params) => (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
        <Avatar sx={{ width: 30, height: 30, bgcolor: "#18181b", fontSize: 13 }}>
          {params.value.split(" ").map((part) => part[0]).join("").slice(0, 2)}
        </Avatar>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {params.value}
        </Typography>
      </Box>
    ),
  },
  { field: "email", headerName: "Email", minWidth: 220, flex: 1.4 },
  { field: "role", headerName: "Role", minWidth: 120, flex: 0.8 },
  {
    field: "status",
    headerName: "Status",
    minWidth: 130,
    flex: 0.8,
    renderCell: (params) => {
      const statusColor = {
        Active: "success",
        Inactive: "default",
        Pending: "warning",
      };
      return <Chip size="small" label={params.value} color={statusColor[params.value] ?? "default"} />;
    },
  },
  { field: "location", headerName: "Location", minWidth: 130, flex: 0.8 },
];

const UsersPage = () => {
  const activeUsers = users.filter((user) => user.status === "Active").length;
  const admins = users.filter((user) => user.role === "Admin").length;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Users Management
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>
          Monitor user roles, account status, and basic profile details.
        </Typography>
      </Paper>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
        <Paper elevation={0} sx={{ flex: 1, borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2.5 }}>
          <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 1.2 }}>
            Total Users
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            {users.length}
          </Typography>
        </Paper>
        <Paper elevation={0} sx={{ flex: 1, borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2.5 }}>
          <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 1.2 }}>
            Active Users
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: "#166534" }}>
            {activeUsers}
          </Typography>
        </Paper>
        <Paper elevation={0} sx={{ flex: 1, borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2.5 }}>
          <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 1.2 }}>
            Admin Accounts
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, color: "#18181b" }}>
            {admins}
          </Typography>
        </Paper>
      </Stack>

      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
          Team Directory
        </Typography>
        <Box sx={{ height: 430, width: "100%" }}>
          <DataGrid
            rows={users}
            columns={columns}
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            disableRowSelectionOnClick
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": { backgroundColor: "#f4f4f5" },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default UsersPage;
