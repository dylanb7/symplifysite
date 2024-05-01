"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Image from "next/image";

import { cn } from "~/lib/utils";
import { links } from "./nav";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

import { ScrollArea } from "./ui/scroll-area";

export const MobileNav: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <HamburgerMenuIcon />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <Image
            unoptimized
            width={75}
            height={75}
            src={"/symplify.png"}
            alt=""
          />
        </MobileLink>
        <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {links.map((link) => (
              <div key={link.name} className="flex flex-row items-center gap-2">
                <MobileLink
                  href={link.href}
                  onOpenChange={setOpen}
                  className={buttonVariants({ variant: "link" })}
                >
                  {link.name}
                </MobileLink>
                {link.image && (
                  <Avatar className="h-7 w-7 no-underline">
                    <AvatarImage src={link.image.src} />
                    <AvatarFallback>{link.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                )}
                {link.icon && link.icon}
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

const MobileLink: React.FC<
  React.PropsWithChildren<{
    href: string;
    onOpenChange: (open: boolean) => void;
    className?: string;
  }>
> = ({ href, onOpenChange, children, className }) => {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={async () => {
        await router.push({ href });
        onOpenChange(false);
      }}
      className={className ? cn(className) : undefined}
    >
      {children}
    </Link>
  );
};
