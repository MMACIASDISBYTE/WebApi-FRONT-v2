// material-ui
import { Link, Typography, Stack } from '@mui/material';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
    <Stack direction="row" justifyContent="space-between">
        <Typography variant="subtitle2" component={Link} href="https://www.disbyte.com/" target="_blank" underline="hover">
            &copy; disbyte.com
        </Typography>
        <Typography variant="subtitle2" component={Link} href="https://www.disbyte.com/empresa/" target="_blank" underline="hover">
            About us
        </Typography>
    </Stack>
);

export default AuthFooter;
