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
  Grid,
} from "@mui/material";
import { ModalVariants } from "@/components/shared/modals/ModalVariants";
import { tokens } from "@/theme";
import CloseIcon from "@mui/icons-material/Close";
import { useGetUserPurchasesQuery } from "@/redux/services/shop/ordersApi";
import { styled } from "@mui/material/styles";
import InvoiceAccordion from "./InvoiceAccordion";
import TimeLoader from "@/components/shared/loaders/TimeLoader";
import PurchasesAccordion from "./PurchasesAccordion";

interface IUserPurchasesModal {
  id: number;
  open: boolean;
  setter: () => void;
}

const UserPurchasesModal: React.FC<IUserPurchasesModal> = ({ id, open, setter }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const {
    data: orders,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error,
  } = useGetUserPurchasesQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if(isSuccess){
      console.log('user purchases fetched: ', orders.data)
    }
  },[open])

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
                    لیست تمام خرید های کاربر 
                  </Typography>
                  <Grid container spacing={2} >
                    {
                      orders?.data?.length > 0 ? orders?.data?.map((orderDetails:any,idx:number) => (
                        <Grid key={idx} item xs={12} >
                          <Box
                          sx={{
                            p:2,
                            border:`1px solid ${colors.primary[300]}`,
                            borderRadius:'10px'
                          }} 
                          >
                            <Typography component='h1' variant="body2" >شناسه سفارش: {orderDetails?.id}</Typography>
                            <PurchasesAccordion
                                                  order={orders}
                                                  productList={orders?.data?.order_products}
                                                  orderTransition={{ ...orders?.address, ...orders?.post }}
                                                />
                          </Box>
                        </Grid>
                      ))
                      :
                      <>
                      <p>محصولی یافت نشد</p>
                      </>
                    }
                  </Grid>
               
                </Box>
              )}
            </Paper>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default UserPurchasesModal;
