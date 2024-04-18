"use client";
import { useState } from "react";
import {
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Divider,
  Box,
  Typography,
  useTheme,
} from "@mui/material";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import GridView from "./GridView";
import CardsView from "./CardsView";
import { tokens } from "@/theme";

const AllProducts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode)
  const [view, setView] = useState<string | null>("grid");

  const handleChangeView = (
    event: React.MouseEvent<HTMLElement>,
    newView: string | null
  ) => {
    setView(newView);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          borderBottom: `1px solid ${colors.primary[300]}`,
        }}
      >
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
          محصولات
        </Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleChangeView}
          aria-label="text alignment"
        >
          <ToggleButton value="grid" aria-label="left aligned">
            <ViewListIcon />
          </ToggleButton>
          <ToggleButton value="card" aria-label="centered">
            <ViewModuleIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        
      </Box>
      <div style={{ marginTop: "20px" }}>
        {view == "grid" ? <GridView /> : <CardsView />}
      </div>
    </>
  );
};

export default AllProducts;
