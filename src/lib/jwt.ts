import jwt,{ JwtPayload } from "jsonwebtoken";

interface SignOption {
    expiresIn?: string | number;
}

const DEFAULT_SIGN_OPTION: SignOption = {
    expiresIn: "1h"
}

const secret = process.env.NEXTAUTH_SECRET

// export function signJwtAccessToken(payload:JwtPayload, options: SignOption = DEFAULT_SIGN_OPTION){
//     const secretKey = process.env.SECRET_KEY
// }

export  function verifyJwt(token:string){
    try {
        const decoded =  jwt.verify(token, secret as any)
        return decoded as JwtPayload
    } catch (error) {
        console.error(error)
    }
}