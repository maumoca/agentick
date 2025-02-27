import React, { useState, useEffect } from 'react';
import { Card, Button, CircularProgress, Alert } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import testFirebaseConnection from 'services/firebase/test-connection';

const FirebaseConnectionTest = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runTest = async () => {
    setLoading(true);
    try {
      const result = await testFirebaseConnection();
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: `Test failed: ${error.message}`,
        error
      });
    } finally {
      setLoading(false);
    }
  };

  // Run test on component mount
  useEffect(() => {
    runTest();
  }, []);

  return (
    <Card sx={{ p: 3, mb: 3 }}>
      <VuiBox display="flex" flexDirection="column">
        <VuiTypography variant="h6" fontWeight="medium" mb={2}>
          Firebase Connection Test
        </VuiTypography>
        
        {loading ? (
          <VuiBox display="flex" alignItems="center" mb={2}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <VuiTypography variant="button" color="text">
              Testing connection...
            </VuiTypography>
          </VuiBox>
        ) : testResult ? (
          <Alert 
            severity={testResult.success ? "success" : "error"}
            sx={{ mb: 2 }}
          >
            {testResult.message}
          </Alert>
        ) : null}
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={runTest}
          disabled={loading}
          sx={{ alignSelf: "flex-start" }}
        >
          {loading ? "Testing..." : "Test Connection"}
        </Button>
      </VuiBox>
    </Card>
  );
};

export default FirebaseConnectionTest;
