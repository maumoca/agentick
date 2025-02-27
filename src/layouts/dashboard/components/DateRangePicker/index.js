import React, { useState } from 'react';
import { Menu, MenuItem, Button } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import { IoCalendarOutline } from 'react-icons/io5';
import colors from 'assets/theme/base/colors';

const DateRangePicker = () => {
  const { info } = colors;
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRange, setSelectedRange] = useState('This Month');
  
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };
  
  const handleRangeSelect = (range) => {
    setSelectedRange(range);
    handleClose();
  };

  return (
    <VuiBox>
      <Button
        id="date-range-button"
        aria-controls={open ? 'date-range-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'transparent',
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <IoCalendarOutline size="18px" style={{ marginRight: '8px' }} />
        <VuiTypography variant="button" color="white" fontWeight="medium">
          {selectedRange}
        </VuiTypography>
      </Button>
      <Menu
        id="date-range-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'date-range-button',
        }}
        PaperProps={{
          sx: {
            backgroundColor: '#1a1f37',
            color: 'white',
            minWidth: '150px',
          },
        }}
      >
        <MenuItem onClick={() => handleRangeSelect('Today')}>
          <VuiTypography variant="button" color="white">
            Today
          </VuiTypography>
        </MenuItem>
        <MenuItem onClick={() => handleRangeSelect('This Week')}>
          <VuiTypography variant="button" color="white">
            This Week
          </VuiTypography>
        </MenuItem>
        <MenuItem onClick={() => handleRangeSelect('This Month')}>
          <VuiTypography variant="button" color="white">
            This Month
          </VuiTypography>
        </MenuItem>
        <MenuItem onClick={() => handleRangeSelect('Custom')}>
          <VuiTypography variant="button" color="white">
            Custom
          </VuiTypography>
        </MenuItem>
      </Menu>
    </VuiBox>
  );
};

export default DateRangePicker;
