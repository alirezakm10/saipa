"use client";
import useToast from "@/hooks/useToast";
import {
  useAddPermissionToRoleMutation,
  useGetPermissionsQuery,
} from "@/redux/services/permissions/permissionsApi";
import { useGetRoleQuery } from "@/redux/services/roles/roleApi";
import { tokens } from "@/theme";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Typography,
  useTheme,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import { LoadingButton } from "@mui/lab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Col,
  Param,
  ParamHeader,
  Permission,
  PermissionColumn,
} from "./typescope";
import usePermission from "@/hooks/usePermission";

const PermissionsRole = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const { id } = useParams();
  const router = useRouter();
  const { hasPermission } = usePermission();
  const [selectedRowsId, setSelectedRowsId] = useState<number[]>([]);

  const {
    data: fetchedRole,
    isSuccess: fetchedRoleSuccessStatus,
    isLoading: fetchedRoleLoadingStatus,
    error: fetchRoleError,
  } = useGetRoleQuery(id);

  const {
    data: permissions,
    isSuccess,
    isLoading,
    isError,
    error: permissionError,
  } = useGetPermissionsQuery("");

  const [
    addPermissionToRole,
    {
      isLoading: addPermissionLoadingStatus,
      isSuccess: addPermissionSuccessStatus,
      data: addPermissionResult,
      error: addPermissionError,
    },
  ] = useAddPermissionToRoleMutation();

  useEffect(() => {
    if (addPermissionSuccessStatus) {
      showToast(addPermissionResult?.message, "success");
    }
    if (addPermissionError) {
      const error: any = addPermissionError;
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [addPermissionLoadingStatus, addPermissionSuccessStatus]);

  useEffect(() => {
    if (fetchedRoleSuccessStatus && fetchedRole?.permissions?.length > 0) {
      const ids = [...fetchedRole?.permissions].map(
        (permission: Permission) => permission.id
      );
      setSelectedRowsId(ids);
    }
  }, [fetchedRoleSuccessStatus]);

  const handleSelectAllColumn = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const allColumnIds = permissions
      .map((permission: PermissionColumn) => permission.cols)
      .flat()
      .filter((column: Col) => column.title === field)
      .map((item: Col) => item.id);

    const newArray = [...new Set([...selectedRowsId, ...allColumnIds])];
    const checkedColumnIds = [...selectedRowsId].filter((rowId) =>
      allColumnIds.includes(rowId)
    );

    event.target.checked
      ? checkedColumnIds.length > 0
        ? setSelectedRowsId(
            selectedRowsId.filter(
              (item: number) => !allColumnIds.includes(item)
            )
          )
        : setSelectedRowsId(newArray)
      : setSelectedRowsId(
          selectedRowsId.filter((item: number) => !allColumnIds.includes(item))
        );
  };

  const handleCheckboxChange = (params: Param) => {
    const cellId = params.row.cols.filter(
      (item: Col) => item.title == params.field
    )[0].id;

    const cellIdIndex = selectedRowsId.indexOf(cellId);

    cellIdIndex === -1
      ? setSelectedRowsId([...selectedRowsId, cellId])
      : setSelectedRowsId([
          ...selectedRowsId.filter((item: number) => item !== cellId),
        ]);
  };

  const handleSelectAllRow = (
    event: React.ChangeEvent<HTMLInputElement>,
    params: Param
  ) => {
    const rowIds = params.row.cols.map((col: Col) => col.id);
    const newArray = [...new Set([...selectedRowsId, ...rowIds])];

    const checkedRowIds = [...selectedRowsId].filter((rowId) =>
      rowIds.includes(rowId)
    );

    event.target.checked
      ? checkedRowIds.length > 0
        ? setSelectedRowsId(
            selectedRowsId.filter((item: number) => !rowIds.includes(item))
          )
        : setSelectedRowsId(newArray)
      : setSelectedRowsId(
          selectedRowsId.filter((item: number) => !rowIds.includes(item))
        );
  };

  const handeleSavePermissions = () => {
    addPermissionToRole({ role_id: id, permission_ids: selectedRowsId });
  };

  const customRenderHeader = (params: ParamHeader, label: string) => {
    const allColumnIds = permissions
      .map((permission: PermissionColumn) => permission.cols)
      .flat()
      .filter((column: Col) => column.title === params.field)
      .map((item: Col) => item.id);

    const checkedItems = [...selectedRowsId].filter((rowId) =>
      allColumnIds.includes(rowId)
    );
    return (
      <FormControl style={{ marginRight: "11px", marginLeft: "-16px" }}>
        <FormControlLabel
          control={
            <Checkbox
              color="success"
              indeterminate={
                checkedItems.length > 0 &&
                checkedItems.length < permissions.length
              }
              disabled={!hasPermission("Role.edit")}
              checked={checkedItems.length === permissions.length}
              onChange={(e) => handleSelectAllColumn(e, params.field)}
            />
          }
          label={label}
        />
      </FormControl>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "col1",
      headerName: "دسترسی",
      width: 200,
      headerAlign: "center",
      // align: "center",
      disableColumnMenu: true,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const rowIds = params.row.cols.map((col: Col) => col.id);
        const checkedRowItems = [...selectedRowsId].filter((rowId) =>
          rowIds.includes(rowId)
        );

        return (
          <>
            <Checkbox
              color="success"
              indeterminate={
                checkedRowItems.length > 0 &&
                checkedRowItems.length < rowIds.length
              }
              disabled={!hasPermission("Role.edit")}
              checked={checkedRowItems.length === rowIds.length}
              onChange={(e) => handleSelectAllRow(e, params)}
            />
            {params.row.rowName}
          </>
        );
      },

      // valueGetter: (permission) => permission.row.rowName,
    },
    {
      field: "index",
      headerName: "",
      width: 120,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: (params, label = "مشاهده") =>
        customRenderHeader(params, label),
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Checkbox
            color="success"
            checked={selectedRowsId.includes(
              params.row.cols.filter(
                (item: Col) => item.title == params.field
              )[0].id
            )}
            disabled={!hasPermission("Role.edit")}
            onChange={() => handleCheckboxChange(params)}
          />
        </>
      ),
    },
    {
      field: "create",
      headerName: "",
      width: 120,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: (params, label = "ایجاد") =>
        customRenderHeader(params, label),
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Checkbox
            color="success"
            checked={selectedRowsId.includes(
              params.row.cols.filter(
                (item: Col) => item.title == params.field
              )[0].id
            )}
            disabled={!hasPermission("Role.edit")}
            onChange={() => handleCheckboxChange(params)}
          />
        </>
      ),
    },
    {
      field: "edit",
      headerName: "",
      width: 120,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: (params, label = "ویرایش") =>
        customRenderHeader(params, label),
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Checkbox
            color="success"
            checked={selectedRowsId.includes(
              params.row.cols.filter(
                (item: Col) => item.title == params.field
              )[0].id
            )}
            disabled={!hasPermission("Role.edit")}
            onChange={() => handleCheckboxChange(params)}
          />
        </>
      ),
    },
    {
      field: "delete",
      headerName: "",
      width: 120,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: (params, label = "حذف") =>
        customRenderHeader(params, label),
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Checkbox
            color="success"
            checked={selectedRowsId.includes(
              params.row.cols.filter(
                (item: Col) => item.title == params.field
              )[0].id
            )}
            disabled={!hasPermission("Role.edit")}
            onChange={() => handleCheckboxChange(params)}
          />
        </>
      ),
    },
  ];

  let content;
  if (fetchedRoleLoadingStatus) {
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

  if (fetchRoleError) {
    const error : any = fetchRoleError;
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="50vh"
        alignItems="center"
      >
         {error?.data?.message ?? error.error}
      </Box>
    );
  }

  let permissionsContent;
  if (isSuccess) {
    permissionsContent = (
      <DataGrid
        sx={{ height: "calc(100vh - 200px)" }}
        // autoHeight
        {...permissions}
        rows={permissions}
        columns={columns}
        loading={isLoading}
        density="compact"
        showColumnVerticalBorder
        showCellVerticalBorder
        hideFooter
        getRowId={(row) => {
          return row.rowName;
        }}
      />
    );
  }

  if (fetchedRoleSuccessStatus) {
    content = (
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
          <Typography
            variant="h4"
            sx={{ display: "flex", alignItems: "center" }}
          >
            {fetchedRole.name}
          </Typography>
          <Box>
            {hasPermission("Role.edit") && (
              <LoadingButton
                size="small"
                disabled={addPermissionLoadingStatus}
                loading={addPermissionLoadingStatus}
                loadingPosition="center"
                type="submit"
                variant="contained"
                sx={{ my: 2, mx: 1 }}
                onClick={handeleSavePermissions}
              >
                ثبت
              </LoadingButton>
            )}
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={() => router.push("/adminpanel/roles")}
            >
              <ArrowBackIcon />
            </Button>
          </Box>
        </Box>
        {permissionsContent}
      </>
    );
  }

  return content;
};

export default PermissionsRole;
