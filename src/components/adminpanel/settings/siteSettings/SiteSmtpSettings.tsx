'use client'
import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import {
    Box,
    Typography,
    Grid,
    TextField,
    InputLabel,
    Paper,
    useTheme,
    FormControl,
    Select,
    MenuItem,
    SelectChangeEvent,
    Skeleton
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useGetSiteSmtpSettingsQuery, useUpdateSiteSmtpSettingsMutation } from '@/redux/services/settings/siteSettingsApi';
import { tokens } from '@/theme';
import useToast from '@/hooks/useToast';
import TestSmtpConfigs from './tester/TestSmtpConfigs';
import usePermission from '@/hooks/usePermission';


const SiteSmtpSettings = () => {
    const showToast = useToast()
    const { data: siteSmtpSettings, isSuccess, isLoading, isFetching, isError, error } = useGetSiteSmtpSettingsQuery('');
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const { hasPermission } = usePermission();




    const [
        updateSiteSmtpSettings,
        {
            isSuccess: updateStatus,
            isLoading: updateLoader,
            data: updateResult,
            error: updateErrorMsg,
            isError: updateErrorBoolean
        }
    ] = useUpdateSiteSmtpSettingsMutation<any>();

    useEffect(() => {
        if (updateStatus) {
            showToast(updateResult?.message, "success");
        }
        if (updateErrorMsg) {
            const errMsg = updateErrorMsg.data.message ?? updateErrorMsg.error;
            showToast(errMsg, "error");
        }
    }, [updateStatus, updateResult, error]);

    return (
        <>
        <Paper
            sx={{
                border: `1px solid ${colors.primary[300]}`,
                borderRadius: "5px",
                p: 1
            }}
        >
            <Formik
                initialValues={{
                    host: siteSmtpSettings?.host,
                    port: siteSmtpSettings?.port,
                    encryption: siteSmtpSettings?.encryption,
                    username: siteSmtpSettings?.username,
                    password: siteSmtpSettings?.password,
                    mail_from_name: siteSmtpSettings?.mail_from_name,
                    ehlo_domain: siteSmtpSettings?.ehlo_domain,
                    sender: siteSmtpSettings?.sender,
                }}
                enableReinitialize={true}
                onSubmit={async (values) => {
                    updateSiteSmtpSettings(values)
                }}
            >
                {({ handleChange, values }) => (
                    <Form>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                pb: 1,
                                mb: 1,
                                borderBottom: '1px solid primary[300]',
                            }}
                        >
                            <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
                                تنظیمات سرور ایمیل
                            </Typography>
                        </Box>
                        <Grid container spacing={2}>

                            <Grid item xs={12}>
                                <InputLabel sx={{ my: 1 }}>نام کاربری</InputLabel>
                                <TextField
                                    name='username'
                                    value={values.username}
                                    type='text'
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <InputLabel sx={{ my: 1 }}>رمز عبور</InputLabel>
                                <TextField
                                    name='password'
                                    value={values.password}
                                    type='password'
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>



                            <Grid item xs={12}>
                                <InputLabel sx={{ my: 1 }}>دامنه</InputLabel>
                                <TextField
                                    name='ehlo_domain'
                                    value={values.ehlo_domain}
                                    type='text'
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <InputLabel sx={{ my: 1 }}>هاست</InputLabel>
                                <TextField
                                    name='host'
                                    value={values.host}
                                    type='text'
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <InputLabel sx={{ my: 1 }}>پورت</InputLabel>
                                <TextField
                                    name='port'
                                    value={values.port}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <InputLabel sx={{ my: 1 }}>گواهی امنیتی</InputLabel>
                                <FormControl fullWidth>
                               { isLoading ? <Skeleton variant="rectangular"
                      sx={{
                        width:'100%' ,
                        height:'55px',
                        borderRadius:'4px',
                      }}
                      /> :  <Select
                                      defaultValue={siteSmtpSettings?.encryption}
                                        name='encryption'
                                        value={values?.encryption}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value='tls'>TLS</MenuItem>
                                        <MenuItem value='ssl'>SSL</MenuItem>
                                    </Select>}
                                </FormControl>
                            </Grid>



                            <Grid item xs={12}>
                                <InputLabel sx={{ my: 1 }}>نام ارسال کننده ایمیل</InputLabel>
                                <TextField
                                    name='mail_from_name'
                                    value={values.mail_from_name}
                                    type='text'
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <InputLabel sx={{ my: 1 }}>ایمیل ارسال کننده </InputLabel>
                                <TextField
                                    name='sender'
                                    value={values.sender}
                                    type='text'
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>


                            <Grid item xs={12}>
                                <InputLabel sx={{ my: 1 }}>دامنه (ehlo)</InputLabel>
                                <TextField
                                    name='ehlo_domain'
                                    value={values.ehlo_domain}
                                    type='text'
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>




                            <Grid item>
                                <Box sx={{ position: 'sticky', top: '5px', zIndex: 1, my: 2, display: 'flex', gap: 1 }}>
                                    { hasPermission("Setting.edit") && <LoadingButton
                                        color="success"
                                        disabled={updateLoader}
                                        loading={updateLoader}
                                        loadingPosition="center"
                                        variant="contained"
                                        type="submit"
                                    >
                                        ذخیره
                                    </LoadingButton>}
                                </Box>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        </Paper>


        
        <Paper
                sx={{
                    border: `1px solid ${colors.primary[300]}`,
                    borderRadius: "5px",
                    mt: 1 ,
                    p: 1
                }}
            >
                <TestSmtpConfigs />
            </Paper>


        </>
    );
};

export default SiteSmtpSettings;
