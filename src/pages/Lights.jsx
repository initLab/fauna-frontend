import React from 'react';
import { getLightActions } from '../utils/device.js';
import Devices from './Devices.jsx';
import { withAuthenticationRequired } from 'react-oidc-context';

const Lights = () => {
    return (<Devices deviceType="light" deviceActionMapper={getLightActions} />);
};

export default withAuthenticationRequired(Lights);
