import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "@/redux/services/users/usersApi";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Role, SelectedUserFilter } from "./typescope";
import Link from "next/link";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import DeleteIcon from "@mui/icons-material/Delete";
import { ITablePaginationMode } from "@/types";
import useToast from "@/hooks/useToast";
import SettingsIcon from "@mui/icons-material/Settings";
import { tokens } from "@/theme";
import { useRouter } from "next/navigation";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterMenu from "@/components/shared/filterMenu/FilterMenu";
import FilterForm from "./FilterForm";
import { ClipLoader } from "react-spinners";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import usePermission from "@/hooks/usePermission";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import UserPurchasesModal from "../shop/orders/UserPurchasesModal";



const UsersList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const showToast = useToast();
  const { hasPermission } = usePermission();
  const [paginationModel, setPaginationModel] = useState<ITablePaginationMode>({
    pageSize: 10,
    page: 0,
  });
  const [userPurchasesModal, setUserPurchasesModal] = useState<boolean>(false)
  const [userId, setUserId] = useState<number>(0)

  const [selectedFilter, setSelectedFilter] =
    useState<SelectedUserFilter | null>(null);
  const {
    data: usersList,
    isSuccess,
    isLoading,
    error,
    refetch,
    isFetching,
    error : usersListError,
  } = useGetUsersQuery(
    {
      perpage: paginationModel.pageSize,
      page: paginationModel.page + 1,
      name: selectedFilter?.name,
      family: selectedFilter?.family,
      email: selectedFilter?.email,
      mobile: selectedFilter?.mobile,
      is_admin: selectedFilter?.is_admin ? 1 : 0,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [rowCountState, setRowCountState] = useState(usersList?.total || 0);

  useEffect(() => {
    setRowCountState((prevRowCountState: ITablePaginationMode) =>
      usersList?.total !== undefined ? usersList?.total : prevRowCountState
    );
  }, [usersList?.total, setRowCountState]);

  const [
    deleteUser,
    {
      isSuccess: deleteStatus,
      isLoading: deleteLoader,
      data: deleteResult,
      error: deleteError,
    },
  ] = useDeleteUserMutation();

  const deleteHandler = (id: number): void => {
    deleteUser(id);
  };

  useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
    if (deleteError) {
      const errMsg:any = deleteError;
      showToast(errMsg.data?.message ?? "خطایی رخ داده است!", "error");
    }
  }, [deleteStatus, deleteResult]);

  const handleUserPurchasesModal = (id: number): void => {
    setUserId(id);
    setUserPurchasesModal((prev) => !prev);
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "تصویر",
      headerAlign: "center",
      align: "center",
      width: 100,
      renderCell: (user : any) => {
        return (
          <Box display="flex">
            <Avatar
              alt={user?.row?.photo?.alt ?? "No image"}
              src={user?.row?.photo?.download_link ?? ""}
            />
          </Box>
        );
      },
    },
    {
      field: "col2",
      headerName: "نام کاربری",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (user : any) => user.row.name,
    },
    {
      field: "col3",
      headerName: "ایمیل",
      headerAlign: "center",
      align: "center",
      width: 200,
      valueGetter: (user : any) => user.row.email,
    },
    {
      field: "col4",
      headerName: "شماره تماس",
      headerAlign: "center",
      align: "center",
      width: 120,
      valueGetter: (user : any) => user.row.mobile,
    },
    {
      field: "col5",
      headerName: "نقش کاربر",
      headerAlign: "center",
      align: "center",
      width: 150,
      valueGetter: (user : any) =>
        user.row.roles?.length > 0
          ? user.row.roles?.map((role: Role) => role.name)
          : "فاقد نقش",
    },
    {
      field: "col6",
      headerName: "ادمین",
      headerAlign: "center",
      align: "center",
      width:20,
      renderCell: (user : any) => (user.row.is_admin ? <CheckIcon /> : <CloseIcon />),
    },
    {
      field: "col7",
      headerName: "کد ملی",
      headerAlign: "center",
      align: "center",
      width: 100,
      valueGetter: (user : any) => user.row.profile?.national_code || "ثبت نشده",
    },
    hasPermission("User.delete") && hasPermission("User.edit") ?  {
      field: "col8",
      headerName: "عملیات",
      headerAlign: "center",
      align: "center",
      width: 400,
      renderCell: (user : any) => (
        <Stack direction="row" spacing={2}>
          {hasPermission("User.edit") && (
            <Button
              variant="outlined"
              color="success"
              startIcon={<SettingsIcon />}
              onClick={() =>
                router.push(`/adminpanel/users/userdetail/${user.row.id}`)
              }
            >
              تنظیمات
            </Button>
          )}

          {hasPermission("User.delete") && (
            <ConfirmModal
              modalTitle={user.row.name}
              description="آیا از حذف مطمئن هستید؟"
              color="error"
              icon={<DeleteIcon />}
              btnTitle="حذف"
              setter={() => deleteHandler(user.row.id)}
              ctaLoader={deleteLoader}
            />
          )}

{ hasPermission("Order.index") && <Button
            variant="outlined"
            color="warning"
            startIcon={<BorderColorIcon />}
            onClick={() => handleUserPurchasesModal(user.row.id)}
          >
             خرید های کاربر
          </Button>}
        </Stack>
      ),
    } : undefined,
  ].filter(Boolean) as GridColDef[];

  const handleDeleteFilter = (filterItem: any) => {
    if (selectedFilter) {
      if (filterItem.name) {
        setSelectedFilter({ ...selectedFilter, name: "" });
      }
      if (filterItem.family) {
        setSelectedFilter({ ...selectedFilter, family: "" });
      }
      if (filterItem.email) {
        setSelectedFilter({ ...selectedFilter, email: "" });
      }
      if (filterItem.mobile) {
        setSelectedFilter({ ...selectedFilter, mobile: "" });
      }
      if (filterItem.is_admin) {
        setSelectedFilter({ ...selectedFilter, is_admin: false });
      }
    }
  };

  let filterChipContent;
  if (selectedFilter) {
    const selectedFilterArray = Object.entries(selectedFilter).map((e) => ({
      [e[0]]: e[1],
    }));
    filterChipContent =
      selectedFilterArray?.length > 0
        ? selectedFilterArray?.map((filterItem, index) => {
            if (Object.values(filterItem)[0] !== "") {
              let label;
              if (filterItem.name) {
                label = filterItem.name;
              }

              if (filterItem.family) {
                label = filterItem.family;
              }

              if (filterItem.email) {
                label = filterItem.email;
              }
              if (filterItem.mobile) {
                label = filterItem.mobile;
              }
              if (filterItem.is_admin) {
                label = "ادمین";
              }
              return label ? (
                <Chip
                  label={label}
                  variant="outlined"
                  onDelete={() => handleDeleteFilter(filterItem)}
                  key={index}
                  sx={{ mx: 1 }}
                  deleteIcon={
                    isLoading ? <ClipLoader size={10} /> : <CloseIcon />
                  }
                />
              ) : null;
            }
          })
        : null;
  }

  let content;

  if (isSuccess) {
    content = (
      <>
        <Box
          sx={{
            mb: 1,
            display: "flex",
            alignItems: "center",
            overflowX: "auto",
          }}
        >
          <FilterMenu
            title="فیلتر"
            icon={<FilterAltIcon />}
            isFetching={isFetching}
          >
            <FilterForm
              setSelectedFilter={setSelectedFilter}
              selectedFilter={selectedFilter}
              refetch={refetch}
            />
          </FilterMenu>

          {filterChipContent}
        </Box>
        <DataGrid
          autoHeight
          rowCount={rowCountState}
          {...usersList?.data}
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
          rows={usersList?.data}
          columns={columns}
          loading={isLoading}
          paginationMode="server"
          pageSizeOptions={[10, 20, 30]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
        />
           <UserPurchasesModal
          id={userId}
          open={userPurchasesModal}
          setter={() => setUserPurchasesModal((prev) => !prev)}
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

  if (usersListError) {
    const error : any = usersListError;
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
          کاربران
        </Typography>
        {hasPermission("User.create") && (
          <Button
            variant="contained"
            onClick={() => router.push("/adminpanel/users/adduser")}
          >
            افزودن کاربر
          </Button>
        )}
      </Box>
      {content}
    </>
  );
};

export default UsersList;
