import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link } from '@mui/material';

// project imports
import { DASHBOARD_PATH } from 'config';
import LogoDisbyte from '../../../assets/images/disbyte/LogoDisbyte.png'
// import Logo from 'ui-component/Logo';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => (
    <Link component={RouterLink} to={DASHBOARD_PATH} aria-label="berry logo">
        {/* <Logo /> */}
        <img width="140" height="52" viewBox="0 0 92 32" fill="none" src={LogoDisbyte}/>
    </Link>
);

export default LogoSection;
