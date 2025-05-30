import { Prisma, ToolStatus } from "@prisma/client"
import { adOnePayload } from "~/server/web/ads/payloads"

export const alternativeOnePayload = Prisma.validator<Prisma.AlternativeSelect>()({
  id: true,
  name: true,
  slug: true,
  description: true,
  websiteUrl: true,
  faviconUrl: true,
  discountCode: true,
  discountAmount: true,
  adPrice: true,
  ad: { select: adOnePayload },
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export const alternativeManyPayload = Prisma.validator<Prisma.AlternativeSelect>()({
  id: true,
  name: true,
  slug: true,
  description: true,
  faviconUrl: true,
  adPrice: true,
  _count: { select: { tools: { where: { status: ToolStatus.Published } } } },
})

export type AlternativeOne = Prisma.AlternativeGetPayload<{ select: typeof alternativeOnePayload }>
export type AlternativeMany = Prisma.AlternativeGetPayload<{
  select: typeof alternativeManyPayload
}>
