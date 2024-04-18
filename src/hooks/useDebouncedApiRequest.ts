import { useState, useEffect } from 'react';

const useDebouncedApiRequest = (
    initialValue: string,
    delay: number,
    apiRequest: (value: string) => void
) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            apiRequest(value);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [value, delay]);

    const handleChange = (newValue: string) => {
        setValue(newValue);
    };

    return handleChange;
};

export default useDebouncedApiRequest;
