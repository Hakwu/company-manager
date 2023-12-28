import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import useSWR from 'swr';
import AccessToken from 'services/AccessToken';
import Form from 'components/Form';

export default function Home() {
    const currentUrl = window.location.search;
    const urlParams = new URLSearchParams(currentUrl);
    const token = urlParams.get('access_token');

    if (token) {
        AccessToken.set(token);
        window.location.href = window.location.href.split('?')[0];
    }
    const accessToken = AccessToken.get();

    const { data, mutate } = useSWR(accessToken ? '/profile' : null, {
        onError: () => (window.location.href = '/login'),
        revalidateOnfocus: false
    });

    const [welcome, setWelcome] = useState('');
    const [invoice, setInvoice] = useState(false);

    useEffect(() => {
        if (data?.status === 200) setWelcome('Welcome' + ' ' + data?.data.email);
        else {
            setWelcome('');
        }
    }, [data]);

    return (
        <>
            <div className={'content'}>
                {/*<div>Home</div>*/}
                {/*{!data ? <div>Loading...</div> : <div>{welcome}</div>}*/}
                <Button
                    onClick={() => {
                        setInvoice(!invoice);
                    }}>
                    Create
                </Button>
                <Form isRender={invoice}></Form>
                <Button style={{ position: 'absolute', right: 0 }}>Test the width !</Button>
            </div>
        </>
    );
}
