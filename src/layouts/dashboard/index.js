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

// @mui material components
import Grid from "@mui/material/Grid";
import { Card } from "@mui/material";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";

// Vision UI Dashboard React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import colors from "assets/theme/base/colors";

// Agentick Dashboard components
import AgentickNavbar from "layouts/dashboard/components/AgentickNavbar";
import AgentSuccessRate from "layouts/dashboard/components/AgentSuccessRate";
import KPICard from "layouts/dashboard/components/KPICard";
import LeadPerformance from "layouts/dashboard/components/LeadPerformance";
import RevenueTrend from "layouts/dashboard/components/RevenueTrend";

// Context providers
import { ClientProvider } from "context/ClientContext";
import { EditProvider } from "context/EditContext";

// React icons
import { IoIosRocket } from "react-icons/io";
import { IoGlobe } from "react-icons/io5";
import { IoTime } from "react-icons/io5";
import { IoWallet } from "react-icons/io5";
import { IoRepeat } from "react-icons/io5";

function Dashboard() {
  return (
    <ClientProvider>
      <EditProvider>
        <DashboardLayout>
          <AgentickNavbar />
          <VuiBox py={3}>
            {/* Agent Success Rate - Full-Width KPI Card */}
            <VuiBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <AgentSuccessRate />
                </Grid>
              </Grid>
            </VuiBox>

            {/* KPI Summary Cards - 2x2 Grid */}
            <VuiBox mb={3}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} sm={6} md={6} xl={3}>
                  <KPICard
                    title={{ text: "Revenue Impact", fontWeight: "regular" }}
                    count="$82,000"
                    percentage={{ text: "+15%" }}
                    icon={{ component: <IoWallet size="22px" color="white" /> }}
                    metricKey="revenue"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={3}>
                  <KPICard
                    title={{ text: "AI-Booked Calls" }}
                    count="187"
                    percentage={{ text: "+23%" }}
                    icon={{ component: <IoGlobe size="22px" color="white" /> }}
                    metricKey="callsBooked"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={3}>
                  <KPICard
                    title={{ text: "Hours Saved" }}
                    count="342"
                    percentage={{ text: "+18%" }}
                    icon={{ component: <IoTime size="22px" color="white" /> }}
                    metricKey="hoursSaved"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={6} xl={3}>
                  <KPICard
                    title={{ text: "Retention Rate" }}
                    count="78%"
                    percentage={{ text: "-2%" }}
                    icon={{ component: <IoRepeat size="22px" color="white" /> }}
                    metricKey="retentionRate"
                  />
                </Grid>
              </Grid>
            </VuiBox>

            {/* Data Visualization Charts */}
            <VuiBox mb={3}>
              <Grid container spacing={{ xs: 2, md: 3 }}>
                <Grid item xs={12} lg={6}>
                  <LeadPerformance />
                </Grid>
                <Grid item xs={12} lg={6}>
                  <RevenueTrend />
                </Grid>
              </Grid>
            </VuiBox>
          </VuiBox>
          <Footer />
        </DashboardLayout>
      </EditProvider>
    </ClientProvider>
  );
}

export default Dashboard;
