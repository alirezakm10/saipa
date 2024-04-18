"use client";
import { useState, useEffect } from "react";
import {
  useGetInventoryLogsQuery,
  useChargeProductMutation,
  useDischargeProductMutation,
} from "@/redux/services/inventoryApi";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";

import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { ITablePaginationMode } from "@/types";
import { getColorForStatus, getStatusTitle } from "./getStatusTitlesAndColors";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { tokens } from "@/theme";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import useToast from "@/hooks/useToast";
import usePermission from "@/hooks/usePermission";

const InventoryReportsList = () => {
  const showToast = useToast();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { hasPermission } = usePermission();

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  // ...

  const handleIncreaseQuantity = (rowId: string) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [rowId]: (prevQuantities[rowId] || 0) + 1,
    }));
  };

  const handleDecreaseQuantity = (rowId: string) => {
    if (quantities[rowId] > 0) {
      setQuantities((prevQuantities) => ({
        ...prevQuantities,
        [rowId]: (prevQuantities[rowId] || 0) - 1,
      }));
    }
  };

  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  const {
    data: inventoryLogs,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error: inventoryLogsError,
  } = useGetInventoryLogsQuery({
    perpage: paginationModel.pageSize,
    page: paginationModel.page + 1,
  });

  const [
    chargeProduct,
    {
      isSuccess: chargeStatus,
      isLoading: chargeLoader,
      data: chargeResult,
      error: chargeErrorMsg,
    },
  ] = useChargeProductMutation<any>();

  const [
    dischargeProdcut,
    {
      isSuccess: dischargeStatus,
      isLoading: dischargeLoader,
      data: dischargeResult,
      error: dischargeErrorMsg,
    },
  ] = useDischargeProductMutation<any>();

  const handleSubmitChange = (
    productId: number,
    editedQuantity: number,
    initialQuantity: number
  ) => {
    console.log("productId", productId);

    const quantityOffset = Math.abs(initialQuantity - editedQuantity);
    if (editedQuantity < initialQuantity) {
      dischargeProdcut({ id: productId, patch: { quantity: quantityOffset } });
    } else if (editedQuantity > initialQuantity) {
      chargeProduct({ id: productId, patch: { quantity: quantityOffset } });
    }
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "شناسه محصول",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (inventory: any) => inventory.row.product_id,
    },
    {
      field: "col2",
      headerName: "نام محصول",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (inventory: any) => inventory.row.product.title,
    },
    {
      field: "col3",
      headerName: "قیمت",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (inventory: any) => inventory.row.product.price,
    },
    {
      field: "col4",
      headerName: "تعداد فعلی محصول",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (inventory: any) => inventory.row.quantity,
    },
    {
      field: "col5",
      headerName: "ورودی / خروجی",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (inventory: any) =>
        Math.abs(inventory.row.last_quantity - inventory.row.quantity),
    },
    {
      field: "col6",
      headerName: "وضعیت",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (inventory: any) => (
        <Typography
          sx={{
            cursor: "default",
          }}
          component="span"
          variant="subtitle2"
          textAlign="center"
          my="auto"
          color={getColorForStatus(inventory.row.type)}
          width={100}
        >
          {getStatusTitle(Number(inventory.row.type))}
        </Typography>
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

  const [rowCountState, setRowCountState] = useState(inventoryLogs?.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      inventoryLogs?.total !== undefined
        ? inventoryLogs?.total
        : prevRowCountState
    );
  }, [inventoryLogs?.total, setRowCountState]);

  useEffect(() => {
    if (isSuccess && inventoryLogs) {
      const initialQuantities: { [key: string]: number } = {};
      inventoryLogs.data.forEach((row: { [key: string]: number }) => {
        initialQuantities[row.id] = row.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [inventoryLogs, isSuccess]);

  function generateRandom() {
    var length = 8,
      charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
  }

  useEffect(() => {
    if (chargeStatus) {
      showToast(chargeResult?.message, "success");
    }
    if (chargeErrorMsg) {
      const errMsg = chargeErrorMsg.data.message;
      showToast(errMsg, "error");
    }
  }, [chargeStatus, chargeResult, chargeErrorMsg]);

  useEffect(() => {
    if (dischargeStatus) {
      showToast(dischargeResult?.message, "success");
    }
    if (dischargeErrorMsg) {
      const errMsg = dischargeErrorMsg.data.message;
      showToast(errMsg, "error");
    }
  }, [dischargeStatus, dischargeResult, dischargeErrorMsg]);

  console.log("inventoryLogs", inventoryLogs);

  let content;

  if (isSuccess) {
    content = (
      <>
         <Box
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            my: 2,
            pb: 1,
            borderBottom: `1px solid ${colors.primary[300]}`,
          }}
        >
          <Typography component="h1" variant="h4">
              گزارش انبار 
          </Typography>
        </Box>
        <DataGrid
          autoHeight
          rowHeight={80}
          {...inventoryLogs?.data}
          rows={inventoryLogs?.data}
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
          getRowId={(row: any) => generateRandom()}
        />
      </>
    );
  }

  // if (isLoading) {
  //   content = <TimeLoader />
  // }

  if (inventoryLogsError) {
    const error: any = inventoryLogsError;

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

export default InventoryReportsList;
