/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserProps } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { isValidInternalRedirect, parse } from "./utils";

export default async function WorkspacesMiddleware(
  req: NextRequest,
  user: UserProps,
) {
  const { path, searchParamsObj, searchParamsString } = parse(req);

  // Handle ?next= query param with proper validation to prevent open redirects
  if (
    searchParamsObj.next &&
    isValidInternalRedirect(searchParamsObj.next, req.url)
  ) {
    return NextResponse.redirect(new URL(searchParamsObj.next, req.url));
  }

    return NextResponse.redirect(
      new URL(
        `/${path}${searchParamsString}`,
        req.url,
      ),
    );
}
