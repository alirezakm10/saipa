"use client";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "@/theme";
import { useRouter } from "next/navigation";
import {
  useDeleteRoleMutation,
  useGetRolesQuery,
} from "@/redux/services/roles/roleApi";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";
import LanIcon from "@mui/icons-material/Lan";
import { useEffect } from "react";
import useToast from "@/hooks/useToast";
import EditIcon from '@mui/icons-material/Edit';
import usePermission from "@/hooks/usePermission";

const Roles = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const router = useRouter();
  const { hasPermission } = usePermission();
  const {
    data: rolesList,
    isSuccess,
    isLoading,
    isError,
    error: roleListError,
  } = useGetRolesQuery("");

  const [
    deleteRole,
    {
      isSuccess: deleteStatus,
      isLoading: deleteLoader,
      data: deleteResult,
      error: deleteError,
    },
  ] = useDeleteRoleMutation();

  const deleteHandler = (id: number): void => {
    deleteRole(id);
  };

  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
    if (deleteError) {
      const errMsg : any = deleteError;
      showToast(errMsg.data.message, "error");
    }
  }, [deleteStatus, deleteResult]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "عنوان نقش",
      headerAlign: "center",
      align: "center",
      width: 200,
      //   valueGetter: (ticket) => ticket.row.title,
    },
    {
      field: "actions",
      headerName: "",
      headerAlign: "center",
      align: "center",
      width: 500,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (role) => (
        <Stack direction="row" spacing={2}>
          <Link href={`/adminpanel/roles/updateRole/${role.row.id}`}>
            {hasPermission("Role.edit") && <Button variant="outlined" color="success" startIcon={<EditIcon />}>
             ویرایش نقش
            </Button>}
          </Link>
          <Link href={`/adminpanel/roles/permissionsRole/${role.row.id}`}>
           { hasPermission("Permission.index") && <Button variant="outlined" color="warning" startIcon={<LanIcon />}>
              دسترسی ها
            </Button>}
          </Link>
         {hasPermission("Role.delete") && <ConfirmModal
            modalTitle={role.row.name}
            description="آیا از حذف مطمئن هستید؟"
            color="error"
            icon={<DeleteIcon />}
            btnTitle="حذف"
            setter={() => deleteHandler(role.row.id)}
            ctaLoader={deleteLoader}
          />}
        </Stack>
      ),
    },
  ];

  let content;

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

  if (roleListError) {
    const error : any = roleListError;
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

  if (isSuccess) {
    content = (
      <>
        <DataGrid
          autoHeight
          rowCount={rolesList.length}
          {...rolesList}
          //   sortingMode="server"
          hideFooterPagination
          slots={{
            noRowsOverlay: () => (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                نتیجه ای یافت نشد!
              </Box>
            ),
            noResultsOverlay: () => (
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                نتیجه ای یافت نشد!
              </Box>
            ),
          }}
          rows={rolesList}
          columns={columns}
          loading={isLoading}
          //   onRowClick={handleRowClick}
          //   onCellClick={handleCellClick}
          sx={{
            // disable cell selection style
            ".MuiDataGrid-cell:focus": {
              outline: "none",
            },
            // pointer cursor on ALL rows
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
            },
          }}
          //   disableRowSelectionOnClick
        />
      </>
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
          نقش ها
        </Typography>
        { hasPermission("Role.create") && <Button
          variant="contained"
          onClick={() => router.push("/adminpanel/roles/addRole")}
        >
          افزودن نقش
        </Button>}
      </Box>
      {content}
    </>
  );
};

export default Roles;
