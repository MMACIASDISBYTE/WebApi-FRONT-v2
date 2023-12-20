import React, { useState } from "react";
import {
    Avatar,
  } from "@mui/material";
import { Box } from "@mui/system";

export const ImagenAvatar = ({ src, alt }) => {

    const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Box
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(null)}
      >
        <Avatar
          sx={{
            width: isHovered ? "250px" : "250px",
            height: isHovered ? "70px" : "70px",
            maxWidth: isHovered ? "250px" : "250px",
            maxHeight: isHovered ? "70px" : "70px",
            margin: 1,
            padding: -10,
            borderRadius: 0,
            transition: "all 0.4s", // animación suave
          }}
          alt={alt}
          src={src}
          variant="rounded"
        />
      </Box>
    </>
  );
};
