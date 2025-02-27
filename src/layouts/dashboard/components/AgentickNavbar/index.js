import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import Tooltip from "@mui/material/Tooltip";
import { IoNotifications, IoClose } from "react-icons/io5";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";
import {
  useVisionUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

// Edit context
import { useEdit } from "context/EditContext";

// Custom components
import DateRangePicker from "layouts/dashboard/components/DateRangePicker";
import RefreshButton from "layouts/dashboard/components/RefreshButton";
import EditPanel from "components/EditPanel";

function AgentickNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator } = controller;
  const { editMode, toggleEditMode } = useEdit();
  const route = useLocation().pathname.split("/").slice(1);

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  // No need for menu handlers as we're using the bell icon for edit mode

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <VuiBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <VuiTypography
            variant="h4"
            fontWeight="bold"
            color={light ? "white" : "dark"}
            mr={2}
          >
            Agentick
          </VuiTypography>
        </VuiBox>
        {isMini ? null : (
          <VuiBox sx={(theme) => navbarRow(theme, { isMini })}>
            <VuiBox display="flex" alignItems="center" mr={1}>
              <DateRangePicker />
            </VuiBox>
            <VuiBox color={light ? "white" : "inherit"}>
              <RefreshButton />
              <IconButton
                size="small"
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon className={"text-white"}>{miniSidenav ? "menu_open" : "menu"}</Icon>
              </IconButton>
              <IconButton
                size="small"
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon>settings</Icon>
              </IconButton>
              <Tooltip title={editMode ? "Close Edit Mode" : "Edit Dashboard"}>
                <IconButton
                  size="small"
                  color="inherit"
                  sx={{
                    ...navbarIconButton,
                    backgroundColor: editMode ? "rgba(0, 117, 255, 0.2)" : "transparent",
                    "&:hover": {
                      backgroundColor: editMode ? "rgba(0, 117, 255, 0.3)" : "rgba(255, 255, 255, 0.1)",
                    },
                  }}
                  aria-controls="edit-mode"
                  aria-haspopup="true"
                  variant="contained"
                  onClick={toggleEditMode}
                >
                  {editMode ? (
                    <IoClose size="22px" color="white" />
                  ) : (
                    <IoNotifications size="22px" color="white" />
                  )}
                </IconButton>
              </Tooltip>
              <EditPanel />
            </VuiBox>
          </VuiBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of AgentickNavbar
AgentickNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the AgentickNavbar
AgentickNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default AgentickNavbar;
