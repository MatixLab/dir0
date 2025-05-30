import { formatDate } from "@primoui/utils"
import { differenceInDays } from "date-fns"
import type { ComponentProps } from "react"
import { Icon } from "~/components/common/icon"
import { Stack } from "~/components/common/stack"
import { Tooltip } from "~/components/common/tooltip"
import { Discount } from "~/components/web/discount"
import type { ToolMany, ToolManyExtended, ToolOne } from "~/server/web/tools/payloads"
import { cx } from "~/utils/cva"

type ToolBadgesProps = ComponentProps<typeof Stack> & {
  tool: ToolOne | ToolMany | ToolManyExtended
}

export const ToolBadges = ({ tool, children, className, ...props }: ToolBadgesProps) => {
  const { firstCommitDate, publishedAt, discountCode, discountAmount } = tool

  const commitDiff = firstCommitDate ? differenceInDays(new Date(), firstCommitDate) : null
  const isNew = commitDiff !== null && commitDiff <= 365
  const isScheduled = publishedAt !== null && publishedAt > new Date()

  return (
    <Stack
      size="sm"
      wrap={false}
      className={cx("justify-end text-sm empty:hidden", className)}
      {...props}
    >
      {isNew && (
        <Tooltip tooltip="Repo is less than 1 year old">
          <Icon name="lucide/sparkles" className="size-4 text-yellow-500" />
        </Tooltip>
      )}

      {isScheduled && (
        <Tooltip tooltip={`Scheduled for ${formatDate(publishedAt)}`}>
          <Icon name="lucide/clock" className="size-4 text-yellow-500" />
        </Tooltip>
      )}

      {discountAmount && (
        <Tooltip tooltip={<Discount amount={discountAmount} code={discountCode} />}>
          <Icon name="lucide/square-percent" className="size-4 text-green-500" />
        </Tooltip>
      )}

      {children}
    </Stack>
  )
}
