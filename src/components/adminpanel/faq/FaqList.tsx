"use client";
import { useEffect, useState } from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridRowSelectionModel,
  GridRowId,
} from "@mui/x-data-grid";
import { Button, Stack, Grid, Box, useTheme, Typography } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import Link from "next/link";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import useToast from "@/hooks/useToast";
import {
  useGetAllFaqsQuery,
  useDeleteFaqsMutation,
} from "@/redux/services/faqApi";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { LoadingButton } from "@mui/lab";
import { tokens } from "@/theme";
import usePermission from "@/hooks/usePermission";

const FaqList = () => {
  const showToast = useToast();
  const [selectedItems, setSelectedItems] = useState<GridRowId[]>([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { hasPermission } = usePermission();

  const {
    data: faqs,
    isSuccess,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAllFaqsQuery("");
  const [
    deleteFaqs,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteFaqsMutation<any>();

  const deleteHandler = (): void => {
    deleteFaqs(selectedItems);
  };




  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "شناسه",
      width: 50,
      headerAlign: "center",
      align: "center",
      valueGetter: (faq : any) => faq.id,
    },
    {
      field: "col2",
      headerName: "نام",
      width: 150,
      headerAlign: "center",
      align: "center",
      valueGetter: (faq : any) => faq.row.title,
    },
    hasPermission("Faq.edit") ? {
      field: "col3",
      headerName: "عملیات",
      width: 250,
      headerAlign: "center",
      align: "center",
      renderCell: (faq : any) => (
        <Stack direction="row" spacing={2}>
          {hasPermission("Faq.edit") && (
            <Link href={`/adminpanel/faq/update-faq/${faq.row.id}`}>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<BorderColorIcon />}
              >
                ویرایش
              </Button>
            </Link>
          )}
        </Stack>
      ),
    } : undefined,
  ].filter(Boolean) as GridColDef[];

  const handleSelectedRows = (items: GridRowSelectionModel) => {
    setSelectedItems(items)
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer
        sx={{ position: "sticky", top: 0, justifyContent: "space-between" }}
      >
        {hasPermission("Faq.create") && (
          <Link href="/adminpanel/faq/add-faq">
            <Button
              variant="outlined"
              color="primary"
              endIcon={<AddCircleOutlineIcon />}
            >
              ساخت سوال و پاسخ
            </Button>
          </Link>
        )}
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
         { hasPermission("Faq.delete") && <ConfirmModal
            modalTitle=""
            description="آیا از حذف مطمئن هستید؟"
            color="error"
            icon={<DeleteIcon />}
            btnTitle={`حذف ${selectedItems.length}`}
            setter={() => deleteHandler()}
            ctaLoader={deleteLoader}
            disabled={selectedItems.length > 0 ? false : true}
          />}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GridToolbarExport />
          </Box>
        </Box>
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
      <Grid container direction="column" spacing={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 1,
            mt : 2,
            mb: 1,
            borderBottom: `1px solid ${colors.primary[300]}`,
          }}
        >
          <Typography
            variant="h4"
            sx={{ display: "flex", alignItems: "center" }}
          >
            سوالات و پاسخ ها
          </Typography>
        </Box>
        <DataGrid
          autoHeight
          rows={faqs}
          columns={columns}
          loading={isLoading}
          slots={{
            toolbar: CustomToolbar,
          }}
          paginationMode="server"
          pageSizeOptions={[10, 20, 30]}
          checkboxSelection = {hasPermission("Faq.delete")}
          disableRowSelectionOnClick
          onRowSelectionModelChange={(item) => handleSelectedRows(item)}
        />
      </Grid>
    );
  }

  return content;
};

export default FaqList;
