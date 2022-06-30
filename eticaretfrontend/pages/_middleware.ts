import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

const secret = String(process.env.JWT_KEY);

export default function Middleware(req: NextRequest) {
    const { origin } = req.nextUrl;
    // @ts-ignore
    const access_token = req.cookies.access_token

    if (req.nextUrl.pathname === "/signin" || req.nextUrl.pathname === "/signup") {
        if (access_token) {
            try {
                jwt.verify(access_token, secret)
                return NextResponse.redirect(`${origin}/products`);
            } catch (e) {
                return NextResponse.next();
            }
        }
    }

    if (req.nextUrl.pathname.startsWith('/products') || req.nextUrl.pathname === '/categories') {
        if (access_token === undefined || access_token === null || access_token === "") {
            return NextResponse.redirect(`${origin}/signin`);
        }
        try {
            jwt.verify(access_token, secret)
            return NextResponse.next();

        } catch (e) {
            console.log(e);
            return NextResponse.redirect(`${origin}/products`);
        }
    }

    if (req.nextUrl.pathname === '/') {
        return NextResponse.redirect(`${origin}/categories`);
    }

    if (req.nextUrl.pathname === "/logout") {
        if (access_token === undefined || access_token === null || access_token === "") {
            return NextResponse.redirect(`${origin}`);
        }
        try {
            if (Cookies.get("access_token")) {
                Cookies.remove("access_token");
            }
            return NextResponse.next();

        } catch (e) {
            console.log(e);
            return NextResponse.redirect(`${origin}/products`);
        }
    }

    return NextResponse.next();
}