import Link from "next/link";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "Build a uniform", href: "/build" },
      { label: "Lookbook", href: "/lookbook" },
      { label: "About", href: "/about" },
    ],
  },
  {
    title: "Information",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Terms", href: "/terms" },
      { label: "Privacy", href: "/privacy" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-bone">
      <div className="lvry-container py-16 md:py-20">
        <div className="grid gap-12 border-b border-border pb-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="font-display text-5xl font-bold tracking-[-0.09em]"
            >
              LVRY<span className="text-signal">.</span>
            </Link>

            <p className="mt-4 text-sm text-muted">
              The everyday uniform.
            </p>

            <p className="handwritten mt-8 -rotate-3 text-2xl text-denim">
              Made to repeat.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h2 className="eyebrow mb-5 text-muted">{group.title}</h2>

              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-opacity hover:opacity-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between gap-5 pt-6 text-[10px] text-muted sm:flex-row sm:items-center">
          <p>
            LVRY is a fictional brand concept and portfolio project. No
            commercial orders are processed.
          </p>

          <span className="font-mono uppercase tracking-wider">
            © LVRY / 2026
          </span>
        </div>
      </div>
    </footer>
  );
}