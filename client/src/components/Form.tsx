import React, {useState} from "react";
import {
    Button,
    Input,
    TextField
} from "@mui/material"
import Backend from "../services/Backend";

const Form: ({isRender}: { isRender: boolean }) => React.JSX.Element = ({isRender}) => {
    const [number, setNumber] = useState('')
    const [name, setName] = useState('');
    const [user, setUser] = useState<{data:any, status:number}>({data:'',status:200});

    const [found, isFound] = useState(false);
    const senData = async (number: string) => {
        if (!number)
            return;
        const res = await Backend.findData('/getInfo' + `/${number}`, true);
        // console.log(res.data.user);

        if (res.status === 200) {
            setName(res.data.user.name)
            setUser(res)
            console.log(user)

            isFound(true);
        } else {
            setTimeout(() => alert('customer not found !'), 300);
        }
    }
    return (
        <div>
            {isRender ?
                <div style={{
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    left: "50%",
                    top: "50%",
                    width: 1000,
                    height: 500,
                    backgroundColor: 'white'
                }}>
                    {!found ?
                        <>
                            <TextField
                                autoComplete="Phone"
                                label="Tel"
                                variant="standard"
                                onChange={e => setNumber(e.target.value)}
                            ></TextField>
                            <Button onClick={() => senData(number)} variant={"contained"}>Send</Button>
                        </>
                        : <div>
                            <TextField
                                label={name}
                                variant="standard"
                                onChange={e => setName(e.target.value)}
                            ></TextField>
                            <TextField
                                label={name}
                                variant="standard"
                                onChange={e => setName(e.target.value)}
                            ></TextField>
                            <TextField
                                label={name}
                                variant="standard"
                                onChange={e => setName(e.target.value)}
                            ></TextField>
                        </div>
                    }
                </div>
                : <div></div>
            }
        </div>

    )
}

export default Form;
