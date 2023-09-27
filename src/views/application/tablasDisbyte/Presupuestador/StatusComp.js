import Chip from "ui-component/extended/Chip";
import React from 'react'

export const StatusComp = (estadio = null) => {

  return (
    <>
        <Chip
            label={`Estado ${estadio.estadio}`}
            size="medium"
            chipcolor="primary"
            color="primary"
            // variant="outlined"
        />
    </>
  )
}
