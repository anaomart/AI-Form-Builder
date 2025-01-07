"use client";
import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "@/hooks/use-toast";
import { ImShare } from "react-icons/im";

export default function FormLinkShare({ shareURL }: { shareURL: string }) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, [mounted]);
  if (!mounted) {
    return null;
  }
  const shareLink = `${window.location.origin}/submit/${shareURL}` || `$https://ai-form-builder-one.vercel.app/submit/${shareURL}`;

  return (
    <div className="flex flex-grow gap-4 items-center">
      <Input value={shareLink} readOnly />
      <Button
        onClick={() => {
          navigator.clipboard.writeText(shareLink);
          toast({
            title: "Copied!",
            description: "Share link has been copied to clipboard",
          });
        }}
        color="primary"
        className="max-w-[250px] min-w-[200px]"
      >
        Share Link
        <ImShare />
      </Button>
    </div>
  );
}
