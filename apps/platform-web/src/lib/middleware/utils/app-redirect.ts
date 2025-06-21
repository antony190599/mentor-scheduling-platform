
const APP_REDIRECTS = {
    "/account": "/account/settings",
    "/referrals": "/account/settings/referrals",
    "/onboarding": "/onboarding/welcome",
    "/welcome": "/onboarding/welcome",
  };

export const appRedirect = (path: string) => {
    if (APP_REDIRECTS[path]) {
        return APP_REDIRECTS[path];
    }

    return null;
} 