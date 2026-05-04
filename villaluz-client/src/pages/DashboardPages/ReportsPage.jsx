import { useMemo } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Button,
  GlobalStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import { BarChart, PieChart } from "@mui/x-charts";
import { DataGrid } from "@mui/x-data-grid";

import usersSeed from "../../data/users.json";

const reportSummary = [
  { label: "Total Reports", value: "128", tone: "#18181b" },
  { label: "Pending Review", value: "18", tone: "#b45309" },
  { label: "Resolved", value: "96", tone: "#166534" },
];

const monthlyReportSeries = [12, 18, 15, 21, 17, 26];
const monthlyReportLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const reportCategoryShare = [
  { id: 0, value: 42, label: "Security", color: "#3b82f6" },
  { id: 1, value: 34, label: "Transport", color: "#8b5cf6" },
  { id: 2, value: 24, label: "System", color: "#10b981" },
];

const reportTemplates = [
  { reportId: "REP-1001", category: "Security", status: "Resolved", createdAt: "2026-04-04" },
  { reportId: "REP-1002", category: "Transport", status: "Pending", createdAt: "2026-04-05" },
  { reportId: "REP-1003", category: "System", status: "In Progress", createdAt: "2026-04-08" },
  { reportId: "REP-1004", category: "Security", status: "Resolved", createdAt: "2026-04-10" },
  { reportId: "REP-1005", category: "Operations", status: "Pending", createdAt: "2026-04-12" },
  { reportId: "REP-1006", category: "System", status: "Resolved", createdAt: "2026-04-14" },
];

const users = usersSeed.map((u) => ({ ...u }));
const maxSeries = Math.max(...monthlyReportSeries, 1);

const ownerNameAt = (i) => (users.length > 0 ? users[i % users.length].fullName : "—");

const buildReportRows = () =>
  reportTemplates.map((template, index) => ({
    id: index + 1,
    ...template,
    owner: ownerNameAt(index),
  }));

const statusPrintStyle = {
  Resolved: { bg: "#dcfce7", color: "#166534", border: "#86efac" },
  Pending: { bg: "#ffedd5", color: "#c2410c", border: "#fdba74" },
  "In Progress": { bg: "#e0f2fe", color: "#0369a1", border: "#7dd3fc" },
};

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

const pieChartData = reportCategoryShare.map(({ id, value, label }) => ({ id, value, label }));

