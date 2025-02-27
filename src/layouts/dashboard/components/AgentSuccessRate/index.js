import React, { useState, useEffect } from 'react';
import { Card, Grid, Skeleton, useMediaQuery, useTheme, Tooltip } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import VuiButton from 'components/VuiButton';
import { IoRocket, IoTrendingUp, IoTrendingDown, IoInformation } from 'react-icons/io5';
import colors from 'assets/theme/base/colors';
import linearGradient from 'assets/theme/functions/linearGradient';
import CircularProgress from '@mui/material/CircularProgress';
import { useClient } from 'context/ClientContext';
import { useEdit } from 'context/EditContext';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const AgentSuccessRate = () => {
	const { info, gradients, success, warning, error } = colors;
	const { cardContent } = gradients;
	const { selectedClient, loading } = useClient();
	const { preferences } = useEdit();
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
	const isMedium = useMediaQuery(theme.breakpoints.down('md'));
	
	// State for animation
	const [prevRate, setPrevRate] = useState(null);
	const [isAnimating, setIsAnimating] = useState(false);

	// Get data from selected client or use default
	const successRate = selectedClient?.metrics?.successRate?.current || 82; // percentage
	const previousRate = selectedClient?.metrics?.successRate?.previous || 75; // percentage
	const change = successRate - previousRate;
	const historyData = selectedClient?.metrics?.successRate?.history || 
		[75, 78, 76, 79, 80, 78, 82, 81, 84, 82, 85, 82]; // 12 months of data
	
	// Trigger animation when rate changes
	useEffect(() => {
		if (prevRate !== null && prevRate !== successRate) {
			setIsAnimating(true);
			const timer = setTimeout(() => {
				setIsAnimating(false);
			}, 1500);
			return () => clearTimeout(timer);
		}
		setPrevRate(successRate);
	}, [successRate, prevRate]);
	
	// Chart data
	const chartData = {
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		datasets: [
			{
				label: 'Success Rate',
				data: historyData,
				fill: true,
				backgroundColor: `rgba(0, 117, 255, 0.2)`,
				borderColor: info.main,
				tension: 0.4,
				pointRadius: 2,
				pointBackgroundColor: info.main,
				pointBorderColor: 'transparent',
				borderWidth: 2,
			},
		],
	};
	
	// Chart options
	const chartOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				display: false,
			},
			tooltip: {
				backgroundColor: 'rgba(0, 0, 0, 0.7)',
				padding: 10,
				usePointStyle: true,
				callbacks: {
					label: function(context) {
						return `Success Rate: ${context.raw}%`;
					}
				}
			}
		},
		scales: {
			y: {
				min: Math.max(0, Math.min(...historyData) - 10),
				max: Math.min(100, Math.max(...historyData) + 10),
				grid: {
					display: true,
					color: 'rgba(255, 255, 255, 0.1)',
				},
				ticks: {
					color: 'rgba(255, 255, 255, 0.7)',
					font: {
						size: 10,
					},
					callback: function(value) {
						return value + '%';
					}
				}
			},
			x: {
				grid: {
					display: false,
				},
				ticks: {
					color: 'rgba(255, 255, 255, 0.7)',
					font: {
						size: 10,
					}
				}
			}
		}
	};

	// Determine color based on success rate
	const getColorByRate = (rate) => {
		if (rate >= 80) return success.main;
		if (rate >= 60) return warning.main;
		return error.main;
	};

	const rateColor = getColorByRate(successRate);
	
	// Get status text based on success rate
	const getStatusText = (rate) => {
		if (rate >= 80) return '🟢 Optimal AI Performance';
		if (rate >= 60) return '🟡 Needs Minor Optimization';
		return '🔴 AI Underperforming, Needs Fixes';
	};

	return (
		<Card 
			sx={{ 
				width: '100%',
				transition: 'all 0.3s ease',
				'&:hover': {
					boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
				}
			}}
		>
			{loading ? (
				// Loading skeleton
				<VuiBox p={3}>
					<Grid container spacing={3} alignItems="center">
						<Grid item xs={12} md={8}>
							<VuiBox display='flex' alignItems='center'>
								<Skeleton variant="circular" width={80} height={80} sx={{ bgcolor: 'rgba(255,255,255,0.1)', mr: 3 }} />
								<VuiBox>
									<Skeleton variant="text" width={180} height={30} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
									<Skeleton variant="text" width={250} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
								</VuiBox>
							</VuiBox>
						</Grid>
						<Grid item xs={12} md={4}>
							<VuiBox display="flex" flexDirection="column" alignItems={{ xs: "flex-start", md: "flex-end" }}>
								<Skeleton variant="text" width={200} height={24} sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 1 }} />
								<Skeleton variant="rectangular" width={120} height={36} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
							</VuiBox>
						</Grid>
						<Grid item xs={12}>
							<Skeleton variant="rectangular" width="100%" height={200} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }} />
						</Grid>
					</Grid>
				</VuiBox>
			) : (
				<VuiBox p={isMobile ? 2 : 3}>
					<Grid container spacing={isMobile ? 2 : 3} alignItems="center">
						<Grid item xs={12} md={8}>
							<VuiBox display='flex' flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'center' : 'flex-start'}>
								<VuiBox
									sx={{
										position: 'relative',
										display: 'inline-flex',
										mr: isMobile ? 0 : 3,
										mb: isMobile ? 2 : 0
									}}>
									<CircularProgress
										variant='determinate'
										value={successRate}
										size={isMobile ? 70 : 80}
										sx={{
											color: rateColor,
											transition: 'all 0.5s ease',
											transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
											'& .MuiCircularProgress-circle': {
												strokeWidth: 4,
												strokeLinecap: 'round',
												transition: 'stroke-dashoffset 0.5s ease'
											}
										}}
									/>
									<VuiBox
										sx={{
											top: 0,
											left: 0,
											bottom: 0,
											right: 0,
											position: 'absolute',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center'
										}}>
										<VuiBox
											sx={{
												background: rateColor,
												width: isMobile ? '28px' : '32px',
												height: isMobile ? '28px' : '32px',
												borderRadius: '50%',
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
												transition: 'all 0.3s ease',
												transform: isAnimating ? 'scale(1.2) rotate(360deg)' : 'scale(1) rotate(0deg)'
											}}>
											<IoRocket size={isMobile ? '14px' : '16px'} color='#fff' />
										</VuiBox>
									</VuiBox>
								</VuiBox>

								<VuiBox textAlign={isMobile ? 'center' : 'left'}>
									<VuiTypography variant={isMobile ? 'button' : 'lg'} color='white' fontWeight='bold'>
										Agent Success Rate
										<Tooltip title="Percentage of successful AI agent interactions with customers" placement="top">
											<span style={{ marginLeft: '5px', cursor: 'help', display: 'inline-flex', verticalAlign: 'middle' }}>
												<IoInformation size="16px" color="rgba(255,255,255,0.5)" />
											</span>
										</Tooltip>
									</VuiTypography>
									<VuiBox display='flex' alignItems='center' justifyContent={isMobile ? 'center' : 'flex-start'}>
										<VuiTypography 
											variant={isMobile ? 'h4' : 'h3'} 
											color='white' 
											fontWeight='bold' 
											mr={1}
											sx={{
												transition: 'color 0.5s ease',
												color: isAnimating ? info.main : 'white'
											}}
										>
											{successRate}%
										</VuiTypography>
										<VuiBox display="flex" alignItems="center">
											<VuiTypography
												variant='button'
												color={change >= 0 ? 'success' : 'error'}
												fontWeight='bold'
												mr={0.5}
												sx={{
													display: 'flex',
													alignItems: 'center',
													gap: '4px'
												}}
											>
												{change >= 0 ? (
													<IoTrendingUp size="16px" />
												) : (
													<IoTrendingDown size="16px" />
												)}
												{change >= 0 ? '+' : ''}{change}%
											</VuiTypography>
											<VuiTypography variant='button' color='text' fontWeight='regular'>
												from previous
											</VuiTypography>
										</VuiBox>
									</VuiBox>
								</VuiBox>
							</VuiBox>
						</Grid>
						<Grid item xs={12} md={4}>
							<VuiBox display="flex" flexDirection="column" alignItems={{ xs: "center", md: "flex-end" }}>
								<VuiTypography 
									variant='caption' 
									color={successRate >= 80 ? 'success' : successRate >= 60 ? 'warning' : 'error'} 
									fontWeight='medium'
									mb={1}
								>
									{getStatusText(successRate)}
								</VuiTypography>
								<VuiButton 
									variant='contained' 
									color='info' 
									size="small"
									sx={{
										transition: 'all 0.3s ease',
										'&:hover': {
											transform: 'translateY(-2px)',
											boxShadow: '0 5px 15px rgba(0, 117, 255, 0.4)'
										}
									}}
								>
									View Insights
								</VuiButton>
							</VuiBox>
						</Grid>
						
						{/* Historical data chart */}
						<Grid item xs={12} sx={{ mt: isMobile ? 1 : 2 }}>
							<VuiBox
								sx={{
									height: isMobile ? '150px' : '200px',
									transition: 'all 0.3s ease',
									opacity: isAnimating ? 0.7 : 1
								}}
							>
								<Line data={chartData} options={chartOptions} />
							</VuiBox>
						</Grid>
					</Grid>
				</VuiBox>
			)}
		</Card>
	);
};

export default AgentSuccessRate;
