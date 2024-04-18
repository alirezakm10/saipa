 'use client'
import useToast from "@/hooks/useToast";
import { useGetSubjectsQuery } from "@/redux/services/tickets/subjectApi";
import { tokens } from "@/theme";
import { LoadingButton } from "@mui/lab";
import { useDebounce } from "@uidotdev/usehooks";
import {
  Autocomplete,
  Box,
  Button,
  CardContent,
  Grid,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { OptionType, TicketFields } from "./typescope";
import { useSearchUserQuery } from "@/redux/services/users/usersApi";
import AutocompleteRoleInput from "@/components/shared/AutocompleteRoleInput";
import Priority from "./Priority";
import { useFormik } from "formik";
import { useCreateTicketMutation } from "@/redux/services/tickets/ticketApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice"
import { ticketSchema } from "./ticketSchema";
import DynamicAttachPreview from "../filemanager/DynamicAttachPreview"
import AttachFileIcon from '@mui/icons-material/AttachFile'


const CreateTicket = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const router = useRouter();
  const showToast = useToast();
  const [subjectValue, setSubjectValue] = useState<
    OptionType | null | undefined
  >(null);
  const [skip, setSkip] = useState<boolean>(true);
  const [data, setData] = useState<any>([]);
  const [searchValue, setSearchValue] = useState<any>(null);
  const [query, setQuery] = useState<string | null>("");

  const dispatch = useAppDispatch();

  const debouncedSearchQuery: any = useDebounce(query, 500);

  const [
    createTicket,
    {
      isLoading: ticketLoading,
      isSuccess: ticketSuccess,
      data: ticketData,
      error: ticketError,
    },
  ] = useCreateTicketMutation();

  const pickedFiles = useAppSelector(selectPickedForMainAttach)


  const formik = useFormik<TicketFields>({
    initialValues: {
      title: "",
      subject_id: null,
      role_id: null,
      user_id: null,
      priority: null,
      content: "",
      files: [],
    },
    validationSchema: ticketSchema,
    onSubmit: (values) => {
      createTicket({
        ...values,
        files: pickedFiles.map((file:any) => ({ id: file.id })),
      });
    },
  });


  React.useEffect(() => {
    if (ticketSuccess) {
      const successMsg = ticketData?.message;
      showToast(successMsg, "success");
      router.back();
    }
    if (ticketError) {
      const error: any = ticketError;
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [ticketError, ticketSuccess]);

  const {
    data: subjectList,
    isSuccess: subjectSuccess,
    isLoading: subjectLoading,
    isError: subjectErrorStatus,
    error: subjectError,
  } = useGetSubjectsQuery("");

  const {
    data: searchUserResult,
    isSuccess: searchedUserSuccess,
    isLoading: searchedUserLoading,
    isFetching: searchUserFetching,
    isError: searchedUserError,
  } = useSearchUserQuery(debouncedSearchQuery, {
    skip: debouncedSearchQuery?.length < 3,
  });

  useEffect(() => {
    if (subjectError) {
      const error: any = subjectError;
     showToast(error.data?.message ?? "خطایی رخ داده است!", "error")
    }
  }, [subjectLoading, subjectSuccess, subjectError]);

  const handleChangeSubject = (event: any, newValue: OptionType | null) => {
    setSubjectValue(newValue);
    formik.setFieldValue("subject_id", newValue?.id);
  };

  useEffect(() => {
    searchedUserSuccess ? setData(searchUserResult) : setData([]);
  }, [searchedUserSuccess, searchUserResult]);

  const handleSearchChange = (event: any, newValue: any) => {
    setSearchValue(newValue);
    formik.setFieldValue("user_id", newValue?.id);
  };

  const handleSearchQuery = (event: any, newValue: string) => {
    setQuery(newValue);
  };

  const handleChangeRole = (event: any, selectedRole: OptionType | null) => {
    formik.setFieldValue("role_id", selectedRole?.id);
  };

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
        <Typography variant="h4">ایجاد تیکت</Typography>
      </Box>

      <Paper
        sx={{
          border: `1px solid ${colors.primary[300]}`,
          borderRadius: "5px",
          mt: 2,
        }}
      >
        <CardContent sx={{}}>
          <form
            style={{
              width: "100%",
            }}
            autoComplete="off"
            onSubmit={formik.handleSubmit}
          >
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="عنوان پیام"
                  name="title"
                  sx={{ width: "100%", my: 1 }}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // value={formik.values.name}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Autocomplete
                  value={subjectValue}
                  onChange={handleChangeSubject}
                  loading={subjectLoading}
                  id="subject"
                  options={subjectList?.length > 0 ? subjectList : []}
                  getOptionLabel={(option: OptionType) => option.name || ""}
                  noOptionsText={"نتیجه ای یافت نشد."}
                  //   isOptionEqualToValue={(option, value) =>
                  //     option.id === value.id
                  //   }
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id}>
                        {option.name}
                      </li>
                    );
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="موضوع"
                      name="subject_id"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      sx={{ my: 1 }}
                      error={
                        formik.touched.subject_id &&
                        Boolean(formik.errors.subject_id)
                      }
                      helperText={
                        formik.touched.subject_id && formik.errors.subject_id
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  freeSolo
                  value={searchValue}
                  onChange={handleSearchChange}
                  onInputChange={handleSearchQuery}
                  // inputValue={query || ""}
                  loading={searchedUserLoading}
                  id="searchQuery"
                  autoComplete
                  options={data?.length > 0 ? data : []}
                  getOptionLabel={(option: any) =>
                    `${option.name || ""}-${option.profile?.family || ""}( ${
                      option.email || ""
                    } )- ${option.mobile || ""}`
                  }
                  // noOptionsText={"نتیجه ای یافت نشد."}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  renderOption={(props, option) => {
                    return data?.length > 0 ? (
                      <li
                        style={{ display: "block" }}
                        {...props}
                        key={option.id}
                      >
                        <span>{option.name}</span>-
                        <span>{option.profile?.family}</span>
                        <span>({option.email})</span>
                        <Box sx={{ color: "gray", display: "block" }}>
                          {option.mobile}
                        </Box>
                      </li>
                    ) : null;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="گیرنده"
                      name="user_id"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      InputProps={{ ...params.InputProps }}
                      sx={{ mb: 1 }}
                      placeholder="برای جستجو کاربر حداقل سه کاراکتر وارد کنید...."
                      error={
                        formik.touched.user_id &&
                        Boolean(formik.errors.user_id)
                      }
                      helperText={
                        formik.touched.user_id && formik.errors.user_id
                      }
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <AutocompleteRoleInput
                  label="دپارتمان"
                  handleAutocompleteChange={handleChangeRole}
                  name="role_id"
                  errorFormik={
                    formik.touched.role_id &&
                    Boolean(formik.errors.role_id)
                  }
                  helperText={
                    formik.touched.role_id && formik.errors.role_id
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Priority
                  width="100%"
                  setPriorityFieldValue={formik.setFieldValue}
                  label="اولویت"
                  name="priority"
                  errorFormik={
                    formik.touched.priority &&
                    Boolean(formik.errors.priority)
                  }
                  helperText={
                    formik.touched.priority && formik.errors.priority
                  }
                />
              </Grid>


              <Grid xs={12} item >
                  <Button onClick={() => dispatch(setShowFilemanager(['mainAttach']))} variant="outlined" startIcon={<AttachFileIcon />}>
                    افزودن فایل شاخص
                  </Button>
                </Grid>
                <Grid xs={12} item >
                  <DynamicAttachPreview fileType={['image']} />
                </Grid>


              <Grid item xs={12}>
                <TextField
                  id="content"
                  label="پیام"
                  name="content"
                  placeholder="پیام خود را تایپ کنید..."
                  multiline
                  rows={6}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  sx={{ width: "100%" }}
                  error={
                    formik.touched.content &&
                    Boolean(formik.errors.content)
                  }
                  helperText={
                    formik.touched.content && formik.errors.content
                  }
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <LoadingButton
                size="small"
                loading={ticketLoading}
                loadingPosition="center"
                type="submit"
                variant="contained"
                sx={{ my: 2, mx: 1 }}
              >
                ثبت
              </LoadingButton>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => router.back()}
              >
                انصراف
              </Button>
            </Box>
          </form>
        </CardContent>
      </Paper>
    </>
  );
};

export default CreateTicket;
