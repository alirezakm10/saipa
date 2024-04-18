'use client'
import { useState } from "react";
import { Box, useTheme, Tab, Button, Typography } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddEditCategory from "./AddEditCategory";
import { tokens } from "@/theme";
// import { SharedCategory } from "./typescope";
import CategoryKeywords from "./CategoryKeywords";
import usePermission from "@/hooks/usePermission";


// this component contains content and tabs inside

export default function SharedCategory() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { hasPermission } = usePermission();

  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  }




  return (
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

          <Tab label="کلمات کلیدی" value="1" />
         { hasPermission("Classification.edit") && <Tab label="ویرایش دسته" value="2" />}
        </TabList>
      </Box>


      <TabPanel value="1">
        <CategoryKeywords/>
      </TabPanel>
      <TabPanel value="2">
      <AddEditCategory />
      </TabPanel>
    </TabContext>
  </Box>
  );
}
