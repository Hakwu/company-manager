import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, JWT_SECRET,} from "../config";
import querystring from "querystring";
import axios from "axios";
import jwt from "jsonwebtoken";

export const getGoogleAuth = () =>  {
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

export const getTokens = async ({
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
}> => {
    const url = "https://oauth2.googleapis.com/token";
    const values = {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
    };

    try {
        const res = await axios.post(url, querystring.stringify(values), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        return res.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

// export const getGoogleUser = () => {

