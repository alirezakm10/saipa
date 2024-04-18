"use client";
import { useState, useEffect } from "react";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import useToast from "@/hooks/useToast";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ITablePaginationMode } from "@/types";
import UserLogModal from "./UserLogModal";
import { useGetUsersSignInsQuery } from "@/redux/services/users/usersApi";

const UsersLogs = () => {
  const [userLogModal, setUserLogModal] = useState<boolean>(false);
  const [userLogId, setUserLogId] = useState<number>(0);
  const showToast = useToast();
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const {
    data: usersSignIns,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error : usersSignInsError,
  } = useGetUsersSignInsQuery({
    perpage: paginationModel.pageSize,
    page: paginationModel.page + 1,
  });

  // mutation queries

  const handleDelete = (id: number) => {
  };

  const handleUserLogModal = (id: number): void => {
    setUserLogId(id);
    setUserLogModal((prev) => !prev);
  };

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
    },
    {
      field: "col6",
      headerName: "عملیات",
      width: 250,
      headerAlign: "center",
      align: "center",
      renderCell: (order) => (
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<BorderColorIcon />}
            onClick={() => handleUserLogModal(order.row.id)}
          >
             جزئیات
          </Button>
        </Stack>
      ),
    },
  ];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const [rowCountState, setRowCountState] = useState(usersSignIns?.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      usersSignIns?.total !== undefined ? usersSignIns?.total : prevRowCountState
    );
  }, [usersSignIns?.total, setRowCountState]);



  let content;

  if (isSuccess) {
    content = (
      <>
         <Box sx={{
          display:'flex',
          width:'100%',
          flexDirection:'row',
          justifyContent:'space-between',
          my:2
        }} >
          <Typography component='h1' variant="h3" >گزارش ورود کاربران </Typography>
        </Box>
        <DataGrid
          autoHeight
          rowHeight={80}
          {...usersSignIns?.data}
          rows={usersSignIns?.data}
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
        <UserLogModal
          id={userLogId}
          open={userLogModal}
          setter={() => setUserLogModal((prev) => !prev)}
        />
      </>
    );
  }

  // if (isLoading) {
  //   content = <TimeLoader />
  // }

  if (usersSignInsError) {
    const error : any = usersSignInsError;
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="50%"
        alignItems="center"
      >
        {error?.data?.message ?? error.error}
      </Box>
    );
  }

  return content;
};

export default UsersLogs;
