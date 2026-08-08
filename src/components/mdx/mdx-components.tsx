import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";

/**
 * Component map injected into every compiled MDX document.
 *
 * Deliberately does NOT override `pre` or `code`: the compiled MDX passes
 * `style` and `data-*` attributes through those tags, and a wrapper that drops
 * them silently kills all syntax highlighting.
 */
export const mdxComponents = {
  // width/height come from the remarkImageDimensions plugin in velite.config.ts.
  // Together with `h-auto` they let the browser derive an aspect ratio and
  // reserve space before the image loads, which is what prevents layout shift.
  img: (props: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={props.alt ?? ""}
      loading="lazy"
      decoding="async"
      className="h-auto rounded-md"
    />
  ),
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    if (href?.startsWith("/")) {
      return (
        <Link href={href} {...props}>
          {children}
        </Link>
      );
    }
    if (href?.startsWith("#")) {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },
};
