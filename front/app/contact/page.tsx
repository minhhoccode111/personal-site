import { Button } from "@/components/ui/button";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Contact`,
};

export default function Page() {
  return (
    <main className="flex-1">
      <div className="">
        <p className="">Contact</p>
      </div>

      <div className="">
        <Button>Click me</Button>
      </div>
    </main>
  );
}
