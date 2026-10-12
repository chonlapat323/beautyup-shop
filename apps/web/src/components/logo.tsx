import clsx from "clsx";
import Image from "next/image";
import logo from "../../public/logo.png";

/** BeautyUp Enterprise logo. On dark backgrounds it sits on a light badge to keep the black wordmark readable. */
export function Logo({
  className,
  onDark = false,
  priority = false,
}: {
  className?: string;
  onDark?: boolean;
  priority?: boolean;
}) {
  const img = (
    <Image
      src={logo}
      alt="BeautyUp Enterprise"
      priority={priority}
      className={clsx("h-12 w-auto sm:h-14 lg:h-16", className)}
    />
  );
  return onDark ? <span className="inline-block rounded-2xl bg-cream px-3 py-2">{img}</span> : img;
}
