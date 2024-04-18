"use client";
import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  useTheme,
  Tab
} from "@mui/material";

import { tokens } from "@/theme";

import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { ColleaguesSliderList, BannerSliderList, MainSliderList } from "./slidersLists";

const SlidersTabs = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [value, setValue] = useState("0");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };



  
 



return(
  <>
   <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb:1,
          pb:1,
          borderBottom: `1px solid ${colors.primary[300]}`,
        }}
      >
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
            لیست اسلایدر ها
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
          <Tab label="اسلایدر اصلی" value="0" />
          <Tab label="اسلایدر بنر" value="1" />
          <Tab label="اسلایدر همکاران" value="2" />
        </TabList>
      </Box>
      <TabPanel value="0">
      <MainSliderList type={value} />
      </TabPanel>
      <TabPanel value="1">
      <BannerSliderList type={value} />
      </TabPanel>
      <TabPanel value="2">
      <ColleaguesSliderList type={value} />
      </TabPanel>
      </TabContext>

    </Box>
  </>
)
}

export default SlidersTabs