import express, {Request, Response, NextFunction} from "express";
import cors from "cors";
import {PORT, JWT_SECRET, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID} from "./config";
import "express-async-errors";
import cookieParser from "cookie-parser";
import * as querystring from "querystring";
import bcrypt from 'bcrypt';
import bodyParser from "body-parser";
import axios from 'axios';
import jwt from "jsonwebtoken";
import {connectToDatabase, db} from "./db/conn";
import {ObjectId} from "mongodb";

import User from "./Model/userModel";

connectToDatabase();

const app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.use(cookieParser());

app.use(cors({
    // Sets Access-Control-Allow-Origin to the UI URI
    origin: "http://localhost:3000",
    // Sets Access-Control-Allow-Credentials to true
    credentials: true,
}));

app.use(express.json());

const authorization = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        // const authToken = req.headers.authorization;
        // // console.log(authToken)
        next();
    } else {
        console.log('Authorization Header is missing.');
        res.status(401).send('Unauthorized: Authorization header is missing.');
    }
    // if (!req.headers.authorization) {
    //     return res.status(401).json({
    //         message: 'Error: Access token is required'
    //     });
    // }
    //
    // const bearer = req.headers.authorization.split(' ');
    // const bearerToken = bearer[1];
    //
    // if (!bearerToken) {
    //     return res.status(401).json({
    //         message: 'Error: Invalid Token'
    //     });
    // }
};

function getGoogleAuth() {
    const googleUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const option = {
        redirect_uri: "http://localhost:5000/auth/google/callback",
        client_id: GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
    };
    return `${googleUrl}?${querystring.stringify(option)}`;
}

function getTokens({
                       code,
                       clientId,
                       clientSecret,
                       redirectUri,
                   }: {
    code: string;
    clientId: string;
    clientSecret: string;
    redirectUri: string;
}): Promise<{
    access_token: string;
    expires_in: Number;
    refresh_token: string;
    scope: string;
    id_token: string;
}> {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
    };

    return axios.post(url, querystring.stringify(values), {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }).then((res) => res.data)
        .catch((error) => {
            throw new Error(error.message);
        });
}


app.get('/', async (req, res) => {
});


app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, 10).catch((e) => {
            res.status(500).send({
                message: 'Password was not hashed successfully',
                e,
            })
        }
    ).then(async (hashedPassword) => {
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
        })
        let collection = db.collection("Employee");
        const query = {email: req.body.email as string};

        const foundUser = await collection.findOne(query);
        if (!foundUser)
            await collection.insertOne(user).then((result) => {
                res.status(201).send({
                    message: "User Created Successfully",
                    result,
                })
            }).catch((e) => {
                res.status(500).send({
                    message: "Error creating user",
                    e,
                });
            });
        else
            res.status(401).send({message: "User already exist!"});
    })
});


app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    let collection = db.collection("Employee");
    const user = await collection.findOne({email: email});
    if (!user)
        return res.status(401).send('Invalid email or password');

    bcrypt.compare(password, user.password).then((passwordChecker) => {
        if (!passwordChecker) {
            return res.status(400).send({
                message: "Invalid email or password",
            });
        }
        const token = jwt.sign({_id: user._id}, JWT_SECRET as string);
        res.status(200).json({
            message: "Logged in successfully",
            token: token
        });
    }).catch((e) => {
        res.status(400).send({
            message: "Invalid email or password",
            e,
        });
    });
});

app.get("/auth-endpoint", authorization, (req, res) => {
    res.json({message: "You are authorized to access me"});
});

app.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code as string;
    const {id_token, access_token} = await getTokens({
        code,
        clientId: GOOGLE_CLIENT_ID as string,
        clientSecret: GOOGLE_CLIENT_SECRET as string,
        redirectUri: "http://localhost:5000/auth/google/callback",
    })
    const googleUser = await axios
        .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
                headers: {
                    Authorization: `Bearer ${id_token}`,
                },
            }
        )
        .then((res) => res.data)
        .catch((error) => {
            throw new Error(error.message);
        });
    let collection = db.collection("Employee");
    const user = await collection.findOne({email: googleUser.email as string});

    if (!user) {
        await collection.insertOne({email: googleUser.email, name: googleUser.name}).then((r) => {
            const token = jwt.sign({_id: r.insertedId}, JWT_SECRET as string);
            res.redirect(`http://localhost:3000?access_token=${token}`);
        }).catch((e) => {
            console.log(e);
            res.redirect("http://localhost:3000/login");
        });
    } else {
        const token = jwt.sign({_id: user._id}, JWT_SECRET as string);
        res.redirect(`http://localhost:3000?access_token=${token}`);
    }
})

app.get("/logout", authorization, (req, res) => {
    return res.removeHeader("Authorization")
});

app.get("/user/:id", authorization, async (req, res) => {
    const number = req.params.id;
    let collection = db.collection("Customer");
    const user = await collection.findOne({phone: number as string});
    if (user) {
        res.json(user).status(200);
    } else {
        res.status(201).send('Customer not found');
    }
})

app.patch("/create-customer", authorization, async (req, res) => {
    const user = {...req.body, _id: new ObjectId()};

    let collection = db.collection("Customer");
    await collection.insertOne(user).then((result) => {
        res.status(201).send({
            message: "User Created Successfully",
            result,
        })
    }).catch((e) => {
        res.status(500).send({
            message: "Error creating user",
            e,
        });
    });

    // const user = await collection.findOne({phone: number as string});
    // if (user) {
    //     res.json(user).status(200);
    // } else {
    //     res.json({message: 'Customer not found !'}).status(400);
    // }
})

app.get("/profile", authorization, async (req, res) => {
    let collection = db.collection("Employee");
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        const decoded: { _id?: ObjectId } = jwt.verify(token, JWT_SECRET as string) as { _id?: ObjectId };
        if (decoded) {
            const user = await collection.findOne({_id: new ObjectId(decoded._id)});
            res.send({email: user?.email, name: user?.first + " " + user?.name}).status(200);
        } else
            return res.status(401).json({message: "can't find user"});
    } else
        return res.status(401).json({message: "authorization token not set"});
});

app.put("/update-profile", authorization, async (req, res) => {
    const {_id, email, name, phone, ZIP, address} = req.body;
    let collection = db.collection("Customer");
    let result = await collection.updateOne({_id: new ObjectId(_id)}, {$set : {"name":name, "email":email, "phone":phone, "ZIP":ZIP, "address":address}});
    res.send(result).status(200);
})

// start the Express server
function main() {
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}

main();

