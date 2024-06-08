import { Col, Row } from 'react-bootstrap';
import PresentUsers from '../PresentUsers/PresentUsers';
import { useTranslation } from 'react-i18next';
// import { useGetPresentUsersQuery } from '../../features/apiSlice.js';
import LoadingIcon from '../icons/LoadingIcon.jsx';
import { useMemo } from 'react';
import { format, formatISO } from 'date-fns';
import ErrorMessage from '../ErrorMessage.jsx';
// import { useNetworkState } from '@uidotdev/usehooks';

const PresentUsersWrapper = () => {
    const { t } = useTranslation();

    // const {
    //     online,
    // } = useNetworkState();

    // TODO
    // const {
    //     data: users,
    //     error,
    //     isLoading,
    //     isSuccess,
    //     isError,
    //     fulfilledTimeStamp,
    // } = useGetPresentUsersQuery(undefined, {
    //     pollingInterval: online === false ? 0 : 60_000,
    // });
    // noinspection JSMismatchedCollectionQueryUpdate
    const users = [];
    const error = null;
    const isLoading = false;
    const isSuccess = true;
    const isError = false;
    const fulfilledTimeStamp = useMemo(() => new Date(), []);

    const fulfilledTime = useMemo(() => new Date(fulfilledTimeStamp), [fulfilledTimeStamp]);
    const usersCount = isSuccess ? users.length : 0;

    return (<>
        <Row as="header" className="row-cols row-cols-1 row-cols-lg-2 mt-2">
            <Col>
                <h2>{t('views.users.whos_in_the_lab')}</h2>
            </Col>
            <Col className="text-end">
                {isLoading && <LoadingIcon />}
                {isSuccess && <h2>
                    <div className="small text-muted">
                        {t('views.users.people_at_about_html.' + (usersCount === 1 ? 'one' : 'other'))
                            .replace('%{count}', usersCount.toString(10))}{' '}
                        <time dateTime={formatISO(fulfilledTime)}>{format(fulfilledTime, 'HH:mm')}</time>
                    </div>
                </h2>}
            </Col>
        </Row>
        {isLoading && <Row className="mb-3">
            <Col className="text-center">
                <LoadingIcon large />
            </Col>
        </Row>}
        {isSuccess && <PresentUsers users={users} />}
        {isError && <Row className="mb-3">
            <Col>
                <ErrorMessage error={error} />
            </Col>
        </Row>}
    </>);
};

export default PresentUsersWrapper;
