/* eslint-disable @typescript-eslint/no-unused-vars */
import { AppMiddleware } from "@/lib/middleware";
import { parse } from "@/lib/middleware/utils";
import { APP_HOSTNAMES } from "@/lib/utils";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";


export const config = {
    matcher: [
      /*
       * Match all paths except for:
       * 1. /api/ routes
       * 2. /_next/ (Next.js internals)
       * 3. /_proxy/ (proxies for third-party services)
       * 4. Metadata files: favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest
       */
      "/((?!api/|_next/|_proxy/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest).*)",
    ],
  };

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const { domain, path, key, fullKey } = parse(req);
    if (APP_HOSTNAMES.has(domain)) {
        return AppMiddleware(req);
    }

    return NextResponse.next({
        request: {
            headers: req.headers,
        },
    }); 
}