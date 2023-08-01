import { Button, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Print from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";

const Titlebar = ({
  text,
  handleClick,
  buttonText,
  disabled,
  secondaryButton,
  showGoBack,
  showRefresh,
  showActionButton,
  showPrint,
  handlePrint,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const ITEM_HEIGHT = 48;

  return (
    <>
      <div className="flex items-center justify-between mb-4 !bg-white my-6 py-4 px-3 rounded-lg">
        <h2 className="text-2xl text-primary ">{text}</h2>
        <div className="flex items-center gap-2">
          {secondaryButton && <div>{secondaryButton}</div>}
          <Button
            className={`${disabled ? "!bg-gray-400 " : "!bg-primary"}`}
            onClick={() => {
              handleClick();
            }}
            disabled={disabled}
          >
            <Typography className="!text-white">{buttonText}</Typography>
          </Button>
          {showActionButton && (
            <>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClickMenu}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="long-menu"
                MenuListProps={{
                  "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                  style: {
                    maxHeight: ITEM_HEIGHT * 4.5,
                    width: "20ch",
                  },
                }}
              >
                {showRefresh && (
                  <MenuItem onClick={() => location.reload()}>
                    <div className="flex gap-3">
                      <RefreshIcon /> Refresh
                    </div>
                  </MenuItem>
                )}
                {showGoBack && (
                  <MenuItem onClick={() => navigate(-1)}>
                    <div className="flex gap-3">
                      <KeyboardBackspaceIcon /> Go Back
                    </div>
                  </MenuItem>
                )}
                {showPrint && (
                  <MenuItem onClick={handlePrint}>
                    <div className="flex gap-3">
                      <Print /> Print
                    </div>
                  </MenuItem>
                )}
                {/* <MenuItem onClick={handleClose}>{"option"}</MenuItem> */}
              </Menu>
            </>
          )}
        </div>
      </div>
      <hr className="my-4" />
    </>
  );
};

export default Titlebar;
