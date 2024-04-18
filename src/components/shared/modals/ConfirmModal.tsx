import * as React from "react";
import { Box, Button, Typography, Modal, Stack, Paper } from "@mui/material";
import { LoadingButton } from "@mui/lab";


const style = {
  position: "absolute" as "absolute",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  p: 4,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  borderRadious: "10px",
};

interface Props {
  modalTitle?: string;
  btnTitle?: string;
  icon?: React.ReactNode;
  justIcon?: React.ReactNode;
  description?: string;
  variant?:'text' | 'outlined' | 'contained';
  setter?: () => void;
  color?: 'primary' | 'error' | 'warning' | 'success';
  type?: 'submit' | 'button',
  ctaLoader: boolean;
  btnStyle?: any;
  disabled?:boolean;
}

const ConfirmModal: React.FC<Props> = ({
  modalTitle,
  btnTitle,
  icon,
  description,
  setter,
  color,
  ctaLoader,
  btnStyle,
  justIcon,
  variant = 'outlined' ,
  type = 'button',
  disabled,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button 
      variant={variant} 
      style={btnStyle} 
      color={color} 
      startIcon={icon} 
      sx={{ bgcolor: color }} 
      onClick={handleOpen} 
      disabled={!!disabled}
      {...props}
      >
        {btnTitle && btnTitle}
        {!btnTitle && justIcon}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style}>
          <Typography variant="h3" component="h2">
            {modalTitle}
          </Typography>
          <Typography variant="h5" textAlign='center' component="p" sx={{ mt: 2 }}>
            {description}
          </Typography>
          <Stack direction="row" sx={{display:'flex', justifyContent:'center', gap:2}}>
            <LoadingButton
              size="small"
              color={color}
              disabled={ctaLoader}
              loading={ctaLoader}
              loadingPosition="center"
              // startIcon={<SaveIcon />}
              variant="contained"
              type={type}
              onClick={setter}
            >
              بله
            </LoadingButton>
            <Button variant="outlined" color="primary" onClick={handleClose}>
              خیر
            </Button>
          </Stack>
        </Paper>
      </Modal>
    </>
  );
};

export default ConfirmModal;
