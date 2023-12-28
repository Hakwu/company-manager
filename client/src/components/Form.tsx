import React, { useEffect, useState } from 'react';
import { Button, FormHelperText, TextField } from '@mui/material';
import Backend from '../services/Backend';

interface UserData {
    ZIP: string;
    name: string;
    email: string;
    address: string;
    city: string;
    phone: string;
}

interface MyComponentProps {
    isRender: boolean;
    // Other prop types if any
}

const Form: React.FC<MyComponentProps> = ({ isRender }) => {
    const [number, setNumber] = useState('');
    const [user, setUser] = useState<UserData>({ ZIP: '', name: '', email: '', address: '', city: '', phone: '' });
    const [found, isFound] = useState(false);
    const [step, setStep] = useState(1);
    const [error, isError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const handleClick = async () => {
        if (!number) {
            isError(true);
            setErrorMessage('Veuillez rajouter un numero de telephone');
            return;
        }
        if (number.length != 10) {
            isError(true);
            setErrorMessage('Veuillez indiquer un numero de telephone français.');
            return;
        }
        try {
            const promise = await Backend.fetcher('/user' + `/${number}`, true);
            setNumber('');
            const userData = promise?.data;
            if (promise.status === 200) {
                setUser(userData);
                setNumber('');
                isFound(true);
            } else {
                setNumber('');
                isFound(true);
                setStep(2);
                console.log('set step 2');
            }
        } catch (e) {
            console.log(e);
        }
    };

    const secondClick = async () => {
        if (!user) return;
        try {
            if (step === 1) {
                await Backend.updateProfile(user);
                console.log('update');
            } else {
                await Backend.createProfile(user);
                console.log('create');
            }
        } catch (e) {
            console.log(e);
        }
    };
    return (
        <div>
            {isRender ? (
                <div className={'form'}>
                    {!found ? (
                        <>
                            <TextField
                                label="Tel"
                                error={error}
                                variant="standard"
                                helperText={errorMessage}
                                onChange={(e) => setNumber(e.target.value)}></TextField>
                            <Button onClick={handleClick} variant={'contained'}>
                                Send
                            </Button>
                        </>
                    ) : (
                        <form style={{ marginTop: 100 }}>
                            <TextField
                                label={user?.name}
                                variant="standard"
                                onChange={(e) => setUser({ ...user, name: e.target.value })}></TextField>
                            <FormHelperText id="my-helper-text">Name</FormHelperText>
                            <TextField
                                label={user?.email}
                                variant="standard"
                                onChange={(e) => setUser({ ...user, email: e.target.value })}></TextField>
                            <FormHelperText id="my-helper-text">Email</FormHelperText>
                            <TextField
                                label={user?.phone}
                                InputProps={{
                                    readOnly: true
                                }}
                                variant="standard"
                                onChange={(e) => setUser({ ...user, phone: e.target.value || number })}></TextField>
                            <FormHelperText id="my-helper-text">Phone</FormHelperText>
                            <TextField
                                label={user?.address}
                                variant="standard"
                                onChange={(e) => setUser({ ...user, address: e.target.value })}></TextField>
                            <FormHelperText id="my-helper-text">Adress</FormHelperText>
                            <TextField
                                label={user?.city}
                                variant="standard"
                                onChange={(e) => setUser({ ...user, city: e.target.value })}></TextField>
                            <FormHelperText id="my-helper-text">City</FormHelperText>
                            <TextField
                                label={user?.ZIP}
                                variant="standard"
                                onChange={(e) => setUser({ ...user, ZIP: e.target.value })}></TextField>
                            <FormHelperText id="my-helper-text">ZIP</FormHelperText>

                            <Button onClick={secondClick} variant={'contained'}>
                                Modify
                            </Button>
                        </form>
                    )}
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default Form;
