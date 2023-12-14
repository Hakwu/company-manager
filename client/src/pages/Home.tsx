import React, {useState, useEffect} from "react";
import { Button } from "@mui/material"
import useSWR from "swr";

import AccessToken from "../services/AccessToken";
import Form from "../components/Form"


export default function App() {
    const accessToken = AccessToken.get();
    const {data, mutate} = useSWR(accessToken ? '/profile' : null, {
        onError: () => window.location.href = "/login",
        revalidateOnfocus: false
    });
    const [welcome, setWelcome] = useState('');
    const [invoice, setInvoice] = useState( false);

    useEffect(() => {
        if (data?.status === 200) {
            setWelcome("Welcome" + " " + data?.data.email)
        }
        else
            setWelcome("");
    }, [data]);


    // const isLoading = !data || !state.data;


    // console.log(data);

    // const onSuccess = async() => {
    //     await axios.get(`${baseUrl}/auth/me`, {withCredentials: true}).then((res) => {
    //         localStorage.setItem('user', res.data.firstName + " " + res.data.name);
    //     })
    // };
    // const onAuth = async() => {
    //     await axios.get(`${baseUrl}/auth-endpoint`, {withCredentials: true}).then((res) => console.log(res.data));
    // }
    //

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
