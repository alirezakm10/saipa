"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAddProductMutation } from "@/redux/services/shop/productsApi";
import {
  TextField,
  Typography,
  Grid,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Paper,
  MenuItem,
  InputLabel,
  Select,
  LinearProgress,
  Button,
  useTheme,
  Box,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Editor from "@/components/shared/editor/tinymc/Editor";
import CategoryBox from "../productModules/CategoryBox";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  setProduct,
  selectedProduct,
} from "@/redux/features/shop/productSlice";
import useToast from "@/hooks/useToast";
import { useGetBrandsListQuery } from "@/redux/services/shop/productsClassificationApi";
import { useGetCategoryQuery } from "@/redux/services/shop/productsClassificationApi";
import { IBrand } from "../typescope";
import { DateObject } from "react-multi-date-picker";
import english from "react-date-object/calendars/gregorian";
import english_en from "react-date-object/locales/gregorian_en";
import { Form, Formik, useFormik } from "formik";
import { ISpecification } from "../typescope";
import { addProductSchema } from "./addProductSchema";
import Dropzone from "@/components/shared/uploader/Dropzone";
import { SpecialStatus, ProductStatus } from "../typescope";
import PhotoSizeSelectSmallOutlinedIcon from '@mui/icons-material/PhotoSizeSelectSmallOutlined';
import { tokens } from "@/theme";
import DefaultModal from "@/components/shared/modals/DefaultModal";
import Classification from "../classification/Classification";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice";
import { selectedKeywords } from "@/redux/features/keywordsCatcherSlice";
import { KeywordsBox } from "../../sharedAdminModules";
import { selectedEditorContent, setEditorContent } from "@/redux/features/editorSlice";
import { useGetGuarantiesQuery } from "@/redux/services/shop/guaranteeApi";
import { useRouter } from "next/navigation";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DynamicAttachPreview from "../../filemanager/DynamicAttachPreview";



