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
} from "@mui/material";
import { ModalVariants } from "@/components/shared/modals/ModalVariants";
import { tokens } from "@/theme";
import CloseIcon from "@mui/icons-material/Close";
import { useGetOrderQuery } from "@/redux/services/shop/ordersApi";
import { styled } from "@mui/material/styles";
import InvoiceAccordion from "./InvoiceAccordion";
import TimeLoader from "@/components/shared/loaders/TimeLoader";

interface IDefaultModal {
  id: number;
  open: boolean;
  setter: () => void;
}

const InvoiceModal: React.FC<IDefaultModal> = ({ id, open, setter }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    data: order,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error,
  } = useGetOrderQuery(id, {
    refetchOnMountOrArgChange: true,
  });

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
              {isFetching ? (
                <Box
                  display="flex"
                  justifyContent="center"
                  height="100%"
                  alignItems="center"
                >
                  <CircularProgress />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Typography component="h1" variant="h4" sx={{ mx: "auto" }}>
                    فاکتور فروش
                  </Typography>
                  <InvoiceAccordion
                    invoice={order}
                    productList={order?.order_products}
                    orderTransition={{ ...order?.address, ...order?.post }}
                  />
                </Box>
              )}
            </Paper>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default InvoiceModal;
