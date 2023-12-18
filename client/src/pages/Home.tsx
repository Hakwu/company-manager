import React, {useState, useEffect} from "react";
import { Button } from "@mui/material"
import useSWR from "swr";
import AccessToken from "../services/AccessToken";
import Form from "../components/Form"

export default function App() {
    const currentUrl = window.location.search;
    const urlParams = new URLSearchParams(currentUrl);
    const token = urlParams.get('access_token');
    if (token) {
        AccessToken.set(token);
        window.location.href = window.location.href.split('?')[0];
    }
    const accessToken = AccessToken.get();

    const {data, mutate} = useSWR(accessToken ? '/profile' : null, {
        onError: () => window.location.href = "/login",
        revalidateOnfocus: false
    });
    const [welcome, setWelcome] = useState('');
    const [invoice, setInvoice] = useState( false);

    useEffect(() => {
        if (data?.status === 200)
            setWelcome("Welcome" + " " + data?.data.email)
        else
            setWelcome("");
    }, [data]);

    const logout = async() => {
        AccessToken.remove()
        window.location.href ="/login";
        await mutate();
    }

    return (
        <>
            <div>Home</div>
            {!data ? <div>Loading...</div> : <div>{welcome}</div>}
            {/*<Button onClick={onSuccess}>Test</Button>*/}
            <Button onClick={logout}>Logout</Button>
            <Button onClick={() => {setInvoice(!invoice)}}>Create</Button>
            <Form isRender={invoice}></Form>
            {/*<Button onClick={test}>Profile</Button>*/}
            {/*<Button onClick={onAuth}>onAuth</Button>*/}
        </>
    )
}
