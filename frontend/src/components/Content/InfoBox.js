import React from "react";
import { Box, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const InfoBox = ({ children }) => (
  <Box
    sx={{
      bgcolor: "#e8f4fd", // Light blue
      border: "1px solid #b3e5fc",
      borderRadius: 2,
      p: 2,
      my: 2,
      display: "flex",
    }}
  >
    <InfoOutlinedIcon
      sx={{
        mr: 1,
        color: "#0288d1",
        alignSelf: "flex-start", // Align icon to the top
        mt: "16px", // Small adjustment for better alignment
      }}
    />
    <Typography
      variant="body1"
      component="div"
      sx={{
        lineHeight: 1.6, // Ensures text flows naturally
      }}
    >
      {children}
    </Typography>
  </Box>
);

export default InfoBox;
