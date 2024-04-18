import * as React from 'react';
import { Menu, MenuItem, Button, Chip, Typography,SxProps } from '@mui/material';

interface ParentMenuProps {
    children?: React.ReactNode;
    buttonTitle?: string;
    buttonIcon?:React.ReactNode;
    variant?:'contained' | 'outlined' | 'text';
    array1?:string[] | undefined;
    sx?:SxProps;
    justIcon?:React.ReactNode;
    color?: 'success' | 'warning' | 'error';
    isFetching ? : boolean;
}

const ParentMenu:React.FC<ParentMenuProps> = ({children,buttonTitle, variant = 'outlined' , array1, buttonIcon, color, justIcon,isFetching, ...sx}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  React.useEffect(() => {
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
       <Button
       variant={variant}
       color={color}
        onClick={handleClick}
        endIcon={buttonIcon ? buttonIcon : false}
        {...sx}
      >
        {buttonTitle}
        {!buttonTitle && justIcon}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
 {children}
      </Menu>
    </>
  );
}


export default ParentMenu