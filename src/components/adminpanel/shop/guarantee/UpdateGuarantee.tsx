"use client";
import { useState, useEffect, useRef } from "react";
import {
  useGetGuaranteeQuery,
  useUpdateGuaranteeMutation,
} from "@/redux/services/shop/guaranteeApi";
import {
  TextField,
  Typography,
  Grid,
  Divider,
  InputLabel,
  Box,
  useTheme,
  Paper,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  setContent,
  selectedContent,
} from "@/redux/features/contents/contentsSlice";
import useToast from "@/hooks/useToast";
import { useFormik } from "formik";
import { tokens } from "@/theme";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

const UpdateGuarantee: React.FC<Props> = ({ id }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter()
  const showToast = useToast();
  const dispatch = useAppDispatch();
  const {
    data: fetchedGuarantee,
    isSuccess,
    isLoading,
  } = useGetGuaranteeQuery(id);
  const [
    updateGuarantee,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error,
      isError,
    },
  ] = useUpdateGuaranteeMutation<any>();
  const guarantee = useAppSelector(selectedContent);

  const formik = useFormik({
    initialValues: {
      name: fetchedGuarantee?.name,
      duration: fetchedGuarantee?.duration,
      description: fetchedGuarantee?.description,
    },
    // validate form
    validationSchema: false,
    enableReinitialize:true,
    // submit form
    onSubmit: (values) => {
      updateGuarantee({ id, patch: { ...values } });
    },
  });

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success");
      router.push(`/adminpanel/shop/guarantee`)
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);

  useEffect(() => {
    if (isSuccess) dispatch(setContent(fetchedGuarantee));
  }, [isSuccess]);

  let content;

  if (isSuccess) {
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
            ویرایش گارانتی
          </Typography>
        </Box>
        <Paper
          sx={{
            px: 1,
            border: `1px solid ${colors.primary[300]}`,
            borderRadius: "5px",
            mb: 1,
          }}
        >
          <Grid
            container
            spacing={1}
            my={2}
            component="form"
            autoComplete="off"
            onSubmit={formik.handleSubmit}
          >
            <Grid item xs={12} md={4}>
              <InputLabel sx={{ my: 1 }}>نام گارانتی</InputLabel>
              <TextField
                label={fetchedGuarantee?.name}
                id="name"
                name="name"
                value={formik.values.name} // Use the title state as the value
                onChange={formik.handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <InputLabel sx={{ my: 1 }}>مدت زمان (روز)</InputLabel>
              <TextField
                label={fetchedGuarantee?.duration}
                id="duration"
                name="duration"
                value={formik.values.duration} // Use the title state as the value
                onChange={formik.handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <InputLabel sx={{ my: 1 }}>توضیحات</InputLabel>
              <TextField
                label={
                  fetchedGuarantee?.description
                    ? fetchedGuarantee?.description
                    : "تعریف نشده"
                }
                id="description"
                name="description"
                value={formik.values.description} // Use the title state as the value
                onChange={formik.handleChange}
                multiline
                fullWidth
              />
            </Grid>
            <Grid sx={{px:1}} xs={12}>
              <LoadingButton
                size="small"
                disabled={updateLoader}
                loading={updateLoader}
                loadingPosition="center"
                // startIcon={<SaveIcon />}
                variant="contained"
                sx={{ my: 2 }}
                type="submit"
              >
                بروزرسانی
              </LoadingButton>
            </Grid>
          </Grid>
        </Paper>
      </>
    );
  }

  return content;
};

export default UpdateGuarantee;
