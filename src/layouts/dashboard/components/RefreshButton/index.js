import React from 'react';
import { IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import { IoRefreshOutline } from 'react-icons/io5';
import VuiBox from 'components/VuiBox';
import { useClient } from 'context/ClientContext';

const RefreshButton = () => {
  const { 
    refreshClients, 
    refreshSelectedClient, 
    isRefreshing, 
    error, 
    clearError 
  } = useClient();
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleRefresh = async () => {
    // First try to refresh just the selected client (faster)
    const success = await refreshSelectedClient();
    
    // If that fails or there's no selected client, refresh all clients
    if (!success) {
      await refreshClients();
    }
    
    // Show success message
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const handleCloseError = () => {
    clearError();
  };

  return (
    <VuiBox>
      <Tooltip title="Refresh Data" placement="bottom">
        <IconButton
          onClick={handleRefresh}
          disabled={isRefreshing}
          sx={{
            color: 'white',
            animation: isRefreshing ? 'spin 1.5s linear infinite' : 'none',
            '@keyframes spin': {
              '0%': {
                transform: 'rotate(0deg)',
              },
              '100%': {
                transform: 'rotate(360deg)',
              },
            },
          }}
        >
          <IoRefreshOutline size="20px" />
        </IconButton>
      </Tooltip>
      
      {/* Success message */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          Data refreshed successfully
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
    </VuiBox>
  );
};

export default RefreshButton;
