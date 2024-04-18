'use client'
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab } from "@mui/material";
import React from "react";
import NewsletterList from "./NewsletterList";
import Subscribers from "./Subscribers";
import usePermission from "@/hooks/usePermission";

const Newsletter = () => {
  const [value, setValue] = React.useState<string>("1");
  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };


  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChangeTab} variant="scrollable" aria-label="lab API tabs example">
            <Tab label="خبرنامه ها" value="1" />
            <Tab label="مشترکین" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1"><NewsletterList /></TabPanel>
        <TabPanel value="2"><Subscribers /></TabPanel>
      </TabContext>
    </Box>
  );
}

export default Newsletter