/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { cn } from "@/lib/utils";
import { sha256 } from "js-sha256";
import { useState } from "react";

type User = {
  id?: string | null | undefined;
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
};

export function getUserAvatarUrl(user?: User | null) {
  if (user?.image) return user.image;

  if (!user?.id) return "https://api.dub.co/og/avatar";

  const ogAvatar = `https://api.dub.co/og/avatar?seed=${encodeURIComponent(user.id)}`;
  const encodedOGAvatar = `https://api.dub.co/og/avatar${encodeURIComponent(`?seed=${encodeURIComponent(user.id)}`)}`;

  return user.email
    ? `https://www.gravatar.com/avatar/${sha256(user.email)}?d=${encodeURIComponent(encodedOGAvatar)}`
    : ogAvatar;
}

export function Avatar({
  user = {},
  className,
}: {
  user?: User;
  className?: string;
}) {
  if (!user) {
    return (
      <div
        className={cn(
          "h-10 w-10 animate-pulse rounded-full border border-neutral-300 bg-neutral-100",
          className,
        )}
      />
    );
  }

  const [url, setUrl] = useState(getUserAvatarUrl(user));

  return (
    <img
      alt={`Avatar for ${user.name || user.email}`}
      referrerPolicy="no-referrer"
      src={url}
      className={cn(
        "h-10 w-10 rounded-full border border-neutral-300",
        className,
      )}
      draggable={false}
      onError={() => {
        setUrl(`https://api.dub.co/og/avatar?seed=${user.id}`);
      }}
    />
  );
}

export function TokenAvatar({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  return (
    <img
      src={`https://api.dicebear.com/9.x/shapes/svg?seed=${id}`}
      alt="avatar"
      className={cn("h-10 w-10 rounded-full", className)}
      draggable={false}
    />
  );
}
