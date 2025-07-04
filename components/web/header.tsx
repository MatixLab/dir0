"use client"

import { usePathname } from "next/navigation"
import { type ComponentProps, useEffect, useState } from "react"
import { Button } from "~/components/common/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/common/dropdown-menu"
import { Icon } from "~/components/common/icon"
import { Link } from "~/components/common/link"
import { Stack } from "~/components/common/stack"
import { ExternalLink } from "~/components/web/external-link"
import { Container } from "~/components/web/ui/container"
import { Hamburger } from "~/components/web/ui/hamburger"
import { Logo } from "~/components/web/ui/logo"
import { NavLink, navLinkVariants } from "~/components/web/ui/nav-link"
import { UserMenu } from "~/components/web/user-menu"
import { config } from "~/config"
import { useSearch } from "~/contexts/search-context"
import type { auth } from "~/lib/auth"
import { cx } from "~/utils/cva"

type HeaderProps = ComponentProps<"div"> & {
  session: typeof auth.$Infer.Session | null
}

const Header = ({ children, className, session, ...props }: HeaderProps) => {
  const pathname = usePathname()
  const search = useSearch()
  const [isNavOpen, setNavOpen] = useState(false)

  // Close the mobile navigation when the user presses the "Escape" key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false)
    }

    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    setNavOpen(false)
  }, [pathname])

  return (
    <div
      className={cx("fixed top-(--header-top) inset-x-0 z-50 bg-background", className)}
      id="header"
      role="banner"
      data-state={isNavOpen ? "open" : "close"}
      {...props}
    >
      <Container>
        <div className="flex items-center py-3.5 gap-4 text-sm h-(--header-height) md:gap-6">
          <Stack size="sm" wrap={false} className="mr-auto">
            <button
              type="button"
              onClick={() => setNavOpen(!isNavOpen)}
              className="block -m-1 -ml-1.5 lg:hidden"
            >
              <Hamburger className="size-7" />
            </button>

            <Logo />
          </Stack>

          <nav className="flex flex-wrap gap-4 max-md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger className={cx(navLinkVariants({ className: "gap-1" }))}>
                Browse{" "}
                <Icon
                  name="lucide/chevron-down"
                  className="group-data-[state=open]:-rotate-180 duration-200"
                />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <NavLink href="/latest">
                    <Icon name="lucide/calendar-days" className="shrink-0 size-4 opacity-75" />{" "}
                    Latest
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink href="/self-hosted">
                    <Icon name="lucide/server" className="shrink-0 size-4 opacity-75" /> Self-hosted
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink href="/coming-soon">
                    <Icon name="lucide/clock" className="shrink-0 size-4 opacity-75" /> Coming Soon
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink href="/categories">
                    <Icon name="lucide/tags" className="shrink-0 size-4 opacity-75" /> Categories
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink href="/stacks">
                    <Icon name="lucide/blocks" className="shrink-0 size-4 opacity-75" /> Tech Stacks
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink href="/topics">
                    <Icon name="lucide/tag" className="shrink-0 size-4 opacity-75" /> Topics
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink href="/licenses">
                    <Icon name="lucide/copyright" className="shrink-0 size-4 opacity-75" /> Licenses
                  </NavLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink href="/alternatives">Alternatives</NavLink>
            <NavLink href="/self-hosted">Self-hosted</NavLink>
            <NavLink href="/advertise">Advertise</NavLink>
          </nav>

          <Stack size="sm" wrap={false}>
            <Button
              size="sm"
              variant="ghost"
              aria-label="Search"
              className="p-1"
              onClick={search.open}
            >
              <Icon name="lucide/search" className="size-4" />
            </Button>

            <Button size="sm" variant="ghost" aria-label="GitHub" className="p-1 -ml-1.5" asChild>
              <ExternalLink href={config.links.github}>
                <Icon name="tabler/brand-github" className="size-4" />
              </ExternalLink>
            </Button>

            <Button size="sm" variant="secondary" asChild>
              <Link href="/submit">Submit</Link>
            </Button>

            <UserMenu session={session} />
          </Stack>
        </div>

        <nav
          className={cx(
            "absolute top-full inset-x-0 h-[calc(100dvh-var(--header-top)-var(--header-height))] -mt-px py-4 px-6 grid grid-cols-2 place-items-start place-content-start gap-x-4 gap-y-6 bg-background/90 backdrop-blur-lg transition-opacity lg:hidden",
            isNavOpen ? "opacity-100" : "opacity-0 pointer-events-none",
          )}
        >
          <NavLink href="/latest" className="text-base">
            Latest
          </NavLink>
          <NavLink href="/self-hosted" className="text-base">
            Self-hosted
          </NavLink>
          <NavLink href="/coming-soon" className="text-base">
            Coming Soon
          </NavLink>
          <NavLink href="/alternatives" className="text-base">
            Alternatives
          </NavLink>
          <NavLink href="/categories" className="text-base">
            Categories
          </NavLink>
          <NavLink href="/stacks" className="text-base">
            Tech Stacks
          </NavLink>
          <NavLink href="/topics" className="text-base">
            Topics
          </NavLink>
          <NavLink href="/submit" className="text-base">
            Submit
          </NavLink>
          <NavLink href="/advertise" className="text-base">
            Advertise
          </NavLink>
          <NavLink href="/about" className="text-base">
            About
          </NavLink>
        </nav>
      </Container>
    </div>
  )
}

const HeaderBackdrop = () => {
  return (
    <div className="fixed top-(--header-offset) inset-x-0 z-40 h-8 pointer-events-none bg-linear-to-b from-background to-transparent" />
  )
}

export { Header, HeaderBackdrop, type HeaderProps }
