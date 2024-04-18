"use client";
import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Paper, useTheme } from "@mui/material";
import { ModalVariants } from "./ModalVariants";
import { tokens } from "@/theme";
import CloseIcon from "@mui/icons-material/Close";

interface IDefaultModal {
  open: boolean;
  setter: () => void;
  children?: ReactNode;
}

const DefaultModal: React.FC<IDefaultModal> = ({ open, setter, children }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <AnimatePresence>
      {open && (
        <Box
          position="fixed"
          zIndex={3}
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
            style={{ display: "flex", justifyContent:'center', alignItems:'center' }}
            initial={ModalVariants.initial}
            exit={ModalVariants.hidden}
            variants={ModalVariants}
            animate={open ? "visible" : "hidden"}
          >
            <Paper
              sx={{
                position: "absolute",
                overflowY:'auto',
                borderRadius:'10px',
                zIndex: 3,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: {xs:'100%',md:'70%'},
                height: "70%",
                p:1,
                mx:'auto',
                my:'auto'
              }}
            >
              <CloseIcon sx={{ cursor: "pointer" }} onClick={setter} />
              {children}
            </Paper>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default DefaultModal;
