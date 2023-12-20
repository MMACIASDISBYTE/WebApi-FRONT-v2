import { Link as RouterLink } from "react-router-dom";

// material-ui
import { Link } from "@mui/material";

// project imports
import { DASHBOARD_PATH } from "config";
import LogoDisbyte from "../../../assets/images/disbyte/Logo_Disbyte_DOS_2.png";
// import Logo from 'ui-component/Logo';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
  <>
    <Link component={RouterLink} to={DASHBOARD_PATH} aria-label="berry logo">
      {/* <Logo /> */}
      <img width="190" viewBox="0 0 92 32" fill="none" src={LogoDisbyte} />
    </Link>
  </>
);

export default LogoSection;
