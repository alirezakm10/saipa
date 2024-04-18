"use client";
import { useEffect } from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Button, Stack, Grid, Box, Typography, useTheme } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import Link from "next/link";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import useToast from "@/hooks/useToast";
import {
  useGetGuarantiesQuery,
  useDeleteGuaranteeMutation,
} from "@/redux/services/shop/guaranteeApi";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { tokens } from "@/theme";
import usePermission from "@/hooks/usePermission";

const GuaranteeList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const { hasPermission } = usePermission();
  const {
    data: guaranties,
    isSuccess,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetGuarantiesQuery("");
  const [
    deleteGuarantee,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteGuaranteeMutation<any>();
  const deleteHandler = (id: number): void => {
    deleteGuarantee(id);
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "ردیف",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (guarantee : any) => guarantee.id,
    },
    {
      field: "col2",
      headerName: "نام گارانتی",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (guarantee : any) => guarantee.row.name,
    },
    {
      field: "col3",
      headerName: "مدت زمان",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (guarantee : any) => guarantee.row.duration,
    },
    {
      field: "col4",
      headerName: "توضیحات",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (guarantee : any) => guarantee.row.description,
    },
    {
      field: "col5",
      headerName: "تاریخ انتشار",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (guarantee : any) => guarantee.row.created_at,
    },
    hasPermission("Guarantee.edit") && hasPermission("Guarantee.delete") ? {
      field: "col6",
      headerName: "عملیات",
      headerAlign: "center",
      align: "center",
      width: 250,
      renderCell: (guarantee : any) => (
        <Stack direction="row" spacing={2}>
          {hasPermission("Guarantee.edit") && (
            <Link
              href={`/adminpanel/shop/guarantee/updateguarantee/${guarantee.row.id}`}
            >
              <Button
                variant="outlined"
                color="warning"
                startIcon={<BorderColorIcon />}
              >
                ویرایش
              </Button>
            </Link>
          )}
          {hasPermission("Guarantee.delete") && (
            <ConfirmModal
              modalTitle={guarantee.row.name}
              description="آیا از حذف مطمئن هستید؟"
              color="error"
              icon={<DeleteIcon />}
              btnTitle="حذف"
              setter={() => deleteHandler(guarantee.row.id)}
              ctaLoader={deleteLoader}
            />
          )}
        </Stack>
      ),
    } : undefined,
  ].filter(Boolean) as GridColDef[];

  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
        {hasPermission("Guarantee.create") && (
          <Link href="/adminpanel/shop/guarantee/addguarantee">
            <Button
              variant="outlined"
              color="primary"
              endIcon={<AddCircleOutlineIcon />}
            >
              افزودن گارانتی
            </Button>
          </Link>
        )}
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
  }, [deleteStatus, deleteResult]);

  let content;

  if (isSuccess) {
    content = (
      <Grid container>
        <DataGrid
          autoHeight
          rows={guaranties}
          columns={columns}
          loading={isLoading}
          slots={{
            toolbar: CustomToolbar,
          }}
          paginationMode="server"
          pageSizeOptions={[10, 20, 30]}
        />
      </Grid>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 1,
          pb: 1,
          borderBottom: `1px solid ${colors.primary[300]}`,
        }}
      >
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
            لیست گارانتی ها
        </Typography>
      </Box>
      {content}
    </>
  );
};

export default GuaranteeList;
