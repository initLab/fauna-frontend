import React from 'react';
import { getDoorActions } from '../utils/device.js';
import Devices from './Devices.jsx';
import { withAuthenticationRequired } from 'react-oidc-context';

const Doors = () => {
    return (<Devices deviceType="door" deviceActionMapper={getDoorActions} />);
};

export default withAuthenticationRequired(Doors);
