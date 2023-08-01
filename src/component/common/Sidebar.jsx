import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

const SidebarComponent = () => {
  const navigate = useNavigate();
  const [collapsed, handleCollapsedChange] = useState(false);

  useEffect(() => {
    const handleWindowResize = () => {
      window.innerWidth < 1024
        ? handleCollapsedChange(true)
        : handleCollapsedChange(false);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });
  return (
    <div className="h-[100vh] overflow-y-scroll border-r">
      <Sidebar collapsed={collapsed}>
        <Menu
          iconShape="circle"
          menuItemStyles={{
            button: () => {
              // if (level === 0 || level === 1) {
              return {
                color: "white",
                backgroundColor: "#0F76BC",
                "&:hover": {
                  backgroundColor: "#0F76BC !important",
                  color: "white !important",
                  fontWeight: "bold !important",
                },
              };
              // }
            },
          }}
        >
          {collapsed ? (
            <MenuItem
              icon={<KeyboardDoubleArrowRightIcon />}
              onClick={() => handleCollapsedChange(!collapsed)}
            ></MenuItem>
          ) : (
            <MenuItem
              suffix={<KeyboardDoubleArrowLeftIcon />}
              onClick={() => handleCollapsedChange(!collapsed)}
            >
              <div className="flex justify-center py-3">
                <span
                  onClick={() => {
                    navigate("/");
                  }}
                  className="text-center"
                >
                  <img
                    src="https://megasun.bestoerp.com/files/IMG-20230702-WA0007.jpg"
                    alt="Logo"
                    className="w-[100px] max-h-[40px]"
                  />
                </span>
              </div>
            </MenuItem>
          )}
        </Menu>
        <Menu
          menuItemStyles={{
            button: ({ level, active }) => {
              // if (level === 0 || level === 1) {
              return {
                color: active && level === 0 ? "white" : "#0F76BC",
                backgroundColor: "#fff",
                height: 35,
                // width: 250,
                "&:hover": {
                  backgroundColor: "#0F76BC !important",
                  color: "white !important",
                  fontWeight: "bold !important",
                },
                "&:focus": {
                  backgroundColor: "#fff !important",
                  color: "#0F76BC !important",
                  fontWeight: "bold !important",
                },
              };
              // }
            },
          }}
        >
          {/* <MenuItem
            component={<Link to="/" />}
            icon={<DashboardIcon fontSize="small" />}
          >
            Dashboard
          </MenuItem> */}
          <SubMenu
            icon={<DashboardIcon fontSize="small" />}
            label="Quick Sale"
            defaultOpen={true}
          >
            <MenuItem
              component={<Link to="/customer" />}
              icon={<DashboardIcon fontSize="small" />}
            >
              Customer
            </MenuItem>
            <MenuItem
              component={<Link to="/tanning-appointment" />}
              icon={<DashboardIcon fontSize="small" />}
            >
              Tanning Appointment
            </MenuItem>
            {/* <MenuItem
              component={<Link to="tanning-type" />}
              icon={<DashboardIcon fontSize="small" />}
            >
              Tanning Type
            </MenuItem> */}
            <MenuItem
              component={<Link to="tanning-plan" />}
              icon={<DashboardIcon fontSize="small" />}
            >
              Tanning Plan
            </MenuItem>
            {/* <MenuItem
              component={<Link to="tanning-plan-template" />}
              icon={<DashboardIcon fontSize="small" />}
            >
              Tanning Plan Template
            </MenuItem> */}
            <MenuItem
              component={<Link to="tanning-session" />}
              icon={<DashboardIcon fontSize="small" />}
            >
              Tanning Session
            </MenuItem>
            <MenuItem
              component={<Link to="/sales-invoice" />}
              icon={<DashboardIcon fontSize="small" />}
            >
              Sales Invoice
            </MenuItem>
          </SubMenu>
          {/* <SubMenu icon={<DashboardIcon fontSize="small" />} label="Master">
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Customer
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Product
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Machine
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Department
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Package
            </MenuItem>
          </SubMenu>
          <SubMenu
            icon={<DashboardIcon fontSize="small" />}
            label="Transaction"
          >
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Appointment
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Tanning
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Tanning Session
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Sales Invoice
            </MenuItem>
          </SubMenu>
          <SubMenu icon={<DashboardIcon fontSize="small" />} label="Reports">
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Appointment
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Tanning
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Tanning Session
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Sales Invoice
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Customer
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Product
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Machine
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Department
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Package
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Sales Report
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Sales Summary
            </MenuItem>
            <MenuItem icon={<DashboardIcon fontSize="small" />}>
              Appointment Between Date
            </MenuItem>
          </SubMenu> */}
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SidebarComponent;
