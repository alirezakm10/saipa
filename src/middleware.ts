import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import Cookies from "js-cookie";



const secret = process.env.NEXTAUTH_SECRET;
const authPahts = [
  "/adminpanel/shop", 
  "/adminpanel/shop/addproduct", 
  "/adminpanel/guarantee", 
  "/adminpanel/news"];

export async function middleware(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('token')
  console.log('retrived token from query parameters: ', searchParams)
  // @ts-ignore
  const session = await getToken({ req, secret });
  if (!session) {
    if(authPahts.includes(req.nextUrl.pathname)){
      return NextResponse.redirect(new URL('/auth/admin/signin', req.url));
    }
    // const url = req.nextUrl.clone()
    // url.pathname = '/auth/admin/signin'
    // NextResponse.rewrite(url)
  }
  NextResponse.next();
}

// export const config = { matcher: ["/adminpanel/:path*"] }
