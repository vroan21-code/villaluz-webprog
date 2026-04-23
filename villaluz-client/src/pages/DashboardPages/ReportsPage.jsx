import { Box, Paper, Stack, Typography, Chip } from "@mui/material";
import { BarChart, PieChart } from "@mui/x-charts";
import { DataGrid } from "@mui/x-data-grid";

const reportSummary = [
  { label: "Total Reports", value: "128", tone: "#18181b" },
  { label: "Pending Review", value: "18", tone: "#b45309" },
  { label: "Resolved", value: "96", tone: "#166534" },
];

const monthlyReportSeries = [12, 18, 15, 21, 17, 26];
const monthlyReportLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const reportCategoryShare = [
  { id: 0, value: 42, label: "Security" },
  { id: 1, value: 34, label: "Transport" },
  { id: 2, value: 24, label: "System" },
];

const reportRows = [
  { id: 1, reportId: "REP-1001", category: "Security", status: "Resolved", owner: "Roan Villaluz", createdAt: "2026-04-04" },
  { id: 2, reportId: "REP-1002", category: "Transport", status: "Pending", owner: "Christiana Kyle Dela Cruz", createdAt: "2026-04-05" },
  { id: 3, reportId: "REP-1003", category: "System", status: "In Progress", owner: "Mark Dela Cruz", createdAt: "2026-04-08" },
  { id: 4, reportId: "REP-1004", category: "Security", status: "Resolved", owner: "Joy Santos", createdAt: "2026-04-10" },
  { id: 5, reportId: "REP-1005", category: "Operations", status: "Pending", owner: "John Villanueva", createdAt: "2026-04-12" },
];

const reportColumns = [
  { field: "reportId", headerName: "Report ID", minWidth: 120, flex: 0.7 },
  { field: "category", headerName: "Category", minWidth: 130, flex: 0.8 },
  {
    field: "status",
    headerName: "Status",
    minWidth: 150,
    flex: 0.9,
    renderCell: (params) => {
      const colorByStatus = {
        Resolved: "success",
        Pending: "warning",
        "In Progress": "info",
      };
      return <Chip size="small" label={params.value} color={colorByStatus[params.value] ?? "default"} />;
    },
  },
  { field: "owner", headerName: "Owner", minWidth: 170, flex: 1 },
  { field: "createdAt", headerName: "Created At", minWidth: 130, flex: 0.8 },
];

const ReportsPage = () => {
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
          Reports Center
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>
          Track report statuses, ownership, and monthly activity trends.
        </Typography>
      </Paper>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2.5}>
        {reportSummary.map((item) => (
          <Paper
            key={item.label}
            elevation={0}
            sx={{ flex: 1, borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2.5 }}
          >
            <Typography variant="overline" sx={{ color: "text.secondary", letterSpacing: 1.2 }}>
              {item.label}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: item.tone }}>
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={2.5}>
        <Paper sx={{ flex: 2, borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2.5, boxShadow: "none" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Monthly Report Volume
          </Typography>
          <BarChart
            xAxis={[{ data: monthlyReportLabels, scaleType: "band", label: "Month" }]}
            series={[{ data: monthlyReportSeries, label: "Reports" }]}
            height={300}
          />
        </Paper>

        <Paper sx={{ flex: 1, borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2.5, boxShadow: "none" }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Category Share
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <PieChart
              series={[{ data: reportCategoryShare }]}
              width={250}
              height={250}
            />
          </Box>
        </Paper>
      </Stack>

      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", p: 2.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5 }}>
          Recent Reports
        </Typography>
        <Box sx={{ height: 380, width: "100%" }}>
          <DataGrid
            rows={reportRows}
            columns={reportColumns}
            pageSizeOptions={[5]}
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

export default ReportsPage;
