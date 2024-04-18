"use client";
import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UserInfo from "../userInfo/UserInfo";
import AddressList from "../userAddress/AddressList";
import UserRole from "../userRole/UserRole";
// import { useSession } from "next-auth/react";

interface Props {
  id: string;
}

const UserDetail: React.FC<Props> = ({ id }) => {
  // const { data: session} = useSession()
  const [value, setValue] = React.useState("1")


  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };


  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChangeTab} variant="scrollable" aria-label="lab API tabs example">
            <Tab label="اطلاعات کاربر" value="1" />
            <Tab label="افزودن و ویرایش آدرس" value="2" />
            <Tab label="تنظیمات نقش" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1"><UserInfo/></TabPanel>
        <TabPanel value="2"><AddressList /></TabPanel>
        <TabPanel value="3"><UserRole /></TabPanel>
      </TabContext>
    </Box>
  );
};

export default UserDetail;
