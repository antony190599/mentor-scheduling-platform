import { appRedirect, getUserViaToken, isTopLevelSettingsRedirect, parse } from "@/lib/middleware/utils";
import { NextRequest, NextResponse } from "next/server";
import WorkspacesMiddleware from "./workspace";
import { UserProps } from "../types";

export default async function AppMiddleware(req: NextRequest) {
  const { path, fullPath, searchParamsString } = parse(req);

  const user = await getUserViaToken(req);

  // if there's no user and the path isn't /login or /register, redirect to /login
  if (
    !user &&
    path !== "/login" &&
    path !== "/forgot-password" &&
    path !== "/register" &&
    path !== "/auth/saml" &&
    !path.startsWith("/auth/reset-password/") &&
    !path.startsWith("/share/")
  ) {
    return NextResponse.redirect(
      new URL(
        `/login${path === "/" ? "" : `?next=${encodeURIComponent(fullPath)}`}`,
        req.url
      )
    );

    // if there's a user
  } else if (
    [
      "/",
      "/login",
      "/register",
      "/workspaces",
    ].includes(path) ||
    path.startsWith("/settings/") ||
    isTopLevelSettingsRedirect(path)
  ) {
    return WorkspacesMiddleware(req, user as UserProps);
  } else if (appRedirect(path)) {
    return NextResponse.redirect(
      new URL(`${appRedirect(path)}${searchParamsString}`, req.url),
    );
  }

}
