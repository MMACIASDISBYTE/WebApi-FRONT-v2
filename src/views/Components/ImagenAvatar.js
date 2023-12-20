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
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(null)}
      >
        <Avatar
          sx={{
            width: isHovered ? "200px" : "70px",
            height: isHovered ? "200px" : "70px",
            maxWidth: isHovered ? "200px" : "70px",
            maxHeight: isHovered ? "200px" : "70px",
            margin: -2,
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
