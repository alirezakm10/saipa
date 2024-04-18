"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Paper,
  Typography,
  useTheme,
  TableContainer,
  Table,
  TableRow,
  TableCell,
} from "@mui/material";
import { ModalVariants } from "@/components/shared/modals/ModalVariants";
import { tokens } from "@/theme";
import CloseIcon from "@mui/icons-material/Close";

interface IDefaultModal {
  data:any;
  open: boolean;
  setter: () => void;
}

const ActivityLogModal: React.FC<IDefaultModal> = ({ data, open, setter }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)


  return (
    <AnimatePresence>
      {open && (
        <Box
          position="fixed"
          zIndex={3}
          width="auto"
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
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Typography component="h1" variant="h4" sx={{ mx: "auto" }}>
                    مشاهده فعایت ها                  
                    </Typography>
                  <TableContainer
                    sx={{
                      border: `1px solid ${colors.primary[200]}`,
                      borderRadius: '10px',
                    }}
                  >
                    <Table>
                      <TableRow>
                        <TableCell variant="head">نام</TableCell>
                        <TableCell>{data.user.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant="head">آی پی</TableCell>
                        <TableCell>{data.ip}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell variant="head">عملیات</TableCell>
                        <TableCell>{data.description}</TableCell>
                      </TableRow>
                    </Table>
                  </TableContainer>
                </Box>
            </Paper>
          </motion.div>
        </Box>
      )}
    </AnimatePresence>
  );
};

export default ActivityLogModal;
