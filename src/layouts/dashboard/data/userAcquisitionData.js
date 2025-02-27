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

export const userAcquisitionData = [
  {
    name: "Paid Ads",
    data: [35],
  },
  {
    name: "Organic Search",
    data: [25],
  },
  {
    name: "Social Media",
    data: [22],
  },
  {
    name: "Referrals",
    data: [15],
  },
  {
    name: "Direct",
    data: [3],
  },
];

export const userAcquisitionOptions = {
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
