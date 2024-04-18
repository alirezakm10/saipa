import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {
  Autocomplete,
  Backdrop,
  Box,
  CircularProgress,
  Fade,
  Grid,
  Modal,
  Paper,
  useTheme,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "@/components/adminpanel/users/style.module.scss";
import {
  useGetCitiesQuery,
  useGetProvincesQuery,
} from "@/redux/services/address/addressClassificationApi";
import useToast from "@/hooks/useToast";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import { Address } from "../typescope";
import {
  useAddUserAddressMutation,
  useGetUserAddressQuery,
  useUpdateUserAddressMutation,
} from "@/redux/services/address/userAddressApi";
import { addressValidationSchema } from "../validationSchema";

interface Props {
  btnTitle?: string;
  btnStartIcon?: any;
  confirmBtnTitle?: string;
  cancelBtnTitle?: string;
  addressId?: number | undefined;
  editeMode?: boolean;
  color?: "success" | "error" | "warning" | "info" | "secondary";
  // onConfirm: (e: any, value: any) => void;
}

interface OptionType {
  title: string;
  id: number;
}

const AddressFormModal: React.FC<Props> = ({
  btnTitle,
  btnStartIcon = "",
  color,
  confirmBtnTitle = "ثبت",
  cancelBtnTitle = "انصراف",
  addressId,
}) => {
  const { id: userId } = useParams();
  const showToast = useToast();

  const [open, setOpen] = React.useState<boolean>(false);
  const [provinceInputValue, setProvinceInputValue] = React.useState<any>(null);
  const [cityInputValue, setCityInputValue] = React.useState<any>(null);
  const [provinceId, setProvinceId] = React.useState<any>(null);
  const [cityId, setCityId] = React.useState<any>(null);

  const formik = useFormik({
    initialValues: {
      user_id: Number(userId),
      city_id: null,
      address: "",
      postal_code: "",
    },
    validationSchema: addressValidationSchema,
    onSubmit: (values) => {
      let id;
      if (values.city_id) {
        ({ id } = values.city_id);
      }

      if (addressId) {
        updateAddress({ id: addressId, body: { ...values, city_id: id } });
      } else {
        addUserAddress({ ...values, city_id: id });
      }
    },
  });

  const {
    data: provincesList,
    isSuccess: provincesStatus,
    isLoading: provincesLoading,
    isError: provinceErrorStatus,
    error: provincesError,
    refetch: refetchProvinces,
  } = useGetProvincesQuery("", {
    refetchOnMountOrArgChange: true,
    skip: !open,
  });

  const {
    data: citiesList,
    isSuccess: citiesStatus,
    isLoading: citiesLoading,
    isError: cityErrorStatus,
    error: citiesError,
    refetch: refetchCities,
  } = useGetCitiesQuery(provinceId, {
    refetchOnMountOrArgChange: true,
    skip: !provinceId,
  });

  const {
    data: userAddress,
    isSuccess: userAddressSuccess,
    isLoading: userAddressLoading,
    isError: userAddressErrorStatus,
    error: userAddressError,
    refetch: refetchUserAddress,
  } = useGetUserAddressQuery(addressId, {
    // refetchOnMountOrArgChange: true,
    skip: !addressId || !open,
  });

  React.useEffect(() => {
    if (userAddress?.city?.parent) {
      setProvinceInputValue(userAddress.city.parent);
      setCityInputValue(userAddress.city);
      setProvinceId(userAddress.city.parent.id);
      // setCityId(userAddress.city.id);
      formik.setValues({
        ...formik.values,
        city_id: userAddress.city,
        address: userAddress.address || "",
        postal_code: userAddress.postal_code || "",
      });
    }
    // setProvinceInputValue()
  }, [userAddress, open]);

  const [
    addUserAddress,
    {
      isLoading: addAddressLoading,
      isSuccess: addAddressSuccess,
      data: addAddressData,
      error: addAddressError,
    },
  ] = useAddUserAddressMutation<any>();

  const [
    updateAddress,
    {
      isLoading: updateAddressLoading,
      isSuccess: updateAddressSuccess,
      data: updateAddressData,
      error: updateAddressError,
    },
  ] = useUpdateUserAddressMutation<any>();

  React.useEffect(() => {
    if (addAddressSuccess || updateAddressSuccess) {
      if (addAddressData?.message) {
        showToast(addAddressData?.message, "success");
      }
      if (updateAddressData.message) {
        showToast(addAddressData?.message, "success");
      }

      handleClose();
    }

    if (addAddressError) {
      const errMsg = addAddressError?.data?.message ?? addAddressError.error;
      showToast(errMsg, "error");
    }

    if (updateAddressError) {
      const errMsg =
        updateAddressError?.data?.message ?? updateAddressError.error;
      showToast(errMsg, "error");
    }
  }, [addAddressLoading, updateAddressLoading]);

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
    setProvinceInputValue(null);
    setCityInputValue(null);
  };

  // const handleConfirm = (e: any) => {
  //   onConfirm(e, "this is confirm value");
  // };

  const handleProvinceChange = (e: any, newValue: any) => {
    setProvinceInputValue(newValue);
    setCityInputValue(null);
    // setCityId(null);
    formik.setFieldValue("city_id", null);
    if (newValue?.id) {
      setProvinceId(newValue?.id);
    }
  };

  let content;

  content = (
    <div>
      <Button
        variant="contained"
        color={color}
        startIcon={btnStartIcon}
        onClick={() => {
          setOpen(true);
        }}
      >
        {btnTitle}
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        // onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Paper
            sx={{ minWidth: "300px", maxWidth: "500px" }}
            className={styles.modal}
          >
            <form autoComplete="off" onSubmit={formik.handleSubmit}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Autocomplete
                    id="province"
                    autoHighlight
                    value={provinceInputValue}
                    onChange={handleProvinceChange}
                    options={provincesList?.length > 0 ? provincesList : []}
                    getOptionLabel={(option: OptionType) => option.title || ""}
                    noOptionsText={"نتیجه ای یافت نشد."}
                    loading={provincesLoading}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    renderOption={(props, option) => {
                      return (
                        <li {...props} key={option.id}>
                          {option.title}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="استان"
                        name="province"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {provincesLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    id="city"
                    autoHighlight
                    options={citiesList?.length > 0 ? citiesList : []}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    getOptionLabel={(option: OptionType) => option.title || ""}
                    noOptionsText={"نتیجه ای یافت نشد."}
                    loading={citiesLoading}
                    disabled={!provinceInputValue}
                    value={cityInputValue}
                    onChange={(event, newValue) => {
                      setCityId(newValue?.id || null);
                      setCityInputValue(newValue);

                      formik.setFieldValue("city_id", newValue);
                    }}
                    renderOption={(props, option) => {
                      return (
                        <li {...props} value={option.id} key={option.id}>
                          {option.title}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="شهر"
                        name="city"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {citiesLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.city_id &&
                          Boolean(formik.errors.city_id)
                        }
                        helperText={
                          formik.touched.city_id && formik.errors.city_id
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="کدپستی"
                    name="postal_code"
                    sx={{ width: "100%" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.postal_code}
                    error={
                      formik.touched.postal_code &&
                      Boolean(formik.errors.postal_code)
                    }
                    helperText={
                      formik.touched.postal_code && formik.errors.postal_code
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="address"
                    label="آدرس"
                    name="address"
                    multiline
                    maxRows={4}
                    sx={{ width: "100%" }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                    error={
                      formik.touched.address && Boolean(formik.errors.address)
                    }
                    helperText={formik.touched.address && formik.errors.address}
                  />
                </Grid>
              </Grid>

              <LoadingButton
                loading={addAddressLoading}
                disabled={addAddressLoading}
                loadingPosition="center"
                type="submit"
                variant="contained"
                sx={{ my: 2 }}
              >
                {confirmBtnTitle}
              </LoadingButton>
              <Button
                onClick={handleClose}
                sx={{ mx: 1 }}
                variant="contained"
                color="error"
              >
                {cancelBtnTitle}
              </Button>
            </form>
          </Paper>
        </Fade>
      </Modal>
    </div>
  );

  return content;
};

export default AddressFormModal;
