import Chip from "ui-component/extended/Chip";
import React from 'react'

export const StatusComp = ({texto = '', estadio = null, colores = 'primary'}) => {

  return (
    <>
        <Chip
            label={`${texto} ${estadio}`}
            size="medium"
            chipcolor={colores}
            color="primary"
            // variant="outlined"
        />
    </>
  )
}
