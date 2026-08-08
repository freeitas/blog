import * as runtime from "react/jsx-runtime";

import { mdxComponents } from "./mdx-components";

/**
 * Velite compiles MDX with `outputFormat: 'function-body'`, so the stored value
 * is a function body string rather than a module. Evaluating it here keeps the
 * whole thing in the server component — do NOT add "use client", or the entire
 * compiled source gets serialised into the RSC payload and shipped to the browser.
 */
const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

interface MDXProps {
  code: string;
  components?: Record<string, React.ComponentType<unknown>>;
}

// react-hooks/static-components guards against components losing state when
// their identity changes between renders. That cannot happen here: this is a
// server component whose output is prerendered once at build time, and the
// compiled MDX holds no state. Constructing the component from `code` is the
// entire purpose of this module, so the rule is disabled for it deliberately.
/* eslint-disable react-hooks/static-components */
export function MDXContent({ code, components }: MDXProps) {
  const Component = useMDXComponent(code);
  return <Component components={{ ...mdxComponents, ...components }} />;
}
/* eslint-enable react-hooks/static-components */
