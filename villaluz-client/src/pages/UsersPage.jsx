import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '../components/Button';
import { DataGrid } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Switch from '@mui/material/Switch';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { fetchUsers, createUser, updateUser, deleteUser } from '../services/userService';
import localUsers from '../data/users.json';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const UsersPage = () => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    contactNumber: '',
    email: '',
    username: '',
    password: '',
    address: '',
    isActive: true,
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data } = await fetchUsers();
      // backend returns { users: [...] }
      const list = data?.users || data;
      setUsers(list || []);
    } catch (error) {
      // fallback to local JSON when API unavailable
      console.error('Error fetching users, falling back to local data:', error.message || error);
      setUsers(localUsers || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpen = () => {
    setIsEditing(false);
    setEditedUser(null);
    setNewUser({
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      contactNumber: '',
      email: '',
      username: '',
      password: '',
      address: '',
      isActive: true,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setEditedUser(null);
  };

  const handleEdit = (id) => {
    const userToEdit = users.find((u) => u._id === id || u.id === id);
    if (!userToEdit) return;
    setEditedUser(userToEdit);
    setNewUser({ ...userToEdit, password: '' });
    setIsEditing(true);
    setOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      if (isEditing && editedUser) {
        const updated = { ...newUser };
        if (!updated.password) delete updated.password; // don't overwrite password with empty
        await updateUser(editedUser._id || editedUser.id, updated);
      } else {
        await createUser(newUser);
      }
      await loadUsers();
      handleClose();
    } catch (error) {
      console.error('Error saving user:', error.message || error);
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await updateUser(id, { isActive: !isActive });
      await loadUsers();
    } catch (error) {
      console.error('Error toggling active:', error.message || error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error.message || error);
    }
  };

  const columns = [
    { field: 'name', headerName: 'Name', flex: 1, valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}` },
    { field: 'age', headerName: 'Age', flex: 1, sortable: true, valueGetter: (p) => p.row.age || '' },
    { field: 'gender', headerName: 'Gender', flex: 1, sortable: true, valueGetter: (p) => p.row.gender || '' },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'username', headerName: 'Username', flex: 1 },
    { field: 'address', headerName: 'Address', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" size="small" onClick={() => handleEdit(params.row._id || params.row.id)}>Edit</Button>
          <Button variant="contained" color="secondary" size="small" onClick={() => handleDelete(params.row._id || params.row.id)}>Delete</Button>
          <Switch checked={!!params.row.isActive} onChange={() => handleToggleActive(params.row._id || params.row.id, params.row.isActive)} color="primary" />
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Stack direction="row" sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h2" fontWeight="bold">Users</Typography>
        <Button variant="contained" color="primary" onClick={handleOpen}>Add User</Button>
      </Stack>

      <Modal keepMounted open={open} onClose={handleClose} aria-labelledby="add-user-modal" aria-describedby="add-user-modal-description">
        <Box sx={modalStyle}>
          <Typography id="keep-mounted-modal-title" variant="h4" component="h2">{isEditing ? 'Edit User' : 'Add User'}</Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Box>
              <AccountCircleIcon sx={{ mr: 1 }} />
              <TextField fullWidth label="Enter first name" variant="standard" value={newUser.firstName} onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })} />
            </Box>
            <Box>
              <TextField fullWidth label="Enter last name" variant="standard" value={newUser.lastName} onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })} />
            </Box>
            <Box>
              <TextField fullWidth label="Enter age" variant="standard" value={newUser.age} onChange={(e) => setNewUser({ ...newUser, age: e.target.value })} />
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select labelId="gender-label" value={newUser.gender} label="Gender" onChange={(e) => setNewUser({ ...newUser, gender: e.target.value })}>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField fullWidth label="Enter contact number" variant="standard" value={newUser.contactNumber} onChange={(e) => setNewUser({ ...newUser, contactNumber: e.target.value })} />
            </Box>
            <Box>
              <TextField fullWidth label="Enter email" variant="standard" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            </Box>
            <Box>
              <TextField fullWidth label="Enter address" variant="standard" value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })} />
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="type-label">Type</InputLabel>
                <Select labelId="type-label" value={newUser.type || 'viewer'} label="Type" onChange={(e) => setNewUser({ ...newUser, type: e.target.value })}>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="editor">Editor</MenuItem>
                  <MenuItem value="viewer">Viewer</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <TextField fullWidth label="Enter username" variant="standard" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
            </Box>
            <Box>
              <TextField fullWidth label="Enter password" variant="standard" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
            </Box>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={handleClose}>Cancel</Button>
              <Button variant="contained" onClick={handleSaveUser}>{isEditing ? 'Save Changes' : 'Add'}</Button>
            </Stack>
          </Stack>
        </Box>
      </Modal>

      <Box sx={{ height: 500, width: '100%', mt: 5 }}>
        <DataGrid rows={users.map((u) => ({ ...u, id: u._id || u.id }))} columns={columns} loading={loading} pageSize={10} rowsPerPageOptions={[10, 20, 50]} disableSelectionOnClick />
      </Box>
    </Box>
  );
};

export default UsersPage;
