import type { ComponentProps } from "react";

type ExternalLinkProps = ComponentProps<"a"> & {
  href: string;
};

export function ExternalLink({ href, children, ...props }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}
