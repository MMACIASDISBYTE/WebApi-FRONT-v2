// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://www.disbyte.com/" target="_blank" underline="hover">
            &copy; www.disbyte.com
        </Typography>
        <Typography variant="subtitle2" component={Link} href="https://www.linkedin.com/company/disbyte-s-a/?originalSubdomain=ar" target="_blank" underline="hover">
            Sobre Nosotros
        </Typography>
    </Stack>
);

export default AuthFooter;
