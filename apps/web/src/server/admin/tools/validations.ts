import { type Tool, ToolStatus } from "@openalternative/db/client"
import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server"
import * as z from "zod"
import { getSortingStateParser } from "~/lib/parsers"
import { repositorySchema } from "~/server/schemas"

export const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(25),
  sort: getSortingStateParser<Tool>().withDefault([{ id: "createdAt", desc: true }]),
  name: parseAsString.withDefault(""),
  status: parseAsArrayOf(z.nativeEnum(ToolStatus)).withDefault([]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  operator: parseAsStringEnum(["and", "or"]).withDefault("and"),
})

export type GetToolsSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>

export const toolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  websiteUrl: z.string().min(1, "Website is required").url(),
  affiliateUrl: z.string().url().optional().or(z.literal("")),
  repositoryUrl: repositorySchema,
  tagline: z.string().optional(),
  description: z.string().optional(),
  content: z.string().optional(),
  faviconUrl: z.string().optional().or(z.literal("")),
  screenshotUrl: z.string().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isSelfHosted: z.boolean().default(false),
  submitterName: z.string().optional(),
  submitterEmail: z.string().email().optional().or(z.literal("")),
  submitterNote: z.string().optional(),
  hostingUrl: z.string().url().optional().or(z.literal("")),
  discountCode: z.string().optional(),
  discountAmount: z.string().optional(),
  publishedAt: z.coerce.date().nullish(),
  status: z.nativeEnum(ToolStatus).default("Draft"),
  alternatives: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
})

export type ToolSchema = z.infer<typeof toolSchema>
