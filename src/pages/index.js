import { useEffect } from 'react';
import { navigate } from '@reach/router';

const Redirect = () => {
    useEffect(() => {
        navigate('/de');
    }, []);
    return null;
};
export default Redirect;
