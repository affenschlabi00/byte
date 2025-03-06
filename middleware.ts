import { NextResponse, NextRequest } from 'next/server';

const globalPassPhrase = process.env.NEXT_PUBLIC_PASS_PHRASE;

export function middleware(req: NextRequest) {

    if (typeof globalPassPhrase === 'undefined') {
        return NextResponse.redirect(new URL('/access', req.url));
    }

    if (!req.cookies.has(globalPassPhrase)) {
        return NextResponse.redirect(new URL('/access', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|static|favicon.ico|access).*)'],
};
