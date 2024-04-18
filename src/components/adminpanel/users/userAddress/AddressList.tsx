import { tokens } from "@/theme";
import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Paper,
  Switch,
  Typography,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import SignpostIcon from "@mui/icons-material/Signpost";
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddressFormModal from "./AddressFormModal";
import ConfirmModal from "@/components/shared/modals/ConfirmModal";
import { useParams } from "next/navigation";
import {
  useAddDefaultAddressMutation,
  useDeleteUserAddressMutation,
  useGetUserAddressesQuery,
} from "@/redux/services/address/userAddressApi";
import { Address } from "../typescope";
import React, { useEffect, useState } from "react";
import useToast from "@/hooks/useToast";

const AddressList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const { id } = useParams();
  const [checkedId , setCheckedId] = useState<number | null>(null)

  const {
    data: addressList,
    isSuccess,
    isLoading,
    isError,
    error : addressListError ,
  } = useGetUserAddressesQuery(id);


  const [
    deleteUserAddress,
    { isSuccess: deleteStatus, isLoading: deleteLoader, data: deleteResult },
  ] = useDeleteUserAddressMutation();

  const [
    addDefaultAddress,
    {
      isSuccess: defaultAddressStatus,
      isLoading: defaultAddressLoader,
      data: defaultAddressResult,
      error: defaultAddressError,
    },
  ] = useAddDefaultAddressMutation();

  const deleteHandler = (id: number): void => {
    deleteUserAddress(id);
  };

  React.useEffect(() => {
    if (deleteStatus) {
      showToast(deleteResult?.message, "success");
    }
  }, [deleteStatus, deleteResult , deleteLoader]);

  const handleDefaultAddress = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    addDefaultAddress(id);
    setCheckedId(id)
  };

  React.useEffect(() => {
    if (defaultAddressStatus) {
      showToast(defaultAddressResult?.message, "success");
    }
    if (defaultAddressError) {
      const error :any = defaultAddressError;
      showToast(error?.data?.message ?? error.error, "error");
    }
  }, [defaultAddressStatus, defaultAddressResult]);

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

  if (addressListError) {
    const error :any = addressListError;
    content = (
      <Box
        display="flex"
        justifyContent="center"
        height="50%"
        alignItems="center"
        mt={2}
      >
        {error?.data?.message ?? error.error}
      </Box>
    );
  }

  if (isSuccess) {
    content =
      addressList.length > 0 ? (
        addressList.map((address: Address) => (
          <Paper
            sx={{
              border: `1px solid ${colors.primary[300]}`,
              borderRadius: "5px",
              marginTop: "10px",
            }}
            key={address.id}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <LocationOnIcon />
                  <Box sx={{ px: 1 }}>{address?.address} </Box>
                </Typography>
                {defaultAddressLoader && checkedId == address?.id ? (
                  <CircularProgress />
                ) : (
                  <Switch
                    color="success"
                    checked={address.is_default == 1}
                    onChange={(e) => handleDefaultAddress(e, address?.id)}
                  />
                )}
              </Box>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mx: 3,
                }}
              >
                کدپستی : {address?.postal_code || "---"}
              </Typography>

              <Box sx={{ display: "flex", mt: 1 }}>
                <AddressFormModal
                  btnTitle="ویرایش"
                  addressId={address?.id}
                  // editeMode = {true}
                  btnStartIcon={<EditLocationAltIcon />}
                />
                <ConfirmModal
                  // modalTitle={user.row.name}
                  description="آیا از حذف مطمئن هستید؟"
                  color="error"
                  icon={<DeleteIcon />}
                  btnTitle="حذف"
                  setter={() => deleteHandler(address.id)}
                  ctaLoader={deleteLoader}
                  btnStyle={{ marginRight: "10px" }}
                />
              </Box>
            </CardContent>
          </Paper>
        ))
      ) : (
        <Paper
          sx={{
            border: `1px solid ${colors.primary[300]}`,
            borderRadius: "5px",
            marginTop: "10px",
          }}
        >
          <CardContent>آدرسی ثبت نگردیده است!</CardContent>
        </Paper>
      );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${colors.primary[300]}`,
          paddingBottom: "10px",
        }}
      >
        <Typography variant="h4">لیست آدرس ها</Typography>
        <AddressFormModal
          btnTitle="افزودن آدرس"
          btnStartIcon={<AddLocationAltIcon />}
          color="success"
          // onConfirm={(values, e) => handleAddAddress(values, e)}
          // responseSuccess = {addAddressSuccess}
        />
      </Box>
      {content}
    </>
  );
};

export default AddressList;
