import { Button } from 'react-bootstrap';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './DeviceActionButton.scss';
import { useDeviceActionMutation } from '../../features/apiSlice.js';
import { sleep } from '../../utils/time.js';

const types = {
    open: {
        variant: 'success',
        icon: 'fa-solid fa-right-to-bracket',
    },
    open_alternative: {
        variant: 'success',
        icon: 'fa-solid fa-right-to-bracket',
    },
    lock: {
        variant: 'danger',
        icon: 'fa-solid fa-lock',
    },
    unlock: {
        variant: 'info',
        icon: 'fa-solid fa-lock-open',
    },
    turn_on: {
        variant: 'success',
        icon: 'fa-solid fa-lightbulb',
    },
    turn_off: {
        variant: 'danger',
        icon: 'fa-regular fa-lightbulb',
    },
};
const DeviceActionButton = ({
    deviceId,
    action,
    isDoorOpen = false,
}) => {
    const [ disabled, setDisabled ] = useState(false);

    const [ execute ] = useDeviceActionMutation();

    const {t} = useTranslation();
    const type = types?.[action] || {
        variant: '',
        icon: '',
    };

    async function handleClick() {
        setDisabled(true);

        await execute({
            deviceId,
            action,
        });

        await sleep(3000);
        setDisabled(false);
    }

    const variant = isDoorOpen ? 'warning' : type.variant;
    const icon = (isDoorOpen ? 'fa-solid fa-door-open' : type.icon);
    const label = t(isDoorOpen ? 'views.door.open' : 'views.devices.' + action);

    return (<>
        <Button variant={variant} className="device-action-button" onClick={handleClick} disabled={disabled}>
            <i className={icon} />
            <div>{label}</div>
        </Button>
    </>);
};

export default DeviceActionButton;
