import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/system/Stack';
import {
    Button,
    Divider,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    Typography,
    FormHelperText
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Backend from 'services/Backend';

export default function App() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const url = 'https://media.gqmagazine.fr/photos/5d232cdecb0f11ce8d3d9c8d/4:3/w_1440,h_1080,c_limit/Spidey1.jpg';
    const handleSubmit = async () => {
        if (!email || !password) return;

        const value = await Backend.login({ email: email, password: password });

        if (value.status === 200) {
            setEmail('');
            setPassword('');
            window.location.href = 'http://localhost:3000';
        }
    };
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const GoogleSubmit = () => {
        window.location.href =
            'https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fgoogle%2Fcallback&client_id=782155215416-67v3mv8uk2h6vsu8mc94gmps190u1k8o.apps.googleusercontent.com&access_type=offline&response_type=code&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email';
    };
    return (
        <div style={{ position: 'absolute', height: 100 + 'vh', width: 100 + 'vw', backgroundColor: '#232323' }}>
            <div
                style={{
                    position: 'absolute',
                    right: 2.5 + 'vw',
                    top: 5 + 'vh',
                    height: 90 + 'vh',
                    width: 400,
                    backgroundColor: 'white',
                    borderRadius: 20
                }}>
                <div style={{ marginLeft: 40 }}>
                    <Typography
                        style={{ fontSize: 30, textAlign: 'left', marginTop: 30, fontWeight: '400' }}
                        variant="h2"
                        component="h2">
                        Invoice generator
                    </Typography>
                    <Typography
                        style={{ fontSize: 50, textAlign: 'left', marginTop: 30, fontWeight: '400' }}
                        variant="h2"
                        component="h2">
                        Se connecter
                    </Typography>
                </div>
                <Stack
                    component="form"
                    spacing={2}
                    alignItems={'center'}
                    sx={{
                        marginTop: 5,
                        '& > :not(style)': { m: 1, width: '25ch' }
                    }}>
                    <Button onClick={GoogleSubmit}>Google</Button>
                    <Divider>ou</Divider>
                    <TextField
                        sx={{ input: { height: '3vh' } }}
                        id="standard-basic"
                        label="E-mail"
                        variant="standard"
                        autoComplete={'email'}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <FormControl onSubmit={handleSubmit} sx={{ m: 1, width: '25ch' }} variant="standard">
                        <InputLabel htmlFor="standard-adornment-password">Mot de passe</InputLabel>
                        <Input
                            id="standard-adornment-password"
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        <FormHelperText id="my-helper-text">Nous ne partagerons jamais vos données.</FormHelperText>
                        <Button sx={{ marginTop: 5 }} variant="contained" onClick={handleSubmit}>
                            connexion
                        </Button>
                    </FormControl>
                </Stack>
            </div>
        </div>
    );
}
