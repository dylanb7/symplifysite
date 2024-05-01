"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { links } from "./nav";
import { buttonVariants } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const MainNav: React.FC = () => {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Avatar>
          <AvatarImage src={"/symplify.png"} />
          <AvatarFallback>Symplify</AvatarFallback>
        </Avatar>

        <span className="hidden font-bold sm:inline-block">Symplify</span>
      </Link>
      <nav className="flex items-center gap-4 text-sm lg:gap-6">
        {links.map((link) => (
          <div key={link.name} className="flex flex-row items-center gap-1">
            <Link
              key={link.name}
              href={link.href}
              className={buttonVariants({ variant: "link" })}
            >
              {link.name}
            </Link>
            {link.image && (
              <Avatar className="h-7 w-7 no-underline">
                <AvatarImage src={link.image.src} />
                <AvatarFallback>{link.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            )}
            {link.icon && link.icon}
          </div>
        ))}
      </nav>
    </div>
  );
};
