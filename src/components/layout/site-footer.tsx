import { site } from "@/lib/site";

// Icons use fill="currentColor" so they follow the theme. The originals were
// hardcoded fill="white", which made them invisible in light mode.
const icons = {
  github: (
    <path d="M10 0C4.477 0 0 4.59 0 10.253c0 4.529 2.865 8.371 6.839 9.728.5.095.683-.223.683-.494 0-.244-.009-1.052-.014-1.909-2.782.62-3.369-1.21-3.369-1.21-.455-1.185-1.11-1.5-1.11-1.5-.907-.636.068-.623.068-.623 1.004.072 1.533 1.057 1.533 1.057.892 1.567 2.34 1.114 2.91.852.09-.663.35-1.115.636-1.371-2.22-.259-4.555-1.139-4.555-5.067 0-1.12.39-2.034 1.03-2.752-.104-.259-.447-1.302.096-2.714 0 0 .84-.275 2.75 1.051A9.417 9.417 0 0110 4.958c.85.004 1.705.118 2.504.345 1.909-1.326 2.747-1.051 2.747-1.051.544 1.412.202 2.455.098 2.714.641.718 1.028 1.632 1.028 2.752 0 3.938-2.339 4.805-4.566 5.059.359.318.679 .942.679 1.898 0 1.372-.012 2.477-.012 2.815 0 .273.18.593.687.492C17.138 18.62 20 14.78 20 10.253 20 4.59 15.522 0 10 0" />
  ),
  linkedin: (
    <path d="M2.5 18h3V6.9h-3V18zM4 2c-1 0-1.8.8-1.8 1.8S3 5.6 4 5.6s1.8-.8 1.8-1.8S5 2 4 2zm6.6 6.6V6.9h-3V18h3v-5.7c0-3.2 4.1-3.4 4.1 0V18h3v-6.8c0-5.4-5.7-5.2-7.1-2.6z" />
  ),
};

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-1"
    >
      <span>{label}</span>
      <svg
        width="15"
        height="15"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        className="opacity-0 duration-200 group-hover:opacity-100"
      >
        {children}
      </svg>
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 flex items-center gap-5 border-t border-black/10 pt-6 text-sm dark:border-white/15">
      <SocialLink href={site.links.github} label="github">
        {icons.github}
      </SocialLink>
      <SocialLink href={site.links.linkedin} label="linkedin">
        {icons.linkedin}
      </SocialLink>
      <a
        href="/feed.xml"
        className="ml-auto opacity-60 transition-opacity hover:opacity-100"
      >
        rss
      </a>
    </footer>
  );
}
