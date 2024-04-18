"use client";
import { useEffect, useState } from "react";
import SiteSettings from "./SiteSettings";
import {
    Box,
    Typography,
    useTheme,
    Tab
} from "@mui/material";
import SiteSmsSettings from "./SiteSmsSettings";
import SiteSmtpSettings from "./SiteSmtpSettings";
import { tokens } from "@/theme";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import SiteMenuSettings from "./SiteMenuSettings";

const SettingsTabs = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [value, setValue] = useState("1");
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };


    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    my: 1,
                    pb: 1,
                    borderBottom: `1px solid ${colors.primary[300]}`,
                }}
            >
                <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
                     تنظیمات سایت
                </Typography>
            </Box>

            <Box
                sx={{
                    width: "100%",
                    typography: "body1",
                    border: `1px solid ${colors.primary[300]}`,
                    p: 1,
                    borderRadius: "10px",
                }}
            >
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <TabList onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label="تنظیمات اصلی" value="0" />
                            <Tab label="تنظیمات پیام رسان" value="1" />
                            <Tab label="تنظیمات سرور ایمیل" value="2" />
                            <Tab label="تنظیمات منوی لندینگ" value="3" />
                        </TabList>
                    </Box>
                    <TabPanel value="0">
                        <SiteSettings />
                    </TabPanel>
                    <TabPanel value="1">
                        <SiteSmsSettings />
                    </TabPanel>
                    <TabPanel value="2">
                    <SiteSmtpSettings />
                    </TabPanel>
                    <TabPanel value="3">
                    <SiteMenuSettings />
                    </TabPanel>
                </TabContext>

            </Box>
        </>
    )
}

export default SettingsTabs