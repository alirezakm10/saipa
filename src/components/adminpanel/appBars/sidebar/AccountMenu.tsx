'use client'
import { useState, MouseEvent} from "react";
import {Box , useTheme, Avatar, Menu, MenuItem, ListItemIcon, Divider, Typography, Tooltip} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import UserProfile from "@/components/adminpanel/userProfile/UserAvatar";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { selectSidebarCollapsed } from "@/redux/features/sidebarSlice";
import { setShowSignout } from "@/redux/features/componentSlice";
import { tokens } from "@/theme";
import Link from "next/link";
import { useSession } from "next-auth/react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


export default function AccountMenu() {
  const {data: session} = useSession()
  const dispatch = useAppDispatch()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl);
  const sidebarCollapsed = useAppSelector(selectSidebarCollapsed)
  const theme = useTheme()
  const themeMode = theme.palette.mode

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const handleSignOut = () => {
    handleClose();
   dispatch(setShowSignout())
  }


  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center", mb:2 }}>
        <Tooltip title="Account settings">
          <Box
            onClick={handleClick}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              mx:1,
              cursor:'pointer'
            }}
          >
            {sidebarCollapsed ? (
              <UserProfile width={100} height={100} />
            ) : (
              <UserProfile width={51} height={51}  />
            )}
            {sidebarCollapsed && (
              <Typography variant="h4" component="h1" sx={{color:themeMode === 'light' ? 'white' : 'inherit' }}>
                {session?.user.name}
              </Typography>
            )}
          </Box>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                left: 14,
                width: 10,
                height: 10,
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
           </ListItemIcon>
            <Link href="/adminpanel/users/userprofile" >مشاهده پروفایل</Link>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
              <Link href="" >تنظیمات</Link>
          </MenuItem>
          <MenuItem onClick={handleSignOut}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            خروج
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
}
