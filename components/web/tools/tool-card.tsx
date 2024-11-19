import { formatNumber } from "@curiousleaf/utils"
import { formatDistanceToNowStrict } from "date-fns"
import { GitForkIcon, StarIcon, TimerIcon } from "lucide-react"
import Link from "next/link"
import { posthog } from "posthog-js"
import type { ComponentProps } from "react"
import { H4 } from "~/components/common/heading"
import { Skeleton } from "~/components/common/skeleton"
import { Stack } from "~/components/common/stack"
import { ToolBadges } from "~/components/web/tools/tool-badges"
import { Badge } from "~/components/web/ui/badge"
import { Card } from "~/components/web/ui/card"
import { Favicon } from "~/components/web/ui/favicon"
import { Insights } from "~/components/web/ui/insights"
import type { ToolMany } from "~/server/tools/payloads"

type ToolCardProps = ComponentProps<typeof Card> & {
  tool: ToolMany

  /**
   * Disables the view transition.
   */
  isRelated?: boolean
}

const ToolCard = ({ className, tool, isRelated, ...props }: ToolCardProps) => {
  const featuredFlag = posthog.getFeatureFlag("featured_badge")?.toString()

  const insights = [
    { label: "Stars", value: formatNumber(tool.stars, "standard"), icon: <StarIcon /> },
    { label: "Forks", value: formatNumber(tool.forks, "standard"), icon: <GitForkIcon /> },
    {
      label: "Last commit",
      value:
        tool.lastCommitDate && formatDistanceToNowStrict(tool.lastCommitDate, { addSuffix: true }),
      icon: <TimerIcon />,
    },
  ]

  return (
    <Card asChild {...props}>
      <Link
        href={`/${tool.slug}`}
        prefetch
        onClick={() =>
          tool.isFeatured && posthog.capture("click_tool_featured", { slug: tool.slug })
        }
      >
        {tool.isFeatured && featuredFlag && (
          <>
            {featuredFlag.includes("bg") && <Card.Bg />}

            {featuredFlag.includes("badge") && (
              <Card.Badges>
                <Badge variant="outline">Featured</Badge>
              </Card.Badges>
            )}
          </>
        )}

        <Card.Header>
          <Favicon src={tool.faviconUrl} title={tool.name} />

          <H4 as="h3" className="truncate">
            {tool.name}
          </H4>

          <ToolBadges tool={tool} size="sm" className="ml-auto text-base">
            {tool.discountAmount && <Badge variant="success">Get {tool.discountAmount}!</Badge>}
          </ToolBadges>
        </Card.Header>

        {tool.tagline && <Card.Description>{tool.tagline}</Card.Description>}

        <Insights insights={insights} className="mt-auto" />
      </Link>
    </Card>
  )
}

const ToolCardSkeleton = () => {
  const insights = [
    { label: "Stars", value: <Skeleton className="h-4 w-16" />, icon: <StarIcon /> },
    { label: "Forks", value: <Skeleton className="h-4 w-14" />, icon: <GitForkIcon /> },
    { label: "Last commit", value: <Skeleton className="h-4 w-20" />, icon: <TimerIcon /> },
  ]

  return (
    <Card hover={false} className="items-stretch select-none">
      <Card.Header>
        <Favicon src={null} className="animate-pulse" />

        <H4 className="w-2/3">
          <Skeleton>&nbsp;</Skeleton>
        </H4>
      </Card.Header>

      <Card.Description className="flex flex-col gap-0.5">
        <Skeleton className="h-5 w-4/5">&nbsp;</Skeleton>
        <Skeleton className="h-5 w-1/2">&nbsp;</Skeleton>
      </Card.Description>

      <Stack size="sm">
        <Insights insights={insights} className="mt-auto animate-pulse" />
      </Stack>
    </Card>
  )
}

export { ToolCard, ToolCardSkeleton }
