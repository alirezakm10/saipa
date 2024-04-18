// this menu contains one or multiple icon button
import { useState, ReactNode } from "react";
import { Tooltip, IconButton, useTheme } from "@mui/material";
import {
  Box,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Typography,
  Menu,
  Stack,
} from "@mui/material";
import Link from "next/link";
import { tokens } from "@/theme";

interface Props {
  icon: ReactNode;
  tooltipText: string;
  tooltipIcon?: ReactNode;
  subItems: {
    icon: ReactNode;
    tooltip: string;
    handler?: () => void;
    navigate: string;
    linkTargetBlank?:boolean;
  }[];
}

const WidgetsMenu: React.FC<Props> = ({
  icon,
  tooltipText,
  tooltipIcon,
  subItems,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
      <Tooltip
        title={
          <Stack direction="row" spacing={2} alignItems="center">
            <span>{tooltipText}</span>
            {tooltipIcon}
          </Stack>
        }
      >
        <IconButton
          onClick={handleClick}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{bgcolor:colors.themeAccent[500]}}
        >
          {icon}
        </IconButton>
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
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            width: "fit-content",
            p: 2,
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              // bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {subItems?.map((subItem, idx) => (
          <span key={idx} >
           { subItem.navigate ?
            <Tooltip title={subItem.tooltip}>
              <Link href={subItem.navigate} target={subItem.linkTargetBlank ? '_blank' : '_self'} >
              <IconButton
                sx={{ mx: 1, filter: "drop-shadow(20px 10px 10px 10px white)", bgcolor:colors.themeAccent[500] }}
              >
                {subItem.icon}
              </IconButton>
              </Link>
            </Tooltip>
            :
            <Tooltip title={subItem.tooltip}>
              <IconButton
                sx={{ mx: 1, filter: "drop-shadow(20px 10px 10px 10px white)",
                bgcolor:colors.themeAccent[500]
              }}
                onClick={subItem.handler}
              >
                {subItem.icon}
              </IconButton>
            </Tooltip>}
          </span>
        ))}
      </Menu>
    </Box>
  );
};

export default WidgetsMenu;
