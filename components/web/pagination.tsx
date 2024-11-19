"use client"

import { getCurrentPage, getPageLink } from "@curiousleaf/utils"
import { MoveLeftIcon, MoveRightIcon } from "lucide-react"
import { usePathname, useSearchParams } from "next/navigation"
import { type HTMLAttributes, useMemo } from "react"
import { PaginationLink } from "~/components/web/pagination-link"
import { navigationLinkVariants } from "~/components/web/ui/navigation-link"
import { type UsePaginationProps, usePagination } from "~/hooks/use-pagination"
import { cx } from "~/utils/cva"

export type PaginationProps = HTMLAttributes<HTMLElement> & Omit<UsePaginationProps, "currentPage">

export const Pagination = ({
  className,
  totalCount,
  pageSize = 1,
  siblingCount,
  ...props
}: PaginationProps) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const currentPage = useMemo(() => getCurrentPage(params.get("page")), [params])
  const pageCount = Math.ceil(totalCount / pageSize)

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    pageSize,
    siblingCount,
  })

  if (paginationRange.length <= 1) {
    return null
  }

  return (
    <nav
      className={cx("-mt-px flex w-full items-start justify-between md:w-auto", className)}
      {...props}
    >
      <PaginationLink
        href={getPageLink(params, pathname, currentPage - 1)}
        isDisabled={currentPage <= 1}
        prefix={<MoveLeftIcon />}
        rel="prev"
      >
        prev
      </PaginationLink>

      <p className="text-sm text-muted md:hidden">
        Page {currentPage} of {pageCount}
      </p>

      <div className="flex items-center flex-wrap gap-3 max-md:hidden">
        <span className="text-sm text-muted">Page:</span>

        {paginationRange.map((page, index) => (
          <div key={`page-${index}`}>
            {typeof page === "string" && <span className={navigationLinkVariants()}>{page}</span>}

            {typeof page === "number" && (
              <PaginationLink
                href={getPageLink(params, pathname, page)}
                isActive={currentPage === page}
                className="min-w-5 justify-center"
              >
                {page}
              </PaginationLink>
            )}
          </div>
        ))}
      </div>

      <PaginationLink
        href={getPageLink(params, pathname, currentPage + 1)}
        isDisabled={currentPage >= pageCount}
        suffix={<MoveRightIcon />}
        rel="prev"
      >
        next
      </PaginationLink>
    </nav>
  )
}
