"use client";
import { useState, useEffect } from "react";
import { useGetReturnsQuery, useGetReturnQuery } from "@/redux/services/shop/returnApi";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import {
  Box,
  Button,
  Chip,
  Stack,
  CircularProgress,
  LinearProgress,
  Typography,
  useTheme
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import useToast from "@/hooks/useToast";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ITablePaginationMode } from "@/types";
import TimeLoader from "@/components/shared/loaders/TimeLoader";
import EditRoadOutlinedIcon from "@mui/icons-material/EditRoadOutlined";
import OrderStatus from "./ReturnForm";
import { EReturnStatus } from "./typescope";
import { getStatusTitle } from "./getStatusTitlesAndColors";
import ReturnModal from "./ReturnModal";
import { tokens } from "@/theme";
import usePermission from "@/hooks/usePermission";

const ReturnsList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
  const [updateOrderModal, setUpdateOrderModal] = useState<boolean>(false);
  const [modalTempData, setModalTempData] = useState<any>();
  const { hasPermission } = usePermission();
  const showToast = useToast();
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const {
    data: returns,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error : returnsError,
  } = useGetReturnsQuery({
    perpage: paginationModel.pageSize,
    page: paginationModel.page + 1,
  });



  const handleEachReturn = (obj: any): void => {
    setModalTempData(obj);
    setUpdateOrderModal((prev) => !prev);
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "شناسه",
      width: 20,
      headerAlign: "center",
      align: "center",
      valueGetter: (eachReturn : any) => eachReturn.row.id,
    },
    {
      field: "col2",
      headerName: "نام",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (eachReturn : any) => eachReturn.row.user.name,
    },
    {
      field: "col3",
      headerName: "نام محصول",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (eachReturn : any) => eachReturn.row.product?.title,
    },
    {
      field: "col4",
      headerName: "وضعیت",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (eachReturn : any) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
         {getStatusTitle(eachReturn.row.last_event.status)}
        </Box>
      ),
    },
    {
      field: "col5",
      headerName: "تاریخ ثبت ",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (eachReturn : any) =>
        new DateObject(new Date(eachReturn.row.created_at))
          .convert(persian, persian_fa)
          .format("YYYY/MM/DD HH:mm:ss"),
    },
    {
      field: "col6",
      headerName: "تعداد",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (eachReturn : any) => eachReturn.row.count
    },
    hasPermission("Order.edit") ?  {
      field: "col7",
      headerName: "عملیات",
      width: 250,
      headerAlign: "center",
      align: "center",
      renderCell: (eachReturn : any) => (
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<BorderColorIcon />}
            onClick={() => handleEachReturn(eachReturn.row)}
          >
            نمایش جزئیات
          </Button>
        </Stack>
      ),
    } : undefined,
  ].filter(Boolean) as GridColDef[];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const [rowCountState, setRowCountState] = useState(returns?.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      returns?.total !== undefined ? returns?.total : prevRowCountState
    );
  }, [returns?.total, setRowCountState]);


  

  let content;

  if (isSuccess) {
    content = (
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            my: 2,
            pb: 1,
            borderBottom: `1px solid ${colors.primary[300]}`,
          }}
        >
          <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
            لیست مرجوعی ها
          </Typography>

        </Box>
        <DataGrid
          autoHeight
          rowHeight={80}
          {...returns?.data}
          rows={returns?.data}
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
        <ReturnModal
          open={updateOrderModal}
          returnedProduct={modalTempData}
          setter={() => setUpdateOrderModal((prev) => !prev)}
        />
      </>
    );
  }

  // if (isLoading) {
  //   content = <TimeLoader />
  // }

  if (returnsError) {
    const error:any = returnsError;
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

  return content
};

export default ReturnsList;
