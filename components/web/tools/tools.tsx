"use client"

import { useQueryStates } from "nuqs"
import { Box } from "~/components/common/box"
import { EmptyList } from "~/components/web/empty-list"
import { Pagination } from "~/components/web/pagination"
import { ToolCard, ToolCardSkeleton } from "~/components/web/tools/tool-card"
import { ToolsFilters, type ToolsFiltersProps } from "~/components/web/tools/tools-filters"
import { Grid } from "~/components/web/ui/grid"
import type { CategoryMany } from "~/server/categories/payloads"
import type { ToolMany } from "~/server/tools/payloads"
import { searchParams } from "~/server/tools/search-params"

type ToolsProps = ToolsFiltersProps & {
  tools: ToolMany[]
  categories?: CategoryMany[]
  totalCount: number
}

const Tools = ({ tools, totalCount, categories, ...props }: ToolsProps) => {
  const [{ q, perPage }] = useQueryStates(searchParams)

  return (
    <>
      <div className="flex flex-col gap-6 lg:gap-8">
        <ToolsFilters categories={categories} {...props} />

        <Grid>
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}

          {!tools.length && <EmptyList>No tools found{q ? ` for "${q}"` : ""}.</EmptyList>}
        </Grid>
      </div>

      <Pagination pageSize={perPage} totalCount={totalCount} />
    </>
  )
}

const ToolsSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 lg:gap-8">
      <Box className="px-4 py-2.5 text-sm/normal rounded-lg w-full">
        <span>&nbsp;</span>
      </Box>

      <Grid>
        {[...Array(6)].map((_, index) => (
          <ToolCardSkeleton key={index} />
        ))}
      </Grid>
    </div>
  )
}

export { Tools, ToolsSkeleton }
