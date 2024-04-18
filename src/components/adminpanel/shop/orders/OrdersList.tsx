"use client";
import { useState, useEffect } from "react";
import {
  useGetOrdersQuery,
} from "@/redux/services/shop/ordersApi";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import {
  Box,
  Button,
  Stack,
  LinearProgress,
  Typography,
  useTheme
} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import useToast from "@/hooks/useToast";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { ITablePaginationMode } from "@/types";
import EditRoadOutlinedIcon from "@mui/icons-material/EditRoadOutlined";
import OrderStatus from "./OrderStatus";
import { getStatusTitle } from "./getStatusTitlesAndColors";
import InvoiceModal from "./InvoiceModal";
import { tokens } from "@/theme";
import usePermission from "@/hooks/usePermission";

const OrdersList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
  const [updateOrderModal, setUpdateOrderModal] = useState<boolean>(false);
  const [invoiceId, setInvoiceId] = useState<number>(0);
  const showToast = useToast();
  const { hasPermission } = usePermission();
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const {
    data: orders,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error : ordersError,
  } = useGetOrdersQuery({
    perpage: paginationModel.pageSize,
    page: paginationModel.page + 1,
  });

  // mutation queries


  const handleInvoiceModal = (id: number): void => {
    setInvoiceId(id);
    setUpdateOrderModal((prev) => !prev);
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "شناسه",
      width: 20,
      headerAlign: "center",
      align: "center",
      valueGetter: (order : any) => order.row.id,
    },
    {
      field: "col2",
      headerName: "نام",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (order : any) => order.row.user.name,
    },
    {
      field: "col3",
      headerName: "قیمت کل",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (order : any) => order.row.total_amount,
    },
    {
      field: "col4",
      headerName: "وضعیت",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (order : any) => (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {isFetching ? (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          ) : (
            getStatusTitle(order.row.status)
          )}
        { hasPermission("Order.edit") &&  <ParentMenu
            buttonTitle="ویرایش سریع"
            buttonIcon={<EditRoadOutlinedIcon />}
            color="warning"
          >
            <OrderStatus id={order.row.id} />
          </ParentMenu>}
        </Box>
      ),
    },
    {
      field: "col5",
      headerName: "تاریخ ثبت ",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (order : any) =>
        new DateObject(new Date(order.row.created_at))
          .convert(persian, persian_fa)
          .format("YYYY/MM/DD HH:mm:ss"),
    },
    {
      field: "col6",
      headerName: "تاریخ تحویل ",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (order : any) =>
        new DateObject(new Date(order.row.post_date))
          .convert(persian, persian_fa)
          .format("YYYY/MM/DD HH:mm:ss"),
    },
    hasPermission("Order.index") ? {
      field: "col7",
      headerName: "عملیات",
      width: 250,
      headerAlign: "center",
      align: "center",
      renderCell: (order : any) => (
        <Stack direction="row" spacing={2}>
           { hasPermission("Order.index") && <Button
            variant="outlined"
            color="warning"
            startIcon={<BorderColorIcon />}
            onClick={() => handleInvoiceModal(order.row.id)}
          >
            نمایش فاکتور
          </Button>}
        </Stack>
      ),
    } : undefined,
  ].filter(Boolean) as GridColDef[] ;

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const [rowCountState, setRowCountState] = useState(orders?.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      orders?.total !== undefined ? orders?.total : prevRowCountState
    );
  }, [orders?.total, setRowCountState]);

useEffect(()=>{

},[])

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
            لیست سفارشات
          </Typography>

        </Box>
        <DataGrid
          autoHeight
          rowHeight={80}
          {...orders?.data}
          rows={orders?.data}
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
        <InvoiceModal
          id={invoiceId}
          open={updateOrderModal}
          setter={() => setUpdateOrderModal((prev) => !prev)}
        />
      </>
    );
  }

  // if (isLoading) {
  //   content = <TimeLoader />
  // }

  if (ordersError) {
    const error : any = ordersError;
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

export default OrdersList;
