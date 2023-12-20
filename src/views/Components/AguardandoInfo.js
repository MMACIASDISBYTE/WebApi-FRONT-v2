import { useRef } from "react";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Grid,
  Typography,
} from "@mui/material";

// project imports
import SubCard from "ui-component/cards/SubCard";
import { gridSpacing } from "store/constant";

import LogoDisbyteAzul from "../../assets/images/disbyte/LogoDisbyte.png";
import { useCommonStyles } from "helpers/CommonStyles";
// import user from 'store/slices/user';

// table data
function createData(product, description, quantity, amount, total) {
  return { product, description, quantity, amount, total };
}

const AguardandoInfo = ({
  XS=12,
  MD=10,
  LG=8,
}) => {
  const theme = useTheme();
  const componentRef = useRef(null);

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={XS} md={MD} lg={LG} ref={componentRef}>
        <SubCard
          darkTitle
          title={`Cargando...`}
          secondary={
            <img
              width="140"
              height="60"
              viewBox="0 0 92 32"
              fill="none"
              src={LogoDisbyteAzul}
              alt="Logo Disbyte Azul"
            />
          }
        >
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item sm={5}>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Grid container spacing={0}>
                        <Grid item xs={12}>
                          <Typography variant="h5">Cargando informacion.....</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2">
                            Cargando informacion.....
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </SubCard>
      </Grid>
    </Grid>
  );
};

export default AguardandoInfo;