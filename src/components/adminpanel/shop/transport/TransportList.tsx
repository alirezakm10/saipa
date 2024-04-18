"use client";
import { useEffect } from "react";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import { Button, Stack, Grid, Box } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import Link from "next/link";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import useToast from "@/hooks/useToast";
import {
  useGetTransportsQuery,
  useDeleteTransportMutation,
} from "@/redux/services/shop/transportApi";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import usePermission from "@/hooks/usePermission";

const TransportList = () => {
  const showToast = useToast();
  const { hasPermission } = usePermission();
  const {
    data: transports,
    isSuccess,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetTransportsQuery("");
  const [
    deleteTransport,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteTransportMutation<any>();
  const deleteHandler = (id: number): void => {
    deleteTransport(id);
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "ردیف",
      width: 50,
      headerAlign: "center",
      align: "center",
      valueGetter: (transport : any) => transport.id,
    },
    {
      field: "col2",
      headerName: "نوع ارسال",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (transport : any) => transport.row.title,
    },
    {
      field: "col3",
      headerName: "هزینه ارسال",
      width: 100,
      headerAlign: "center",
      align: "center",
      valueGetter: (transport : any) => transport.row.cost,
    },
    {
      field: "col5",
      headerName: "حداقل زمان تحویل",
      width: 130,
      headerAlign: "center",
      align: "center",
      renderCell: (transport : any) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            {transport.row.minimum_delivery_days} روز
          </Box>
        );
      },
    },
    {
      field: "col6",
      headerName: "توضیحات",
      width: 250,
      headerAlign: "center",
      align: "center",
      valueGetter: (transport : any) => transport.row.description,
    },
    hasPermission("Post.edit") && hasPermission("Post.delete") ?{
      field: "col7",
      headerName: "عملیات",
      width: 250,
      headerAlign: "center",
      align: "center",
      renderCell: (transport : any) => (
        <Stack direction="row" spacing={2}>
          {hasPermission("Post.edit") && (
            <Link
              href={`/adminpanel/shop/transport/updatetransport/${transport.row.id}`}
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
          {hasPermission("Post.delete") && (
            <ConfirmModal
              modalTitle={transport.row.name}
              description="آیا از حذف مطمئن هستید؟"
              color="error"
              icon={<DeleteIcon />}
              btnTitle="حذف"
              setter={() => deleteHandler(transport.row.id)}
              ctaLoader={deleteLoader}
            />
          )}
        </Stack>
      ),
    } : undefined,
  ].filter(Boolean) as GridColDef[] ;

  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ justifyContent: "space-between"}}>
        { hasPermission("Post.create") && <Link href="/adminpanel/shop/transport/addtransport">
          <Button
            variant="outlined"
            color="primary"
            endIcon={<AddCircleOutlineIcon />}
          >
            افزودن نوع ارسال
          </Button>
        </Link>}
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
      <Grid container spacing={2} sx={{mt : 2}} >
        <DataGrid
          autoHeight
          rows={transports?.data}
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

  return content;
};

export default TransportList;
