import { NextAuthOptions } from "next-auth";
import { JWT, JWTDecodeParams } from "next-auth/jwt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyJwt } from "@/lib/jwt";
import jwt from "jsonwebtoken"
import { authOptions } from "@/app/helpers/authOptions";

  



const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

