"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAddProductMutation, useGetProductQuery, useUpdateProductMutation } from "@/redux/services/shop/productsApi";
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
  Skeleton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import Editor from "@/components/shared/editor/tinymc/Editor";
import CategoryBox from "../productModules/CategoryBox";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  selectedProduct,
  setSpecificationPersistence,
  selectedPersistedSpecification,
} from "@/redux/features/shop/productSlice";
import useToast from "@/hooks/useToast";
import { useGetBrandsListQuery } from "@/redux/services/shop/productsClassificationApi";
import { useGetCategoryQuery } from "@/redux/services/shop/productsClassificationApi";
import { DateObject } from "react-multi-date-picker";
import english from "react-date-object/calendars/gregorian";
import english_en from "react-date-object/locales/gregorian_en";
import { FieldArray, Form, Formik, useFormik } from "formik";
import { ISpecification } from "../typescope";
import { updateProductSchema } from "./updateProductSchema"
import { SpecialStatus, ProductStatus } from "../typescope"
import { tokens } from "@/theme";
import DefaultModal from "@/components/shared/modals/DefaultModal";
import Classification from "../classification/Classification";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import { selectPickedForMainAttach, setShowFilemanager } from "@/redux/features/filemanagerSlice";
import { selectedKeywords } from "@/redux/features/keywordsCatcherSlice";
import { KeywordsBox } from "../../sharedAdminModules";
import { selectedEditorContent, setEditorContent } from "@/redux/features/editorSlice";
import { useGetGuarantiesQuery } from "@/redux/services/shop/guaranteeApi";
import Image from "next/image";
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DynamicAttachPreview from "../../filemanager/DynamicAttachPreview";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

