import React from "react";
import IconButton from "@material-ui/core/IconButton";
import { Menu, MenuItem, Typography } from "@material-ui/core";
import { AccountCircle } from "@material-ui/icons";
import { useAuth } from "../../shared/contexts/auth";
import { useLocalize } from "../../shared/contexts/localize";
import authService from "../../services/AuthorizeService";
import { ApplicationPaths } from "../../shared/configs";

export default function UserProfile() {
  const { strings } = useLocalize();
  const { isAuthenticated, user } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isProfileMenuOpen = Boolean(anchorEl);

  const handleProfileMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await authService.signOut({returnUrl: ApplicationPaths.Login});
  };

  return (
    <React.Fragment>
      {isAuthenticated && (
        <div>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenu}
            color="inherit"
          >
            <Typography align="left" variant="caption">
              {user?.email}
            </Typography>

            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={isProfileMenuOpen}
            onClose={handleProfileClose}
          >
            <MenuItem onClick={handleLogout}>
              {strings.account.signout}
            </MenuItem>
          </Menu>
        </div>
      )}
    </React.Fragment>
  );
}
