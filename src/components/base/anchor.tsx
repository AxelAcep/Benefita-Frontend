"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface AnchorProps {
  name: string;
  route: string;
}

export default function Anchor({ name, route }: AnchorProps) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    router.push(route);
  }

  return (
    <a
      href={route}
      onClick={handleClick}
      className="text-emerald-700 underline cursor-pointer hover:text-emerald-800"
    >
      {name}
    </a>
  );
}