const UpdateProduct: React.FC<Props> = ({ id }) => {
  const router = useRouter()
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const editorContent = useAppSelector(selectedEditorContent)
  const showToast = useToast();
  const [isActive, setIsActive] = useState<ProductStatus>(ProductStatus.DRAFT);
  const [isSpecial, setIsSpecial] = useState<SpecialStatus>(
    SpecialStatus.DEFAULT
  );
  const product = useAppSelector(selectedProduct);
  const [date, setDate] = useState<DateObject>(new DateObject());
  const categoryBoxRef = useRef<HTMLDivElement | null>(null);
  const [scrolledToCategoryBox, setScrolledToCategoryBox] = useState(false);
  const [classificationModal, setClassificationModal] =
    useState<boolean>(false);
  const pickedFiles = useAppSelector(selectPickedForMainAttach)
  const selectedKeys = useAppSelector(selectedKeywords);
  const {
    data: fetchedProduct,
    isSuccess: productStatus,
    isLoading: productLoader,
    isFetching: productFetching,
  } = useGetProductQuery(id,{
    refetchOnMountOrArgChange:true
  });

  const {
    data: inpTypes,
    isSuccess: inpStatus,
    isLoading: inpLoader,
    isFetching: inpFetching,
  } = useGetCategoryQuery(product?.category_id, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: guaranties,
    isSuccess: guarantiesStatus,
    isLoading: guarantiesLoader,
    isFetching: guarantiesFetching,
  } = useGetGuarantiesQuery('', {
    refetchOnMountOrArgChange: true,
  })




  const [
    updateProduct,
    {
      isSuccess: updateStatus,
      isLoading: updateLoader,
      data: updateResult,
      error,
      isError,
    },
  ] = useUpdateProductMutation<any>();

  const {
    data: brandsList,
    isSuccess: brandsStatus,
    isLoading: brandsLoader,
    isFetching: brandsFetching,
  } = useGetBrandsListQuery("");

  useEffect(() => {
    if (productStatus) {
      dispatch(setSpecificationPersistence(fetchedProduct.specifications));
      console.log('product: ', fetchedProduct)
    }
  }, [productStatus]);



  useEffect(() => {
    if (inpStatus) {
      dispatch(
        setSpecificationPersistence(
          inpTypes?.specifications.map((eachObj: ISpecification) => {
            return {
              specification_id: eachObj.id,
              title: eachObj.title,
              value: "",
            };
          })
        )
      )
    }
  }, [product, inpStatus, inpTypes, dispatch]);

  useEffect(() => {
    if (updateStatus) {
      showToast(updateResult?.message, "success")
      router.push('/adminpanel/shop/allproducts')
    }
    if (error) {
      const errMsg = error?.data?.message ?? error.error;
      showToast(errMsg, "error");
    }
  }, [updateStatus, updateResult, error]);


  useEffect(() => {
    // cause of complexity of project strategies you should clear your stashed data from some components on component unmount to avoid replace theme with fresh data in another component editor and file manager 
    // features are some of them if you are a new developer see more slice states inside features of redux of fileManager slice and editor and some other places
    return () => {
      dispatch(setEditorContent(''))
    }
  }, [])


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
            is_active: String(fetchedProduct?.is_active),
            is_special: String(fetchedProduct?.is_special),
            title: fetchedProduct?.title,
            brand_id: fetchedProduct?.brand.id,
            guarantee_id: fetchedProduct?.guarantee.id,
            model: fetchedProduct?.model,
            price: fetchedProduct?.price,
            meta_title: fetchedProduct?.meta_title,
            meta_description: fetchedProduct?.meta_description,
            short_description: fetchedProduct?.short_description,
            specifications:
              inpTypes?.specifications ? inpTypes?.specifications.map((eachInp: ISpecification) => ({
                specification_id: eachInp.id,
                value: "",
              })) : fetchedProduct?.specifications,
          }}
          enableReinitialize={true}
          validationSchema={updateProductSchema} //{addProductSchema}
          onSubmit={async (values) => {
            // @ts-ignore
            updateProduct({
              id, patch: {
                ...values, guarantee_id: values.guarantee_id,
                category_id: product?.category_id,
                images: pickedFiles.length > 0 ? pickedFiles : fetchedProduct?.photos, keywords: selectedKeys, body: editorContent,
                publish_time: new DateObject(date)
                  .convert(english, english_en)
                  .format("YYYY/MM/DD HH:mm:ss")
              }
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
                  >دسته انتخاب شده: {product?.category_name ? product?.category_name : fetchedProduct?.category}</Typography>
                </Grid>

                {/* is special */}
                <Grid item xs={12} md={12} >
                  <FormControl>
                    <FormLabel>نوع محصول</FormLabel>
                    <RadioGroup
                      name="is_active"
                      value={values?.is_active}
                      onChange={handleChange}
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 2
                      }}
                    >
                      <FormControlLabel
                        value='0'
                        control={<Radio />}
                        label='عادی'
                      />
                      <FormControlLabel
                        value='1'
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
                        value='0'
                        control={<Radio />}
                        label='پیش نویس'
                      />
                      <FormControlLabel
                        value='1'
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
                    {guarantiesLoader ? <Skeleton variant="rectangular"
                      sx={{
                        width: '100%',
                        height: '55px',
                        borderRadius: '4px',
                      }}
                    /> : <Select
                      defaultValue={fetchedProduct?.guarantee.id}
                      value={values.guarantee_id}
                      name="guarantee_id"
                      onChange={handleChange}
                    >
                      {
                        guaranties?.map((guarantee: any, idx: number) => (
                          <MenuItem key={idx} value={guarantee.id}>{guarantee?.name}</MenuItem>
                        ))
                      }
                    </Select>}
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
                  <InputLabel sx={{ my: 1 }} >نام محصول</InputLabel>
                  <TextField
                    id="title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.title && errors.title ? true : false}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InputLabel sx={{ my: 1 }} >انتخاب برند</InputLabel>
                  <FormControl fullWidth>
                    {brandsLoader ? <Skeleton variant="rectangular"
                      sx={{
                        width: '100%',
                        height: '55px',
                        borderRadius: '4px',
                      }}
                    /> : <Select
                      name="brand_id"
                      defaultValue={fetchedProduct?.brand.id}
                      value={values?.brand_id}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        touched.brand_id && errors.brand_id
                          ? true
                          : false
                      }
                    >
                      {brandsList?.map((eachBrand: any, idx: number) => (
                        <MenuItem key={idx} value={eachBrand?.id}>
                          {eachBrand?.title}
                        </MenuItem>
                      ))}
                    </Select>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <InputLabel sx={{ my: 1 }} >مدل</InputLabel>
                  <TextField
                    id="model"
                    value={values.model} // Use the title state as the value
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InputLabel sx={{ my: 1 }} >قیمت - ریال</InputLabel>
                  <TextField
                    id="price"
                    type="number"
                    value={values.price} // Use the title state as the value
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.price && errors.price ? true : false}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InputLabel sx={{ my: 1 }} >نام متا</InputLabel>
                  <TextField
                    id="meta_title"
                    value={values.meta_title} // Use the title state as the value
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <InputLabel sx={{ my: 1 }} >توضیحات متا</InputLabel>
                  <TextField
                    id="meta_description"
                    value={values.meta_description} // Use the title state as the value
                    onChange={handleChange}
                    onBlur={handleBlur}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <InputLabel sx={{ my: 1 }} >خلاصه نوشته</InputLabel>
                  <TextField
                    id="short_description"
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

       

                {!inpTypes ? (
                  // Render a loading indicator here while data is being fetched
                  <>
                  <LinearProgress />
                  <Grid item xs={12} >
                  <FieldArray
                    name="specifications"
                    render={arrayHelpers => (
                      <Grid container
                      spacing={2}
                      >
                    {  values?.specifications?.map((specification: any, index: number) => (
                        <Grid key={index} item xs={12} md={4}>
                          <InputLabel sx={{ my: 1 }} >{specification.title}</InputLabel>
                          <TextField
                            name={`specifications.${index}.value`}
                            value={specification.value}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            fullWidth
                          />
                          </Grid>
                      ))}
                        </Grid>
                    )}
                  />
                </Grid>
                  </>

                ) : (
                  inpTypes?.specifications &&
                  inpTypes?.specifications.length > 0 &&
                  inpTypes.specifications.map(
                    (eachInp: ISpecification, idx: number) => (
                      <Grid item xs={12} md={4} key={eachInp.id}>
                        <InputLabel sx={{ my: 1 }} >{eachInp.title}</InputLabel>
                        <TextField
                          id={eachInp.id.toString()}
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
                  {fetchedProduct?.images?.length > 0 && (
                    <Typography component="h1" variant="h4">
                      عکس ها پیشین
                    </Typography>
                  )}
                  <Grid container justifyContent="center">
                    {fetchedProduct?.images?.map(
                      (image: any, index: number) => (
                        <Grid
                          item
                          key={index}
                          sx={{
                            m: 2,
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: `0px 0px 10px ${colors.themeAccent[500]}`,
                            width: "200px",
                            height: "200px",
                            borderRadius: "10px",
                            ":hover": {
                              boxShadow: `3px 0 20px ${colors.blue[500]}`,
                            },
                          }}
                        >
                          <Image
                            src={image.download_link}
                            alt={image.name}
                            loading="lazy"
                            style={{
                              filter: `dropShadow(5px 4px 10px)`,
                              objectFit: "cover",
                              objectPosition: "center center",
                            }}
                            draggable={false}
                            width={200}
                            height={200}
                          />
                        </Grid>
                      )
                    )}
                  </Grid>
                </Grid>
                <Grid xs={12} item>
                  <LoadingButton
                    size="small"
                    disabled={updateLoader}
                    color="success"
                    loading={updateLoader}
                    loadingPosition="center"
                    // startIcon={<SaveIcon />}
                    variant="contained"
                    sx={{ my: 2 }}
                    type="submit"
                  >
                    بروزرسانی محصول
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
          <Editor fetchedContent={fetchedProduct?.body} />
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
              <KeywordsBox keywords={fetchedProduct?.keywords} />
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

export default UpdateProduct;
