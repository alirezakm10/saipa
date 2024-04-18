"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Paper,
  useTheme,
  IconButton,
} from "@mui/material";
import { ModalVariants } from "@/components/shared/modals/ModalVariants";
import { tokens } from "@/theme";
import CloseIcon from "@mui/icons-material/Close";
import Menus from "./classification/menus/Menus";

interface IDefaultModal {
  open: boolean;
  returnedMenu:any;
  setter: () => void;
}

const MenuModal: React.FC<IDefaultModal> = ({ open, setter, returnedMenu }) => {
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
                width: '100%',
                height: "90%",
                p: 1,
                mx: "auto",
                my: "auto",
              }}
            >
                <IconButton
                sx={{ position:'sticky',top:0,cursor: "pointer" }}
                onClick={setter}
                >
              <CloseIcon />
                </IconButton>
                           {/* <MenuForm returnedMenu={returnedMenu} /> */}
                           <Menus returnedMenu={returnedMenu} />
            </Paper>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default MenuModal;
