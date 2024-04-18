"use client";
import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Paper,
  Stack,
  Typography,
  useTheme,
  Divider,
  CircularProgress,
  TableContainer,
  Table,
  TableRow,
  TableCell,
} from "@mui/material";
import { ModalVariants } from "@/components/shared/modals/ModalVariants";
import { tokens } from "@/theme";
import CloseIcon from "@mui/icons-material/Close";
import { useGetOrderQuery } from "@/redux/services/shop/ordersApi";
import { styled } from "@mui/material/styles";
import TimeLoader from "@/components/shared/loaders/TimeLoader";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import EditRoadOutlinedIcon from "@mui/icons-material/EditRoadOutlined";
import ReturnForm from "./ReturnForm";

interface IDefaultModal {
  open: boolean;
  setter: () => void;
  returnedProduct: any;
}

const ReturnModal: React.FC<IDefaultModal> = ({ open, setter, returnedProduct }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  return (
    <AnimatePresence>
      {open && (
        <Box
          position="fixed"
          zIndex={33}
          width="100vw"
          bgcolor="green"
          height="100%"
          left={0}
          right={0}
          top={0}
          bottom={0}
          sx={{
            background: "rgba(0, 0, 0, 0.8)",
            backdropFilter: "saturate(180%) blur(10px)",
          }}
        >
          <motion.div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            initial={ModalVariants.initial}
            exit={ModalVariants.hidden}
            variants={ModalVariants}
            animate={open ? "visible" : "hidden"}
          >
            <Paper
              sx={{
                position: "absolute",
                overflowY: "auto",
                borderRadius: "10px",
                zIndex: 3,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: { xs: "100%", md: "50%" },
                height: "70%",
                p: 1,
                mx: "auto",
                my: "auto",
              }}
            >
              <CloseIcon sx={{ cursor: "pointer" }} onClick={setter} />
                           <ReturnForm returnedProduct={returnedProduct} />
            </Paper>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default ReturnModal;
