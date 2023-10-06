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
            width: isHovered ? "200%" : "100%",
            height: isHovered ? "200%" : "100%",
            maxWidth: isHovered ? "200%" : "100%",
            maxHeight: isHovered ? "200%" : "100%",
            margin: -2,
            padding: -10,
            borderRadius: 0,
            transition: "all 0.3s", // animación suave
          }}
          alt={alt}
          src={src}
          variant="rounded"
        />
      </Box>
    </>
  );
};
