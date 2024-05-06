import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
    const ComponentWithAuth = (props) => {
        const history = useHistory();

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                history.push('/login');
            }
        }, [history]);

        return <WrappedComponent {...props} />;
    };

    return ComponentWithAuth;
};

export default withAuth;
