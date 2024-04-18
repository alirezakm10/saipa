"use client";
import usePermission from "@/hooks/usePermission";
import useToast from "@/hooks/useToast";
import { useGetProductsQuery } from "@/redux/services/shop/productsApi";
import { tokens } from "@/theme";
import { ITablePaginationMode } from "@/types";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import Image from "next/image";
import { useEffect, useState } from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import {
  useChargeProductMutation,
  useDischargeProductMutation,
} from "@/redux/services/inventoryApi";

const InventoryManagement = () => {
  const showToast = useToast();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { hasPermission } = usePermission();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });

  // get queries
  const {
    data: products,
    isLoading,
    isSuccess,
    isError,
    isFetching,
    error: productsError,
  } = useGetProductsQuery(
    {
      perpage: paginationModel.pageSize,
      page: paginationModel.page + 1,
    },
    { refetchOnMountOrArgChange: true }
  );
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

  useEffect(() => {
    if (isSuccess && products) {
      const initialQuantities: { [key: string]: number } = {};
      products.data.forEach((row: { [key: string]: number }) => {
        initialQuantities[row.id] = row.inventory;
      });
      setQuantities(initialQuantities);
    }
  }, [products, isSuccess]);

  const handleSubmitChange = (
    productId: number,
    editedQuantity: number,
    initialQuantity: number
  ) => {
    console.log(
      "productId",
      productId,
      "editedQuantity",
      editedQuantity,
      "initialQuantity",
      initialQuantity
    );

    const quantityOffset = Math.abs(initialQuantity - editedQuantity);
    if (editedQuantity < initialQuantity) {
      dischargeProdcut({ id: productId, patch: { quantity: quantityOffset } });
    } else if (editedQuantity > initialQuantity) {
      chargeProduct({ id: productId, patch: { quantity: quantityOffset } });
    }
  };

  console.log("products", products);

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "تصویر",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: (product: any) => {
        const filteredPhoto = product.row.images.filter(
          (photo: any) => photo.is_default == 1
        )[0];
        return (
          <Box position="relative" width="100px" height="60px">
            <Image
              src={
                filteredPhoto?.download_link ?? "/assets/images/no-image.svg"
              }
              fill
              alt={filteredPhoto?.alt ?? "No image"}
            />
          </Box>
        );
      },
    },
    {
      field: "col2",
      headerName: "نام",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (product: any) => product.row.title,
    },
    {
      field: "col3",
      headerName: "موجودی انبار",
      headerAlign: "center",
      align: "center",
      width: 130,
      renderCell: (product: any) => (
        <Chip
          label={product.row.inventory || "ناموجود"}
          color={product.row.inventory > 0 ? "success" : "error"}
          sx={{ minWidth: "60px" }}
        />
      ),
    },
    {
      field: "col4",
      headerName: "قیمت",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (product: any) => product.row.price,
    },
    hasPermission("InOutLog.edit")
      ? {
          field: "col5",
          headerName: "عملیات",
          width: 200,
          headerAlign: "center",
          align: "center",
          renderCell: (product: any) => (
            <Stack
              direction="column"
              spacing={1}
              justifyContent="center"
              alignItems="center"
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  color="success"
                  variant="contained"
                  sx={{
                    width: "30px",
                    height: "30px",
                  }}
                  onClick={() => handleIncreaseQuantity(product.row.id)}
                >
                  <AddCircleOutline />
                </Button>
                <Box
                  sx={{
                    width: "20px",
                    height: "20px",
                    border: `1px solid ${colors.themeAccent[300]}`,
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {product.row.inventory}
                </Box>
                <Button
                  color="error"
                  variant="contained"
                  sx={{
                    width: "30px",
                    height: "30px",
                  }}
                  onClick={() => handleDecreaseQuantity(product.row.id)}
                >
                  <RemoveIcon />
                </Button>
              </Box>
              {quantities[product.row.id] !== (product.row.inventory || 0) && (
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    color="success"
                    onClick={() =>
                      handleSubmitChange(
                        product.row.id,
                        quantities[product.row.id],
                        product.row.inventory
                      )
                    }
                  >
                    <CheckIcon />
                  </IconButton>
                  <Box
                    sx={{
                      width: "20px",
                      height: "20px",
                      border: `1px solid ${colors.themeAccent[300]}`,
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {" "}
                    {quantities[product.row.id] || 0}
                  </Box>
                  <IconButton
                    color="error"
                    onClick={() =>
                      setQuantities((prevQuantities) => ({
                        ...prevQuantities,
                        [product.row.id]: product.row.inventory,
                      }))
                    }
                  >
                    <ClearIcon />
                  </IconButton>
                </Box>
              )}
            </Stack>
          ),
        }
      : undefined,
  ].filter(Boolean) as GridColDef[];

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const [rowCountState, setRowCountState] = useState(products?.meta.total || 0);
  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      products?.meta.total !== undefined
        ? products?.meta.total
        : prevRowCountState
    );
  }, [products?.meta.total, setRowCountState]);

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
            مدیریت انبار
          </Typography>
        </Box>
        <DataGrid
          autoHeight
          rowHeight={80}
          {...products?.data}
          rows={products?.data}
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
      </>
    );
  }

  if (isLoading) {
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="100vh"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (productsError) {
    const error: any = productsError;
    console.log("error---->", error);

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

export default InventoryManagement;
