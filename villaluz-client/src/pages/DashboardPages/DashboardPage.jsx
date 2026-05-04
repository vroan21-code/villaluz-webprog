import React from 'react';
import { BarChart, PieChart } from '@mui/x-charts';

import { DataGrid } from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';

import { Gauge } from '@mui/x-charts/Gauge';
import { Typography, Card, CardContent } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import usersSeed from '../../data/users.json';

const columns = [
  { field: 'id', headerName: 'ID', width: 72 },
  {
    field: 'fullName',
    headerName: 'User',
    sortable: false,
    minWidth: 220,
    flex: 1.2,
    renderCell: (params) => {
      const label = params.value?.trim() || 'Unknown User';
      const initials = label
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: '#18181b', fontSize: 13 }}>
            {initials}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {label}
          </Typography>
        </Box>
      );
    },
  },
  { field: 'username', headerName: 'Username', minWidth: 130, flex: 0.8 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 88,
    valueGetter: (value, row) => row.age ?? null,
  },
  { field: 'gender', headerName: 'Gender', minWidth: 100, flex: 0.7 },
  { field: 'role', headerName: 'Role', minWidth: 100, flex: 0.7 },
  {
    field: 'status',
    headerName: 'Status',
    minWidth: 110,
    flex: 0.7,
    renderCell: (params) =>
      params.value === 'Active' ? (
        <Chip label="Active" size="small" color="success" sx={{ fontWeight: 600 }} />
      ) : (
        <Chip
          label="Inactive"
          size="small"
          variant="outlined"
          sx={{ fontWeight: 600, borderColor: 'rgba(24,24,27,0.35)' }}
        />
      ),
  },
];

const rows = usersSeed.map((u) => ({ ...u }));

function DashboardPage() {
  const ageKnown = rows.filter((row) => row.age !== null && row.age !== undefined);
  const averageAge =
    ageKnown.length > 0
      ? (ageKnown.reduce((sum, row) => sum + Number(row.age), 0) / ageKnown.length).toFixed(1)
      : '—';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          p: { xs: 2, md: 3 },
          background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)',
          color: 'common.white',
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
          Quick insight cards, charts, and user statistics in one place.
        </Typography>
      </Paper>

      {/* Summary Section */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2.5}
      >
        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', flex: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="overline" sx={{ letterSpacing: 1.2, color: 'text.secondary' }}>
              Total Users
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {rows.length}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Active records in your grid
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', flex: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="overline" sx={{ letterSpacing: 1.2, color: 'text.secondary' }}>
              Average Age
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {averageAge}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Based on users with known age
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none', flex: 1 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="overline" sx={{ letterSpacing: 1.2, color: 'text.secondary' }}>
              Data Completeness
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {rows.length > 0
                ? Math.round((ageKnown.length / rows.length) * 100)
                : 0}
              %
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Users with complete age data
            </Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Gauges */}
      <Paper sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 3, boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Gauge Summary
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Gauge width={150} height={120} value={50} />
            <Typography variant="body2" color="text.secondary">
              Completion
            </Typography>
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Gauge width={150} height={120} value={50} valueMin={10} valueMax={60} />
            <Typography variant="body2" color="text.secondary">
              Performance Range
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Charts */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2.5}>
        <Paper sx={{ flex: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 2.5, boxShadow: 'none' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Quarterly Sales
          </Typography>
          <BarChart
            series={[
              { data: [35, 44, 24, 34], label: 'Series 1' },
              { data: [51, 6, 49, 30], label: 'Series 2' },
            ]}
            height={300}
            xAxis={[
              {
                data: ['Q1', 'Q2', 'Q3', 'Q4'],
                scaleType: 'band',
                label: 'Quarters',
              },
            ]}
          />
        </Paper>

        <Paper sx={{ flex: 1, borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 2.5, boxShadow: 'none' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Series Share
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: 'series A' },
                    { id: 1, value: 15, label: 'series B' },
                    { id: 2, value: 20, label: 'series C' },
                  ],
                },
              ]}
              width={250}
              height={250}
            />
          </Box>
        </Paper>
      </Stack>

      {/* DataGrid */}
      <Paper sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 2.5, boxShadow: 'none' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Users Overview
        </Typography>
        <Box sx={{ height: 420, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
            sx={{
              border: 0,
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f4f4f5',
              },
            }}
          />
        </Box>
      </Paper>

      {/* React Leaflet Map */}
      <Paper sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 2.5, boxShadow: 'none' }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          Location Map
        </Typography>
        <Box sx={{ height: 500, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
          <MapContainer
            center={[14.604253, 120.994314]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[14.604253, 120.994314]}>
              <Popup>
                National University-Manila <br />
                <p>551 F Jhocson St, Sampaloc, Manila, 1008 Metro Manila</p>
              </Popup>
            </Marker>
          </MapContainer>
        </Box>
      </Paper>
    </Box>
  );
}

export default DashboardPage;