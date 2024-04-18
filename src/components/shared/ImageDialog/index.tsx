import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import React from "react";

interface Props {
  children: React.ReactNode;
  open: boolean;
  isLoading: boolean;
  setOpen: (value: boolean) => void;
  onConfirm: () => void;
}

const ImageDialog: React.FC<Props> = ({
  open,
  setOpen,
  children,
  isLoading,
  onConfirm,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      fullWidth={true}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>انصراف</Button>

        <Button onClick={onConfirm} disabled={isLoading}>
          {isLoading ? <CircularProgress size={20} /> : "تایید"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageDialog;
