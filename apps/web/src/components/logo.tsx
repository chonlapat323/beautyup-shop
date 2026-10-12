import clsx from "clsx";
import Image from "next/image";
import logo from "../../public/logo.png";

/** BeautyUp Enterprise logo (transparent PNG). */
export function Logo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={logo}
      alt="BeautyUp Enterprise"
      priority={priority}
      className={clsx("h-12 w-auto sm:h-14 lg:h-16", className)}
    />
  );
}
