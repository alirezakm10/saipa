import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user:any | undefined;
        token:string;
        expires: number; // Add the 'expires' property of type 'string
    }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt"{
    interface JWT {
        user:any | undefined;
        token:string;
        
    }
}
