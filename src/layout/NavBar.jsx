import { Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './NavBar.css';
import initLabLogo from '../assets/initlab/logo.svg';
import colibriLogo from '../assets/colibri/logo.png';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import DoorClosedIcon from '../widgets/icons/DoorClosedIcon.jsx';
import { useEffect } from 'react';
import i18n from '../i18n.js';
import { useVariant } from '../hooks/useVariant.js';
import { useCurrentUser } from '../hooks/useCurrentUser.js';
import RequireRole from '../widgets/RequireRole.jsx';

const NavBar = () => {
    const {t} = useTranslation();
    // TODO
    const oidcAuthorityUrl = import.meta.env.OIDC_AUTHORITY_URL;
    const {
        hasAccessToken,
        user,
        isSuccess,
    } = useCurrentUser();
    const variant = useVariant();
    const isInitLab = variant === 'initlab';
    const isColibri = variant === 'colibri';

    useEffect(function() {
        if (isSuccess) {
            i18n.changeLanguage(user.locale).then(() => {});
        }
    }, [user.locale, isSuccess]);

    const location = useLocation();

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
                        <Nav.Link href={oidcAuthorityUrl}>
                            <i className="fa-solid fa-users" />{' '}
                            {t('views.navigation.labbers')}
                        </Nav.Link>
                    </RequireRole>
                    {hasAccessToken ? <NavDropdown title={<>
                            <i className="fa-solid fa-user" />{' '}
                            {t('views.navigation.account')}
                        </>} className="ms-0 ms-lg-auto">
                        <NavDropdown.Item href={oidcAuthorityUrl}>
                            {t('views.navigation.view_edit')}
                        </NavDropdown.Item>
                        {isInitLab && <>
                            <NavDropdown.Item href={oidcAuthorityUrl}>
                                {t('views.navigation.network_devices')}
                            </NavDropdown.Item>
                            <NavDropdown.Item href={oidcAuthorityUrl}>
                                {t('views.navigation.oauth_application_management')}
                            </NavDropdown.Item>
                            <NavDropdown.Item href={oidcAuthorityUrl}>
                                {t('views.navigation.oauth_token_management')}
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                        </>}
                        <NavDropdown.Item as={NavLink} to="/logout" state={{
                            from: location.pathname === '/doors' ? null : location,
                        }}>
                            {t('views.navigation.sign_out')}
                        </NavDropdown.Item>
                    </NavDropdown> : <Nav.Link as={NavLink} to="/login" state={{
                        from: location,
                    }} className="ms-0 ms-lg-auto">
                        <i className="fa-solid fa-right-to-bracket" />{' '}
                        {t('views.navigation.sign_in')}
                    </Nav.Link>}
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>);
};

export default NavBar;
