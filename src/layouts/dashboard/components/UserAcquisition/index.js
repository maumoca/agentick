import React from 'react';
import { Card } from '@mui/material';
import VuiBox from 'components/VuiBox';
import VuiTypography from 'components/VuiTypography';
import { IoGlobe } from 'react-icons/io5';
import colors from 'assets/theme/base/colors';
import ReactApexChart from 'react-apexcharts';

const UserAcquisition = () => {
  const { info, gradients } = colors;
  const { cardContent } = gradients;

  // Static data for the pie chart
  const series = [35, 25, 22, 15, 3];
  const options = {
    chart: {
      type: "pie",
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: function (val) {
          return val + "%";
        },
      },
    },
    labels: ["Paid Ads", "Organic Search", "Social Media", "Referrals", "Direct"],
    colors: ["#0075FF", "#2CD9FF", "#582CFF", "#FF2CF0", "#FF912C"],
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
      labels: {
        colors: "#fff",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    fill: {
      type: "solid",
      opacity: 1,
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
            },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 500,
              color: "#fff",
              formatter: function (val) {
                return val + "%";
              },
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "16px",
              fontWeight: 500,
              color: "#fff",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0) + "%";
              },
            },
          },
        },
      },
    },
  };

  return (
    <Card>
      <VuiBox p={3}>
        <VuiBox display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <VuiTypography variant="lg" color="white" fontWeight="bold">
            User Acquisition Breakdown
          </VuiTypography>
          <VuiBox display="flex" alignItems="center">
            <VuiBox
              bgColor={info.main}
              color="white"
              width="24px"
              height="24px"
              borderRadius="12px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              mr={1}
            >
              <IoGlobe color="white" size="14px" />
            </VuiBox>
            <VuiTypography variant="button" color="text" fontWeight="medium">
              Lead Sources
            </VuiTypography>
          </VuiBox>
        </VuiBox>
        <VuiBox display="flex" alignItems="center" mb={2}>
          <VuiTypography variant="button" color="success" fontWeight="bold">
            35%{" "}
            <VuiTypography variant="button" color="text" fontWeight="regular">
              from Paid Ads - highest source
            </VuiTypography>
          </VuiTypography>
        </VuiBox>
        <VuiBox sx={{ height: '300px' }}>
          <ReactApexChart
            options={options}
            series={series}
            type="pie"
            width="100%"
            height="100%"
          />
        </VuiBox>
      </VuiBox>
    </Card>
  );
};

export default UserAcquisition;
