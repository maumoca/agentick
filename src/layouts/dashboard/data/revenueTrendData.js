/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

export const revenueTrendData = [
  {
    name: "AI-Generated Revenue",
    data: [15000, 21000, 28000, 32000, 38000, 42000, 48000, 53000, 61000, 68000, 74000, 82000],
  },
  {
    name: "Manual Revenue",
    data: [12000, 14000, 16000, 15000, 18000, 19000, 17000, 20000, 22000, 21000, 23000, 25000],
  },
];

export const revenueTrendOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    type: "bar",
    stacked: true,
  },
  tooltip: {
    style: {
      fontSize: "10px",
      fontFamily: "Plus Jakarta Display",
    },
    theme: "dark",
    y: {
      formatter: function (val) {
        return "$" + val.toLocaleString();
      }
    }
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    labels: {
      style: {
        colors: "#c8cfca",
        fontSize: "10px",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    labels: {
      style: {
        colors: "#c8cfca",
        fontSize: "10px",
      },
      formatter: function (val) {
        return "$" + val.toLocaleString();
      }
    },
  },
  legend: {
    show: true,
    position: "top",
    horizontalAlign: "right",
    labels: {
      colors: "#fff",
    },
  },
  grid: {
    borderColor: "#56577A",
    strokeDashArray: 5,
    yaxis: {
      lines: {
        show: true,
      },
    },
    xaxis: {
      lines: {
        show: false,
      },
    },
  },
  fill: {
    opacity: 1,
  },
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      borderRadius: 5,
      columnWidth: "30%",
    },
  },
  colors: ["#0075FF", "#2CD9FF"],
};
