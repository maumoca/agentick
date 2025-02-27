import React, { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Collapse,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { IoChevronDown, IoChevronUp, IoAdd, IoTrash, IoCheckmarkCircle } from 'react-icons/io5';
import { useClient } from 'context/ClientContext';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import VuiButton from 'components/VuiButton';

const ClientSelector = () => {
  const { 
    clients, 
    selectedClient, 
    selectClient, 
    addClient, 
    removeClient, 
    loading,
    error,
    clearError
  } = useClient();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [open, setOpen] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  
  // Close the client list on mobile devices by default
  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [isMobile]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClientSelect = (clientId) => {
    selectClient(clientId);
  };

  const handleAddDialogOpen = () => {
    setAddDialogOpen(true);
  };

  const handleAddDialogClose = () => {
    setAddDialogOpen(false);
    setNewClientName('');
  };

  const validateClientName = (name) => {
    if (!name || name.trim() === '') {
      setValidationError('Client name is required');
      return false;
    }
    
    if (name.trim().length < 3) {
      setValidationError('Client name must be at least 3 characters');
      return false;
    }
    
    if (name.trim().length > 50) {
      setValidationError('Client name must be less than 50 characters');
      return false;
    }
    
    // Check if client name already exists
    if (clients.some(client => client.name.toLowerCase() === name.trim().toLowerCase())) {
      setValidationError('A client with this name already exists');
      return false;
    }
    
    setValidationError('');
    return true;
  };

  const handleAddClient = async () => {
    if (!validateClientName(newClientName)) {
      return;
    }
    
    try {
      setLocalLoading(true);
      const newClient = await addClient(newClientName.trim());
      
      if (newClient) {
        setSuccessMessage(`Client "${newClientName}" added successfully`);
        handleAddDialogClose();
      }
    } catch (err) {
      console.error("Error adding client:", err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteDialogOpen = (client, event) => {
    event.stopPropagation();
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const handleDeleteClient = async () => {
    if (clientToDelete) {
      try {
        setLocalLoading(true);
        const success = await removeClient(clientToDelete.id);
        
        if (success) {
          setSuccessMessage(`Client "${clientToDelete.name}" removed successfully`);
          handleDeleteDialogClose();
        }
      } catch (err) {
        console.error("Error removing client:", err);
      } finally {
        setLocalLoading(false);
      }
    }
  };
  
  const handleCloseSuccessMessage = () => {
    setSuccessMessage('');
  };
  
  const handleCloseError = () => {
    clearError();
  };

  return (
    <>
      <ListItem 
        button 
        onClick={handleToggle}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.5,
          pl: 3
        }}
      >
        <VuiTypography variant="button" fontWeight="medium" color="white">
          Clients
        </VuiTypography>
        {open ? <IoChevronUp size="18px" color="white" /> : <IoChevronDown size="18px" color="white" />}
      </ListItem>
      
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {clients.map((client) => (
            <ListItem
              key={client.id}
              button
              selected={selectedClient && selectedClient.id === client.id}
              onClick={() => handleClientSelect(client.id)}
              sx={{
                pl: 4,
                py: 1,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <VuiBox display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <VuiTypography variant="button" color="text">
                  {client.name}
                </VuiTypography>
                {clients.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteDialogOpen(client, e)}
                    sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                  >
                    <IoTrash size="16px" />
                  </IconButton>
                )}
              </VuiBox>
            </ListItem>
          ))}
          
          <ListItem
            button
            onClick={handleAddDialogOpen}
            sx={{
              pl: 4,
              py: 1,
              color: 'info.main',
            }}
          >
            <VuiBox display="flex" alignItems="center">
              <IoAdd size="18px" style={{ marginRight: '8px' }} />
              <VuiTypography variant="button" color="info">
                Add Client
              </VuiTypography>
            </VuiBox>
          </ListItem>
        </List>
      </Collapse>

      {/* Add Client Dialog */}
      <Dialog 
        open={addDialogOpen} 
        onClose={handleAddDialogClose}
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add New Client</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter a name for the new client. This will create a new dashboard with randomized performance data.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Client Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newClientName}
            onChange={(e) => {
              setNewClientName(e.target.value);
              if (e.target.value.trim()) {
                validateClientName(e.target.value);
              } else {
                setValidationError('');
              }
            }}
            error={!!validationError}
            helperText={validationError}
            disabled={localLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose} disabled={localLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddClient} 
            color="primary" 
            disabled={!newClientName.trim() || !!validationError || localLoading}
            startIcon={localLoading ? <CircularProgress size={20} /> : <IoCheckmarkCircle />}
          >
            {localLoading ? 'Adding...' : 'Add Client'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Client Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleDeleteDialogClose}
        fullScreen={isMobile}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete Client</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{clientToDelete?.name}</strong>? This action cannot be undone and all associated data will be permanently removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} disabled={localLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteClient} 
            color="error"
            disabled={localLoading}
            startIcon={localLoading ? <CircularProgress size={20} /> : null}
          >
            {localLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success message */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={handleCloseSuccessMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccessMessage} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
      
      {/* Error message */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ClientSelector;
