import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import React from "react";
import { CheckIcon, ClipboardIcon } from "@radix-ui/react-icons";
import { toast } from "./ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export type variant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link";

export const CopyButton: React.FC<{
  value: string;
  copyMessage: string;
  variant?: variant;
  className?: string;
}> = ({ value, className, variant = "ghost", copyMessage, ...props }) => {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant={variant}
            className={cn("relative z-10 h-6 w-6  [&_svg]:size-3", className)}
            onClick={async () => {
              await navigator.clipboard.writeText(value);
              setHasCopied(true);
              toast({ title: copyMessage });
            }}
            {...props}
          >
            <span className="sr-only">Copy</span>
            {hasCopied ? (
              <CheckIcon className="h-8 w-8" />
            ) : (
              <ClipboardIcon className="h-8 w-8" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy to clipboard</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
