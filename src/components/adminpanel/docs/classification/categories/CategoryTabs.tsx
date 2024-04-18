"use client";
import { useState } from "react";
import { Box, useTheme, Tab, Button, Typography } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddEditCategory from "./AddEditCategory";
import { tokens } from "@/theme"
import usePermission from "@/hooks/usePermission";

// this component contains content and tabs inside

export default function SharedCategory() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { hasPermission } = usePermission();
  const [value, setValue] = useState("1");
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      {hasPermission("Classification.edit") && (
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
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="ویرایش دسته" value="1" />
              </TabList>
            </Box>

            <TabPanel value="1">
              <AddEditCategory />
            </TabPanel>
          </TabContext>
        </Box>
      )}
    </>
  );
}
