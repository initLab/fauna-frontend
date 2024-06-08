import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './NavBar.css';
import initLabLogo from '../assets/initlab/logo.svg';
import colibriLogo from '../assets/colibri/logo.png';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import DoorClosedIcon from '../widgets/icons/DoorClosedIcon.jsx';
import { useVariant } from '../hooks/useVariant.js';
import RequireRole from '../widgets/RequireRole.jsx';
import LoadingIcon from '../widgets/icons/LoadingIcon.jsx';
import { useAuth } from 'react-oidc-context';

const NavBar = () => {
    const {t} = useTranslation();
    const auth = useAuth();
    const oidcAuthorityUrl = import.meta.env.OIDC_AUTHORITY_URL;
    const variant = useVariant();
    const isInitLab = variant === 'initlab';
    const isColibri = variant === 'colibri';

    return (<Navbar {...({
        ...isInitLab && {
            bg: 'primary',
            variant: 'dark',
        },
        ...isColibri && {
            bg: 'light',
        }
    })} expand="lg" className="py-0">
        <Container>
            <Navbar.Brand as={NavLink} to="/">
                {isInitLab && <Image src={initLabLogo} className="logo" alt="init Lab logo" />}
                {isColibri && <Image src={colibriLogo} className="logo" alt="Colibri logo" />}
            </Navbar.Brand>
            {/*
            <Navbar.Text className="flex-grow-1 flex-lg-grow-0 text-end pe-3 pe-lg-0">
                {doorClosed === null ? <LoadingIcon /> : (
                    doorClosed ? <DoorClosedIcon /> : <DoorOpenIcon />
                )}
            </Navbar.Text>
            */}
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="flex-grow-1">
                    <RequireRole roles={['board_member', 'infra', 'trusted_member', 'landlord', 'tenant']}>
                        <Nav.Link as={NavLink} to="/doors">
                            <DoorClosedIcon /> {t('views.navigation.door_access')}
                            {/*
                            {doorLockStatus === 'uninitialized' && <>
                                <LoadingIcon />
                            </>}
                            {doorLockStatus === 'locked' && <>
                                <LockIcon /> {t('views.doors.locked')}
                            </>}
                            {doorLockStatus === 'unlocked' && <>
                                <UnlockIcon /> {t('views.doors.unlocked')}
                            </>}
                            {doorLockStatus === 'busy' && <>
                                <BusyIcon />
                            </>}
                            {doorLockStatus === 'invalid' && <>
                                <WarningIcon /> {t('views.doors.unknown')}
                            </>}
                            */}
                        </Nav.Link>
                    </RequireRole>
                    <RequireRole roles={['board_member', 'infra', 'landlord', 'tenant']}>
                        <Nav.Link as={NavLink} to="/lights">
                            <i className="fa-solid fa-lightbulb" />{' '}
                            {t('views.navigation.lights')}
                        </Nav.Link>
                    </RequireRole>
                    {isInitLab && <>
                        <Nav.Link as={NavLink} to="/sensors">
                            <i className="fa-solid fa-chart-line" />{' '}
                            {t('views.navigation.sensors')}
                        </Nav.Link>
                    </>}
                    <RequireRole roles={['board_member', 'infra']}>
                        <Nav.Link as={NavLink} to="/action-log">
                            <i className="fa-solid fa-book" />{' '}
                            {t('views.navigation.action_log')}
                        </Nav.Link>
                    </RequireRole>
                    <RequireRole roles={['board_member']}>
                        <Nav.Link href={oidcAuthorityUrl + '/ui/console/users'} target="_blank">
                            <i className="fa-solid fa-users" />{' '}
                            {t('views.navigation.labbers')}
                        </Nav.Link>
                    </RequireRole>
                    {auth.isLoading ? <Nav.Link className="ms-0 ms-lg-auto">
                        <LoadingIcon />
                    </Nav.Link> : (auth.isAuthenticated ? <NavDropdown title={<>
                        <i className="fa-solid fa-user" />{' '}
                        {t('views.navigation.account')}
                    </>} className="ms-0 ms-lg-auto">
                        <NavDropdown.Item href={oidcAuthorityUrl + '/ui/console/users/me'}>
                            {t('views.navigation.view_edit')}
                        </NavDropdown.Item>
                        {isInitLab && <>
                            <NavDropdown.Item href={oidcAuthorityUrl}>
                                {t('views.navigation.network_devices')}
                            </NavDropdown.Item>
                            <NavDropdown.Item href={oidcAuthorityUrl + '/ui/console/users/me?id=grants'}>
                                {t('views.navigation.oauth_token_management')}
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                        </>}
                        <NavDropdown.Item onClick={() => void auth.removeUser()}>
                            {t('views.navigation.sign_out')}
                        </NavDropdown.Item>
                    </NavDropdown> : <Nav.Link onClick={() => void auth.signinRedirect()} className="ms-0 ms-lg-auto">
                        <i className="fa-solid fa-right-to-bracket" />{' '}
                        {t('views.navigation.sign_in')}
                    </Nav.Link>)}
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>);
};

export default NavBar;
