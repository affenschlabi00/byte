
import { NextResponse } from 'next/server';

const globalPassPhrase = process.env.NEXT_PUBLIC_PASS_PHRASE;

export function middleware(req) {

    const url = req.nextUrl.pathname;

    if (!req.cookies.has(globalPassPhrase) && url !== '/access') {
        return NextResponse.redirect(new URL('/access', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|static|favicon.ico).*)'],
};
