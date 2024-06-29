import { Button } from "@/components/ui/button";

export default function Page() {
  const string = process.env.NEXT_PUBLIC_API_URL;

  console.log(`process.env.NEXT_PUBLIC_API_URL belike: `, string);

  return (
    <main className="flex-1">
      <div className="">
        <p className="">Dummy</p>
      </div>

      <div className="">
        <Button>Click me</Button>
      </div>

      {/*
      <div className="">
        <p className="">{string}</p>
      </div> 
      */}
    </main>
  );
}
