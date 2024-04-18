import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyJwt } from "@/lib/jwt";
import jwt from "jsonwebtoken"



export const authOptions: NextAuthOptions   = {

    providers: [
      CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "email", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
        remember: { label: "remember", type: "checkbox" },
      },
      async authorize(credentials, req) {
  
          if (!credentials) {
              return null;
            }
   
            const searchParams = new URLSearchParams({
              email: credentials.email,
              password: credentials.password,
              remember:credentials.remember
            });
   
            
            const res = await fetch(`${process.env.NEXTAUTH_URL}/admin/login?email=${credentials.email}&password=${credentials.password}&remember=${credentials.remember}`,{
              method:'POST',
              headers: {
                "Accept": "application/json",
                "Content-Type":"application/json"
              }
            })
            
            if(res.status !== 200){
              throw new Error("Invalid credentials")
            }
        const user = await res.json()

        if (user) {
          return user
        } else {
          throw new Error("Invalid credentials")
        }
      }
    })
    ],
  pages:{
    signIn:"/auth/admin/signin",
    signOut:"/",
  },

 
 session: {
  strategy: "jwt",
  maxAge: 29 * 24 * 60 * 60
},





    callbacks: {
      async jwt({token, user}){

        const authenticatedUser =  verifyJwt(token?.token)
        return {...token, ...user}
      },
      async session({token, session}){
        const secret:any =  process.env.NEXTAUTH_URL
        const user = jwt.decode(token?.token, secret)
        session.user = user
        session.token = token.token
      
      return session
    }
  }
  }