const AddProduct = () => {
  const router = useRouter()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const showToast = useToast();
  const dispatch = useAppDispatch();
  const editorContent = useAppSelector(selectedEditorContent)
  const product = useAppSelector(selectedProduct);
  const [date, setDate] = useState<DateObject>(new DateObject());
  const categoryBoxRef = useRef<HTMLDivElement | null>(null);
  const [scrolledToCategoryBox, setScrolledToCategoryBox] = useState(false);
  const [classificationModal, setClassificationModal] =
    useState<boolean>(false);
  const pickedFiles = useAppSelector(selectPickedForMainAttach)
  const selectedKeys = useAppSelector(selectedKeywords)
  const {
    data: inpTypes,
    isSuccess: inpStatus,
    isLoading: inpLoader,
    isFetching: inpFetching,
  } = useGetCategoryQuery(product?.category_id, {
    refetchOnMountOrArgChange: true,
  });

  const [
    addProduct,
    {
      isSuccess: addStatus,
      isLoading: addLoader,
      data: addResult,
      error,
      isError,
    },
  ] = useAddProductMutation<any>();

  const {
    data: guaranties,
    isSuccess: guarantiesStatus,
    isLoading: guarantiesLoader,
    isFetching: guarantiesFetching,
  } = useGetGuarantiesQuery('', {
    refetchOnMountOrArgChange: true,
  })



  const {
    data: brandsList,
    isSuccess: brandsStatus,
    isLoading: brandsLoader,
    isFetching: brandsFetching,
  } = useGetBrandsListQuery(undefined);



  useEffect(() => {
    dispatch(setProduct({}))
    return () => {
      dispatch(setEditorContent(''))
    }
  }, []);


  useEffect(() => {
    if (addStatus) {
      showToast(addResult?.message, "success")
      router.push('/adminpanel/shop/allproducts')
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
          pb: 1,
          mb: 1,
          borderBottom: `1px solid ${colors.primary[300]}`,
        }}
      >
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
          افزودن محصول
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
        <Formik
          initialValues={{
            is_active: 0,
            is_special: 0,
            title: "",
            brand_id: "",
            guarantee_id: "",
            model: "",
            price: null,
            meta_title: "",
            meta_description: "",
            short_description: "",
            specifications:
              inpTypes?.specifications.map((eachInp: ISpecification) => ({
                specification_id: eachInp.id,
                value: "",
              })) || [],
          }}
          validationSchema={addProductSchema} //{addProductSchema}
          onSubmit={async (values) => {
          
            addProduct({
              // @ts-ignore
              ...values, guarantee_id: values.guarantee_id.id,
              category_id: product?.category_id,
              images: pickedFiles, keywords: selectedKeys, body: editorContent,
              publish_time: new DateObject(date)
                .convert(english, english_en)
                .format("YYYY/MM/DD HH:mm:ss")
            })
          }}
        >
          {({ handleChange, values, touched, getFieldProps, errors, handleBlur, setFieldValue }) => (
            <Form>
              <Grid
                container
                spacing={2}
                my={2}
              >

                <Grid item xs={12} >
                  <Typography
                    component="h1"
                    variant='body1'
                    sx={{
                      color: !product?.category_id ? 'red' : ''
                    }}
                  >دسته انتخاب شده: {product?.category_name}</Typography>
                </Grid>



                {/* is special */}
                <Grid item xs={12} md={12} >
                  <FormControl>
                    <FormLabel>نوع محصول</FormLabel>
                    <RadioGroup
                      name="is_active"
                      value={values.is_active}
                      onChange={handleChange}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        control={<Radio />}
                        label='عادی'
                      />
                      <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label='ویژه'
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                {/* is active */}
                <Grid item xs={12} md={12} >
                  <FormControl>
                    <FormLabel>حالت انتشار</FormLabel>
                    <RadioGroup
                      name="is_special"
                      value={values.is_special}
                      onChange={handleChange}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2
                      }}
                    >
                      <FormControlLabel
                        value={0}
                        control={<Radio />}
                        label='پیش نویس'
                      />
                      <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label='منتشر شده'
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <InputLabel sx={{ my: 1 }} >
                    انتخاب گارانتی
                  </InputLabel>
                  <FormControl fullWidth>
                    <Select
                      value={values.guarantee_id}
                      name="guarantee_id"
                      // label={chooseGuarantee?.code}
                      onChange={handleChange}
                    >
                      {
                        guaranties?.map((guarantee: any, idx: number) => (
                          <MenuItem key={idx} value={guarantee}>{guarantee?.name}</MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
                </Grid>

                <Grid xs={12} md={12} item>
                  <Button
                    variant="outlined"
                    onClick={() => setClassificationModal((prev) => !prev)}
                    endIcon={<CategoryOutlinedIcon />}
                  >
                    ویرایشگر دسته بندی
                  </Button>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="title"
                    label={`نام محصول${touched.title && errors.title
                      ? ` (${errors.title})`
                      : ""
                      }`}
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && errors.title ? true : false}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>انتخاب برند</InputLabel>
                    <Select
                      id="brand_id"
                      label="انتخاب برند"
                      {...getFieldProps("brand_id")} // Use Formik's getFieldProps for the select input
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.brand_id && errors.brand_id
                          ? true
                          : false
                      }
                    >
                      {brandsList?.map((eachBrand: IBrand, idx: number) => (
                        <MenuItem key={idx} value={eachBrand.id}>
                          {eachBrand.title}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="model"
                    label="مدل"
                    value={values.model} // Use the title state as the value
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="price"
                    type="number"
                    label="قیمت - ریال"
                    value={values.price} // Use the title state as the value
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.price && errors.price ? true : false}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="meta_title"
                    label="نام متا"
                    value={values.meta_title} // Use the title state as the value
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="meta_description"
                    label="توضیحات متا"
                    value={values.meta_description} // Use the title state as the value
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    id="short_description"
                    label="خلاصه نوشته"
                    value={values.short_description} // Use the title state as the value
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      touched.short_description &&
                        errors.short_description
                        ? true
                        : false
                    }
                    fullWidth
                    multiline
                  />
                </Grid>
                {inpFetching ? (
                  // Render a loading indicator here while data is being fetched
                  <LinearProgress />
                ) : (
                  inpTypes?.specifications &&
                  inpTypes?.specifications.length > 0 &&
                  inpTypes.specifications.map(
                    (eachInp: ISpecification, idx: number) => (
                      <Grid item xs={12} md={4} key={eachInp.id}>
                        <TextField
                          id={eachInp.id.toString()}
                          label={eachInp.title}
                          value={values.specifications[idx]?.value || ""} // Access the value from the array of objects
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const newSpecifications = [
                              ...values.specifications,
                            ];
                            newSpecifications[idx] = {
                              specification_id: eachInp.id,
                              value: e.currentTarget.value, // Update the value in the array of objects
                            };
                            setFieldValue("specifications", newSpecifications);
                          }}
                          fullWidth
                          multiline
                        />
                      </Grid>
                    )
                  )
                )}


                <Grid xs={12} item >
                  <Button onClick={() => dispatch(setShowFilemanager(['mainAttach']))} variant="outlined" startIcon={<AttachFileIcon />}>
                    افزودن عکس شاخص
                  </Button>
                </Grid>
                <Grid xs={12} item >
                  <DynamicAttachPreview fileType={['image']} />
                </Grid>

                <Grid xs={12} item>
                  <LoadingButton
                    size="small"
                    disabled={addLoader}
                    color="success"
                    loading={addLoader}
                    loadingPosition="center"
                    // startIcon={<SaveIcon />}
                    variant="contained"
                    sx={{ my: 2 }}
                    type="submit"
                  >
                    ثبت محصول
                  </LoadingButton>
                </Grid>
              </Grid>
            </Form>
          )
          }
        </Formik>
      </Paper>

      <Grid container spacing={2} sx={{ position: "relative" }}>
        <Grid xs={12} md={9} item>
          <Editor />
        </Grid>
        <Grid xs={12} md={3} item>
          <Grid container spacing={2}>
            <Grid
              className={scrolledToCategoryBox ? "pulse-element" : ""}
              ref={categoryBoxRef}
              xs={12}
              item
            >
              <CategoryBox />
            </Grid>
            <Grid xs={12} item>
              <KeywordsBox />
            </Grid>
          </Grid>
        </Grid>

      </Grid>

      <DefaultModal
        open={classificationModal}
        setter={() => setClassificationModal((prev) => !prev)}
      >
        <Classification />
      </DefaultModal>

      {/*  end of form grid */}
    </>
  );
};

export default AddProduct;
