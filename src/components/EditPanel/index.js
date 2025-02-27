import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Slider,
  Button,
  IconButton,
  Divider
} from '@mui/material';
import { IoClose } from 'react-icons/io5';
import { useEdit } from 'context/EditContext';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import VuiButton from 'components/VuiButton';

const EditPanel = () => {
  const { editMode, toggleEditMode, preferences, updatePreferences } = useEdit();

  const handleLayoutChange = (event) => {
    updatePreferences({ layout: event.target.value });
  };

  const handleColorThemeChange = (event) => {
    updatePreferences({ colorTheme: event.target.value });
  };

  const handlePaddingChange = (event) => {
    updatePreferences({ padding: event.target.value });
  };

  const handleFontSizeChange = (event) => {
    updatePreferences({ fontSize: event.target.value });
  };

  return (
    <Drawer
      anchor="right"
      open={editMode}
      onClose={toggleEditMode}
      PaperProps={{
        sx: {
          width: 300,
          backgroundColor: '#111c44',
          color: 'white',
          padding: '20px',
        },
      }}
    >
      <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <VuiTypography variant="h5" fontWeight="bold" color="white">
          Dashboard Settings
        </VuiTypography>
        <IconButton onClick={toggleEditMode} sx={{ color: 'white' }}>
          <IoClose />
        </IconButton>
      </VuiBox>

      <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', my: 2 }} />

      <VuiBox mb={3}>
        <VuiTypography variant="button" fontWeight="regular" color="text">
          Customize your dashboard appearance and layout.
        </VuiTypography>
      </VuiBox>

      <VuiBox mb={3}>
        <FormControl component="fieldset">
          <VuiTypography variant="button" fontWeight="bold" color="white" mb={1}>
            Color Theme
          </VuiTypography>
          <RadioGroup
            aria-label="color-theme"
            name="color-theme"
            value={preferences.colorTheme}
            onChange={handleColorThemeChange}
          >
            <FormControlLabel 
              value="dark" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<VuiTypography variant="button" color="text">Dark</VuiTypography>} 
            />
            <FormControlLabel 
              value="light" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<VuiTypography variant="button" color="text">Light</VuiTypography>} 
            />
            <FormControlLabel 
              value="blue" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<VuiTypography variant="button" color="text">Blue</VuiTypography>} 
            />
          </RadioGroup>
        </FormControl>
      </VuiBox>

      <VuiBox mb={3}>
        <FormControl component="fieldset">
          <VuiTypography variant="button" fontWeight="bold" color="white" mb={1}>
            Layout
          </VuiTypography>
          <RadioGroup
            aria-label="layout"
            name="layout"
            value={preferences.layout}
            onChange={handleLayoutChange}
          >
            <FormControlLabel 
              value="default" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<VuiTypography variant="button" color="text">Default</VuiTypography>} 
            />
            <FormControlLabel 
              value="compact" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<VuiTypography variant="button" color="text">Compact</VuiTypography>} 
            />
            <FormControlLabel 
              value="expanded" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<VuiTypography variant="button" color="text">Expanded</VuiTypography>} 
            />
          </RadioGroup>
        </FormControl>
      </VuiBox>

      <VuiBox mb={3}>
        <FormControl component="fieldset">
          <VuiTypography variant="button" fontWeight="bold" color="white" mb={1}>
            Padding
          </VuiTypography>
          <RadioGroup
            aria-label="padding"
            name="padding"
            value={preferences.padding}
            onChange={handlePaddingChange}
          >
            <FormControlLabel 
              value="small" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<VuiTypography variant="button" color="text">Small</VuiTypography>} 
            />
            <FormControlLabel 
              value="medium" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<VuiTypography variant="button" color="text">Medium</VuiTypography>} 
            />
            <FormControlLabel 
              value="large" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<VuiTypography variant="button" color="text">Large</VuiTypography>} 
            />
          </RadioGroup>
        </FormControl>
      </VuiBox>

      <VuiBox mb={3}>
        <FormControl component="fieldset">
          <VuiTypography variant="button" fontWeight="bold" color="white" mb={1}>
            Font Size
          </VuiTypography>
          <RadioGroup
            aria-label="font-size"
            name="font-size"
            value={preferences.fontSize}
            onChange={handleFontSizeChange}
          >
            <FormControlLabel 
              value="small" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<VuiTypography variant="button" color="text">Small</VuiTypography>} 
            />
            <FormControlLabel 
              value="medium" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<VuiTypography variant="button" color="text">Medium</VuiTypography>} 
            />
            <FormControlLabel 
              value="large" 
              control={<Radio sx={{ color: 'white' }} />} 
              label={<VuiTypography variant="button" color="text">Large</VuiTypography>} 
            />
          </RadioGroup>
        </FormControl>
      </VuiBox>

      <VuiBox mt={4}>
        <VuiButton
          variant="contained"
          color="info"
          fullWidth
          onClick={toggleEditMode}
        >
          Save & Close
        </VuiButton>
      </VuiBox>
    </Drawer>
  );
};

export default EditPanel;
