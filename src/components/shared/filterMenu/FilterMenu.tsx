import Priority from "@/components/adminpanel/tickets/Priority";
import { tokens } from "@/theme";
import {
  Box,
  Button,
  Menu,
  useTheme,
} from "@mui/material";
import React, { useEffect } from "react";

type Option = {
  title: string;
  checked: boolean;
  name: string;
};

interface Props {
  icon: JSX.Element;
  title ? : string;
  children: React.ReactNode;
  isFetching?: boolean;
  // options: Option[];
  // setFilterOptions: any;
  // setSelectedFilter: any;
}
const FilterMenu: React.FC<Props> = ({
  icon,
  title,
  children,
  isFetching
  // options,
  // setFilterOptions,
  // setSelectedFilter,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    setAnchorEl(null); 
  }, [isFetching]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button sx={{mx:1}} variant="outlined" startIcon={icon} onClick={handleClick}>
        {title}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
          style: {
            minWidth: 250,
            maxHeight: 300,
            border: `1px solid ${colors.primary[300]} `,
            borderRadius: "7px",
            overflow: "auto",
            padding: "15px",
          },
        }}
      >
        {children}
      </Menu>
    </>
  );
};

export default FilterMenu;