const ReportsPrintView = ({ reportRows, generatedLabel }) => {
  const totalMonthly = monthlyReportSeries.reduce((acc, v) => acc + v, 0);
  const avgMonthly = Math.round((totalMonthly / Math.max(monthlyReportSeries.length, 1)) * 10) / 10;
  const peakIndex = monthlyReportSeries.reduce((bestIdx, v, idx, arr) => (v > arr[bestIdx] ? idx : bestIdx), 0);
  const peakMonth = monthlyReportLabels[peakIndex];
  const peakValue = monthlyReportSeries[peakIndex];

  const topCategory = reportCategoryShare.reduce((best, c) => (c.value > best.value ? c : best), reportCategoryShare[0]);
  const totalRecent = reportRows.length;

  return (
    <Box
      id="reports-print-root"
      sx={{
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        p: 3,
        bgcolor: "#fafafa",
        color: "#18181b",
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        "@media screen": {
          position: "absolute",
          left: -99999,
          top: 0,
          zIndex: -1,
        },
        "@media print": {
          maxWidth: "100%",
          p: 2,
          bgcolor: "#ffffff",
          zIndex: "auto",
        },
      }}
    >
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e4e4e7",
        p: 2.5,
        mb: 2.5,
        background: "linear-gradient(135deg, #18181b 0%, #27272a 100%)",
        color: "#fff",
        breakInside: "avoid",
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
      <Typography
        component="h1"
        sx={{
          fontFamily: '"Sora", "Inter", sans-serif',
          fontSize: 24,
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        Reports Center
      </Typography>
      <Box sx={{ textAlign: "right" }}>
        <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600, letterSpacing: 0.3 }}>
          Villaluz Dashboard
        </Typography>
        <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>
          Export • PDF
        </Typography>
      </Box>
      </Stack>
      <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: 13, mt: 0.5 }}>
        Track report statuses, ownership, and monthly activity trends.
      </Typography>
      {generatedLabel && (
        <Typography sx={{ color: "rgba(255,255,255,0.6)", fontSize: 11, mt: 1.5 }}>
          {generatedLabel}
        </Typography>
      )}
    </Paper>

    <Stack direction="row" spacing={1.5} sx={{ mb: 2.5, flexWrap: "wrap", gap: 1.5 }}>
      {reportSummary.map((item) => (
        <Paper
          key={item.label}
          elevation={0}
          sx={{
            flex: "1 1 140px",
            minWidth: 120,
            borderRadius: 3,
            border: "1px solid #e4e4e7",
            p: 2,
            bgcolor: "#fff",
            breakInside: "avoid",
          }}
        >
          <Typography
            sx={{
              fontSize: 10,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              color: "#71717a",
              fontWeight: 600,
            }}
          >
            {item.label}
          </Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: item.tone, lineHeight: 1.1, mt: 0.5 }}>
            {item.value}
          </Typography>
        </Paper>
      ))}
    </Stack>

    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e4e4e7",
        p: 2,
        mb: 2.5,
        bgcolor: "#fff",
        breakInside: "avoid",
      }}
    >
      <Typography sx={{ fontFamily: '"Sora", "Inter", sans-serif', fontSize: 16, fontWeight: 600, mb: 1.25 }}>
        Highlights
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} sx={{ flexWrap: "wrap", gap: 1.25 }}>
        <Box sx={{ flex: "1 1 200px", border: "1px solid #e4e4e7", borderRadius: 2, p: 1.25, bgcolor: "#fafafa" }}>
          <Typography sx={{ fontSize: 10, letterSpacing: 1.1, textTransform: "uppercase", color: "#71717a", fontWeight: 700 }}>
            Peak month
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 700, mt: 0.5 }}>
            {peakMonth} • {peakValue} reports
          </Typography>
        </Box>
        <Box sx={{ flex: "1 1 200px", border: "1px solid #e4e4e7", borderRadius: 2, p: 1.25, bgcolor: "#fafafa" }}>
          <Typography sx={{ fontSize: 10, letterSpacing: 1.1, textTransform: "uppercase", color: "#71717a", fontWeight: 700 }}>
            Average per month
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 700, mt: 0.5 }}>{avgMonthly}</Typography>
        </Box>
        <Box sx={{ flex: "1 1 200px", border: "1px solid #e4e4e7", borderRadius: 2, p: 1.25, bgcolor: "#fafafa" }}>
          <Typography sx={{ fontSize: 10, letterSpacing: 1.1, textTransform: "uppercase", color: "#71717a", fontWeight: 700 }}>
            Largest category
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 700, mt: 0.5 }}>
            {topCategory?.label ?? "—"} • {topCategory?.value ?? "—"}%
          </Typography>
        </Box>
        <Box sx={{ flex: "1 1 200px", border: "1px solid #e4e4e7", borderRadius: 2, p: 1.25, bgcolor: "#fafafa" }}>
          <Typography sx={{ fontSize: 10, letterSpacing: 1.1, textTransform: "uppercase", color: "#71717a", fontWeight: 700 }}>
            Recent records
          </Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 700, mt: 0.5 }}>{totalRecent}</Typography>
        </Box>
      </Stack>
    </Paper>

    <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 2.5 }}>
      <Paper
        elevation={0}
        sx={{
          flex: 2,
          borderRadius: 3,
          border: "1px solid #e4e4e7",
          p: 2,
          bgcolor: "#fff",
          breakInside: "avoid",
        }}
      >
        <Typography sx={{ fontFamily: '"Sora", "Inter", sans-serif', fontSize: 18, fontWeight: 600, mb: 2 }}>
          Monthly Report Volume
        </Typography>
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1, height: 180, pt: 1 }}>
          {monthlyReportSeries.map((value, i) => (
            <Box key={monthlyReportLabels[i]} sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", minWidth: 0 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#18181b", mb: 0.5 }}>
                {value}
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 48,
                  height: `${(value / maxSeries) * 140}px`,
                  minHeight: 8,
                  borderRadius: "6px 6px 0 0",
                  background: "linear-gradient(180deg, #3f3f46 0%, #18181b 100%)",
                }}
              />
              <Typography sx={{ fontSize: 10, color: "#71717a", mt: 1, textAlign: "center" }}>
                {monthlyReportLabels[i]}
              </Typography>
            </Box>
          ))}
        </Box>
        <Typography sx={{ fontSize: 11, color: "#71717a", mt: 1 }}>Month</Typography>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          flex: 1,
          borderRadius: 3,
          border: "1px solid #e4e4e7",
          p: 2,
          bgcolor: "#fff",
          breakInside: "avoid",
        }}
      >
        <Typography sx={{ fontFamily: '"Sora", "Inter", sans-serif', fontSize: 18, fontWeight: 600, mb: 2 }}>
          Category Share
        </Typography>
        <Stack spacing={1.25}>
          {reportCategoryShare.map((cat) => (
            <Box key={cat.id} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: cat.color,
                  flexShrink: 0,
                }}
              />
              <Typography sx={{ flex: 1, fontSize: 13 }}>{cat.label}</Typography>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#18181b" }}>{cat.value}%</Typography>
            </Box>
          ))}
        </Stack>
        <Box
          sx={{
            mt: 2,
            height: 8,
            borderRadius: 4,
            overflow: "hidden",
            display: "flex",
            width: "100%",
          }}
        >
          {reportCategoryShare.map((cat) => (
            <Box key={cat.id} sx={{ width: `${cat.value}%`, bgcolor: cat.color }} />
          ))}
        </Box>
      </Paper>
    </Stack>

    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e4e4e7",
        p: 2,
        bgcolor: "#fff",
        breakInside: "avoid",
      }}
    >
      <Typography sx={{ fontFamily: '"Sora", "Inter", sans-serif', fontSize: 18, fontWeight: 600, mb: 1.5 }}>
        Recent Reports
      </Typography>
      <Table
        size="small"
        sx={{
          borderCollapse: "collapse",
          tableLayout: "fixed",
          "& .MuiTableCell-root": { borderColor: "#e4e4e7", fontSize: 11.5, py: 0.85 },
          "& .MuiTableCell-head": { fontSize: 11, letterSpacing: 0.2 },
        }}
      >
        <TableHead>
          <TableRow sx={{ bgcolor: "#f4f4f5" }}>
            <TableCell sx={{ fontWeight: 700 }}>Report ID</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Owner</TableCell>
            <TableCell sx={{ fontWeight: 700 }}>Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reportRows.map((row, idx) => {
            const st = statusPrintStyle[row.status] ?? { bg: "#f4f4f5", color: "#3f3f46", border: "#e4e4e7" };
            return (
              <TableRow
                key={row.id}
                sx={{
                  breakInside: "avoid",
                  "&:nth-of-type(even)": { bgcolor: "#fcfcfd" },
                }}
              >
                <TableCell sx={{ fontWeight: 700, color: "#18181b" }}>{row.reportId}</TableCell>
                <TableCell sx={{ color: "#3f3f46" }}>{row.category}</TableCell>
                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      fontSize: 11,
                      fontWeight: 600,
                      bgcolor: st.bg,
                      color: st.color,
                      border: `1px solid ${st.border}`,
                    }}
                  >
                    {row.status}
                  </Box>
                </TableCell>
                <TableCell sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.owner}</TableCell>
                <TableCell sx={{ color: "#52525b" }}>{row.createdAt}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Typography sx={{ fontSize: 10, color: "#71717a", mt: 1.25 }}>
        Note: This PDF summarizes dashboard data and may not include all historical records.
      </Typography>
    </Paper>

    <Box
      sx={{
        display: "none",
        "@media print": {
          display: "block",
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          px: 2,
          py: 1,
          borderTop: "1px solid #e4e4e7",
          bgcolor: "rgba(255,255,255,0.96)",
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Typography sx={{ fontSize: 10, color: "#71717a" }}>{generatedLabel}</Typography>
        <Typography
          sx={{
            fontSize: 10,
            color: "#71717a",
            "&::after": { content: '"Page " counter(page) " of " counter(pages)' },
          }}
        />
      </Stack>
    </Box>
  </Box>
  );
};

const ReportsPage = () => {
  const reportRows = useMemo(() => buildReportRows(), []);
  const generatedLabel = useMemo(() => {
    const d = new Date();
    return `Generated ${d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;
  }, []);

  const handlePrintPdf = () => window.print();

  return (
    <>
      <GlobalStyles
        styles={{
          "@media print": {
            "@page": { size: "auto", margin: "12mm" },
            "body *": { visibility: "hidden" },
            "#reports-print-root, #reports-print-root *": { visibility: "visible" },
            "#reports-print-root": {
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
            },
          },
        }}
      />

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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Reports Center
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>
                Track report statuses, ownership, and monthly activity trends.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="inherit"
              size="large"
              onClick={handlePrintPdf}
              startIcon={<PictureAsPdfOutlinedIcon />}
              sx={{
                alignSelf: { xs: "stretch", sm: "center" },
                bgcolor: "rgba(255,255,255,0.12)",
                color: "common.white",
                border: "1px solid rgba(255,255,255,0.2)",
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              Save as PDF
            </Button>
          </Stack>
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
              <PieChart series={[{ data: pieChartData }]} width={250} height={250} />
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
              pageSizeOptions={[5, 6, 10]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 6, page: 0 },
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

      <ReportsPrintView reportRows={reportRows} generatedLabel={generatedLabel} />
    </>
  );
};

export default ReportsPage;
