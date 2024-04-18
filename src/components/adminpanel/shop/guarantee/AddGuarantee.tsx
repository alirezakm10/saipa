"use client";
import { useEffect } from "react";
import {
  useAddGuaranteeMutation,
} from "@/redux/services/shop/guaranteeApi";
import {
  TextField,
  Typography,
  Grid,
  Box,
  useTheme,
  Paper,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import useToast from "@/hooks/useToast";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { tokens } from "@/theme";

const AddGuarantee: React.FC = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const showToast = useToast();
  const router = useRouter();

  const [
    addGuarantee,
    {
      isSuccess: addStatus,
      isLoading: addLoader,
      data: addResult,
      error,
      isError,
    },
  ] = useAddGuaranteeMutation<any>();

  const formik = useFormik({
    initialValues: {
      name: "",
      duration: 0,
      description: "",
    },
    // validate form
    validationSchema: false,
    // submit form
    onSubmit: (values) => {
      addGuarantee(values);
    },
  });

  useEffect(() => {
    if (addStatus) {
      showToast(addResult?.message, "success")
      router.push(`/adminpanel/shop/guarantee`)
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [addStatus, addResult, error]);

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
          افزودن گارانتی
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
            <TextField
              label="نام گارانتی"
              id="name"
              name="name"
              value={formik.values.name} // Use the title state as the value
              onChange={formik.handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="مدت زمان (روز)"
              id="duration"
              name="duration"
              value={formik.values.duration} // Use the title state as the value
              onChange={formik.handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              label="توضیحات"
              id="description"
              name="description"
              value={formik.values.description} // Use the title state as the value
              onChange={formik.handleChange}
              multiline
              fullWidth
            />
          </Grid>
          <Grid sx={{ px: 1 }} xs={12}>
            <LoadingButton
              size="small"
              disabled={addLoader}
              loading={addLoader}
              loadingPosition="center"
              // startIcon={<SaveIcon />}
              variant="contained"
              sx={{ my: 2 }}
              type="submit"
            >
              افزودن
            </LoadingButton>
          </Grid>
        </Grid>
      </Paper>

    </>
  );
};

export default AddGuarantee;
