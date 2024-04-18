import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import ParentMenu from "@/components/shared/menus/ParentMenu";
import {
  useGetSlidersQuery,
  useDeleteSliderMutation,
  useSetDefaultSliderMutation,
} from "@/redux/services/other/slidersApi";
import Link from "next/link";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useToast from "@/hooks/useToast";
import { LoadingButton } from "@mui/lab";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import usePermission from "@/hooks/usePermission";

interface Props {
  type: string;
}

const ColleaguesSliderList: React.FC<Props> = ({ type }) => {
  const showToast = useToast();
  const { hasPermission } = usePermission()
  const [itemId, setItemId] = useState<number>(0)



  const {
    data: sliders,
    isSuccess,
    isLoading,
    isFetching,
    isError,
    error: slidersError,
  } = useGetSlidersQuery({ type });
  const [
    deleteSlider,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteSliderMutation<any>();

  const [
    setDefaultSlider,
    {
      isSuccess: setDefaultStatus,
      isLoading: setDefaultLoader,
      data: setDefaultResult,
    },
  ] = useSetDefaultSliderMutation<any>();

  
const handleSetDefault = (id:number) => {
  setItemId(id)
  setDefaultSlider(id)
}

  const deleteHandler = (id: number): void => {
    deleteSlider(id);
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "ردیف",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (slider: any) => slider.id,
    },
    {
      field: "col2",
      headerName: "نام اسلایدر",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (slider: any) => slider.row.title,
    },
    {
      field: "col3",
      headerName: "توضیحات",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (slider: any) => slider.row.description,
    },
    hasPermission("Promotion.edit")
      ? {
          field: "col4",
          headerName: "انتخاب پیش فرض",
          headerAlign: "center",
          align: "center",
          width: 150,
          renderCell: (slider: any) => (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                alignItems: "center",
              }}
            >
              <LoadingButton
                color={slider.row.status === 0 ? "error" : "success"}
                disabled={itemId === slider.row.id ? setDefaultLoader: false}
                loading={itemId === slider.row.id ? setDefaultLoader: false}
                loadingPosition="center"
                variant="text"
                onClick={() => handleSetDefault(slider.row.id)}
              >
                <PublishedWithChangesIcon />
              </LoadingButton>
            </Box>
          ),
        }
      : undefined,
    hasPermission("Promotion.edit") && hasPermission("Promotion.delete")
      ? {
          field: "col5",
          headerName: "عملیات",
          headerAlign: "center",
          align: "center",
          width: 250,
          renderCell: (slider: any) => (
            <Stack direction="row" spacing={2}>
              {hasPermission("Promotion.edit") && (
                <Link
                  href={`/adminpanel/other/sliders/update-slider/${slider.row.id}`}
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
              {hasPermission("Promotion.delete") && (
                <ConfirmModal
                  modalTitle={slider.row.name}
                  description="آیا از حذف مطمئن هستید؟"
                  color="error"
                  icon={<DeleteIcon />}
                  btnTitle="حذف"
                  setter={() => deleteHandler(slider.row.id)}
                  ctaLoader={deleteLoader}
                />
              )}
            </Stack>
          ),
        }
      : undefined,
  ].filter(Boolean) as GridColDef[];

  function CustomToolbar() {
    return (
      <GridToolbarContainer sx={{ justifyContent: "space-between" }}>
        {hasPermission("Promotion.create") && (
          <Link href="/adminpanel/other/sliders/add-main-slider/2">
            <Button
              variant="outlined"
              color="primary"
              endIcon={<AddCircleOutlineIcon />}
            >
              افزودن اسلایدر
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

  const activeSlider = sliders?.data.filter(
    (item: any) => item.status === 1 && item.type === 2
  )[0];
  let content;

  if (isSuccess) {
    content = (
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Typography component="h1" variant="h4">
            اسلایدر فعال:{" "}
          </Typography>
          <Typography component="h1" variant="h4" color="success">
            {activeSlider?.title}
          </Typography>
        </Box>
        <DataGrid
          autoHeight
          rows={sliders?.data}
          columns={columns}
          loading={isFetching}
          slots={{
            toolbar: CustomToolbar,
          }}
          paginationMode="server"
          pageSizeOptions={[10, 20, 30]}
        />
      </Box>
    );
  }

  if (isLoading) {
  }

  if (slidersError) {
    const error: any = slidersError;
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

export default ColleaguesSliderList;
