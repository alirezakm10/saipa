"use client";
import { useState, useEffect } from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
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
    TableBody,
    TableHead,
    Button,
} from "@mui/material";
import { ModalVariants } from "@/components/shared/modals/ModalVariants";
import { tokens } from "@/theme";
import CloseIcon from "@mui/icons-material/Close";
import { useGetSingleUserSignInsQuery } from "@/redux/services/users/usersApi";
import { styled } from "@mui/material/styles";
import TimeLoader from "@/components/shared/loaders/TimeLoader";
import useToast from "@/hooks/useToast";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ITablePaginationMode } from "@/types";




interface IDefaultModal {
    id: number;
    open: boolean;
    setter: () => void;
}

const UserLogModal: React.FC<IDefaultModal> = ({ id, open, setter }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
        pageSize: 10,
        page: 0,
      });



    const {
        data: userLog,
        isLoading,
        isSuccess,
        isError,
        isFetching,
        error,
    } = useGetSingleUserSignInsQuery(id, {
        refetchOnMountOrArgChange: true,
    })



    
  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "شناسه",
      width: 20,
      headerAlign: "center",
      align: "center",
      valueGetter: (order) => order.row.id,
    },
    {
      field: "col2",
      headerName: "نام",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (order) => order.row.user.name,
    },
    {
      field: "col3",
      headerName: "آی پی",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (order) => order.row.ip,
    },
    {
      field: "col4",
      headerName: "تاریخ ورود ",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (order) =>
        new DateObject(new Date(order.row.created_at))
          .convert(persian, persian_fa)
          .format("YYYY/MM/DD HH:mm:ss"),
    },
    {
      field: "col5",
      headerName: "شماره تماس",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (order) =>
       (
            <a href={`tel:${order.row.user.mobile}`}>
            {order.row.user.mobile}
            </a>
       )
    }
  ];


  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const [rowCountState, setRowCountState] = useState(userLog?.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      userLog?.total !== undefined ? userLog?.total : prevRowCountState
    );
  }, [userLog?.total, setRowCountState]);


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
                                        تاریخچه ورودها                  </Typography>
                                    {userLog?.data.length > 0 ? 
                                         <DataGrid
                                         autoHeight
                                         rowHeight={80}
                                         {...userLog?.data}
                                         rows={userLog?.data}
                                         columns={columns}
                                         rowCount={rowCountState}
                                         loading={isLoading}
                                         slots={{
                                           toolbar: CustomToolbar,
                                         }}
                                         pageSizeOptions={[10, 20, 30]}
                                         paginationModel={paginationModel}
                                         paginationMode="server"
                                         onPaginationModelChange={setPaginationModel}
                                       />
                                        :
                                        <Typography component="h1" variant="caption" sx={{ mx: "auto" }} >
                                            گزارشی یافت نشد
                                        </Typography>
                                    }
                                </Box>
                            )}
                        </Paper>
                    </motion.div>
                </Box>
            )}
        </AnimatePresence>
    );
};

export default UserLogModal;
