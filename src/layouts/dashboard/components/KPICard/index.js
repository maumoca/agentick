import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Grid, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import colors from 'assets/theme/base/colors';
import { useClient } from 'context/ClientContext';
import { useEdit } from 'context/EditContext';

function KPICard({ title, count, percentage, icon, metricKey }) {
  const { info } = colors;
  const { selectedClient, loading } = useClient();
  const { preferences } = useEdit();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for animation
  const [prevCount, setPrevCount] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Get padding values based on preferences and screen size
  const getPadding = () => {
    if (isMobile) {
      return '16px 12px'; // More vertical padding on mobile for better touch targets
    }
    
    switch(preferences.padding) {
      case 'small': return '12px';
      case 'large': return '24px';
      case 'medium':
      default: return '17px';
    }
  };
  
  // Detect iOS device
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  // Use client data if available, otherwise use props
  const displayCount = selectedClient?.metrics?.[metricKey]?.current || count;
  const displayPercentage = selectedClient?.metrics?.[metricKey]?.trend || percentage.text;
  
  // Trigger animation when count changes
  useEffect(() => {
    if (prevCount !== null && prevCount !== displayCount) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
    setPrevCount(displayCount);
  }, [displayCount, prevCount]);

  // Define colors based on trend
  const getTrendColors = (trend) => {
    let trendValue;
    
    if (typeof trend === 'string') {
      // Extract numeric value from string like "+15%" or "-2%"
      trendValue = parseFloat(trend.replace(/[^-\d.]/g, ''));
      // Check if it's negative
      if (trend.includes('-')) {
        trendValue = -trendValue;
      }
    } else {
      trendValue = trend;
    }
    
    if (trendValue > 0) {
      return {
        color: '#33CC66', // Green for positive trends
        backgroundColor: 'rgba(51, 204, 102, 0.1)',
        icon: '▲'
      };
    }
    if (trendValue < 0) {
      return {
        color: '#FF5555', // Red for negative trends
        backgroundColor: 'rgba(255, 85, 85, 0.1)',
        icon: '▼'
      };
    }
    return {
      color: '#888888', // Gray for neutral trends
      backgroundColor: 'rgba(136, 136, 136, 0.1)',
      icon: '•'
    };
  };

  const trendStyle = getTrendColors(displayPercentage);
  const isPositive = parseFloat(displayPercentage) >= 0;
  
  // Format the display count for better readability
  const formatDisplayCount = (value) => {
    if (typeof value === 'string') {
      return value;
    }
    
    // If it's a number, format it with commas for thousands
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    
    return value;
  };

  return (
    <Card 
      sx={{ 
        padding: getPadding(),
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
        },
        // iOS specific styles
        WebkitTapHighlightColor: 'transparent',
        // Better touch feedback for mobile
        ...(isMobile && {
          cursor: 'pointer',
          '&:active': {
            transform: 'scale(0.98)',
            transition: 'transform 0.1s ease'
          },
          // Add safe area insets for iOS notched devices
          ...(isIOS && {
            paddingLeft: 'max(12px, env(safe-area-inset-left))',
            paddingRight: 'max(12px, env(safe-area-inset-right))'
          })
        })
      }}
    >
      {loading ? (
        // Loading skeleton
        <VuiBox>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={8}>
              <VuiBox lineHeight={1}>
                <Skeleton variant="text" width="60%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Skeleton variant="text" width="40%" height={30} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Skeleton variant="rectangular" width="30%" height={24} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '4px' }} />
              </VuiBox>
            </Grid>
            <Grid item xs={4}>
              <Skeleton 
                variant="rectangular" 
                width="3rem" 
                height="3rem" 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  borderRadius: '12px',
                  marginLeft: 'auto'
                }} 
              />
            </Grid>
          </Grid>
        </VuiBox>
      ) : (
        <VuiBox>
          <Grid container alignItems="center" spacing={isMobile ? 1 : 2}>
            <Grid item xs={8}>
              <VuiBox lineHeight={1}>
                <VuiTypography
                  variant="caption"
                  color="text"
                  opacity={0.8}
                  textTransform="capitalize"
                  fontWeight={title.fontWeight}
                  mb={0.5}
                >
                  {title.text}
                </VuiTypography>
                <VuiTypography 
                  variant={isMobile ? "body2" : "subtitle1"} 
                  fontWeight="bold" 
                  color="white" 
                  mb={0.5}
                  sx={{
                    transition: 'color 0.5s ease',
                    color: isAnimating ? info.main : 'white'
                  }}
                >
                  {formatDisplayCount(displayCount)}
                </VuiTypography>
                <VuiBox display="flex" alignItems="center">
                  <VuiTypography
                    variant="button"
                    fontWeight="bold"
                    sx={{
                      borderRadius: '4px',
                      padding: isMobile ? '4px 8px' : '2px 6px', // Larger touch target on mobile
                      color: trendStyle.color,
                      backgroundColor: trendStyle.backgroundColor,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      // Improve text rendering on iOS
                      WebkitFontSmoothing: 'antialiased',
                      MozOsxFontSmoothing: 'grayscale'
                    }}
                  >
                    <span>{trendStyle.icon}</span>
                    {typeof displayPercentage === 'string' && displayPercentage.startsWith('+') 
                      ? displayPercentage 
                      : isPositive ? '+' + displayPercentage : displayPercentage}
                  </VuiTypography>
                </VuiBox>
              </VuiBox>
            </Grid>
            <Grid item xs={4}>
              <VuiBox
                bgColor={info.main}
                color="white"
                width={isMobile ? "3rem" : "3rem"} // Keep consistent size on mobile for better touch target
                height={isMobile ? "3rem" : "3rem"}
                marginLeft="auto"
                borderRadius="lg"
                display="flex"
                justifyContent="center"
                alignItems="center"
                shadow="md"
                sx={{
                  transition: 'transform 0.3s ease',
                  transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
                  // Better touch feedback
                  ...(isMobile && {
                    '&:active': {
                      transform: 'scale(0.95)',
                      transition: 'transform 0.1s ease'
                    }
                  }),
                  // Fix for Safari rendering
                  WebkitBackfaceVisibility: 'hidden',
                  WebkitTransform: isAnimating ? 'scale(1.1) translateZ(0)' : 'scale(1) translateZ(0)'
                }}
              >
                {icon.component}
              </VuiBox>
            </Grid>
          </Grid>
        </VuiBox>
      )}
    </Card>
  );
}

// Setting default values for the props of KPICard
KPICard.defaultProps = {
  title: {
    fontWeight: "medium",
    text: "",
  },
  percentage: {
    color: "success",
    text: "",
  },
  metricKey: "",
};

// Typechecking props for the KPICard
KPICard.propTypes = {
  title: PropTypes.PropTypes.shape({
    fontWeight: PropTypes.oneOf(["light", "regular", "medium", "bold"]),
    text: PropTypes.string,
  }),
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  icon: PropTypes.shape({
    component: PropTypes.node.isRequired,
  }).isRequired,
  metricKey: PropTypes.string,
};

export default KPICard;
