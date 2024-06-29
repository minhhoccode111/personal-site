import OutsideLink from "./outside-link";

export default function SiteFooter() {
  return (
    <footer className="flex items-center justify-center p-2">
      <p className="">
        Made by{" "}
        <OutsideLink href="https://github.com/minhhoccode111">
          minhhoccode111
        </OutsideLink>
        .
      </p>
    </footer>
  );
}
