import { Stack } from "~/components/common/stack"
import { AdsPicker } from "~/components/web/ads-picker"
import { AdsPickerAlternatives } from "~/components/web/ads-picker-alternatives"
import { ExternalLink } from "~/components/web/external-link"
import { adsConfig } from "~/config/ads"
import { findAds } from "~/server/web/ads/queries"
import { findRelatedAlternativeIds } from "~/server/web/alternatives/queries"

import { findAlternatives } from "~/server/web/alternatives/queries"

type AdvertisePickersProps = {
  alternative: string | null
}

export const AdvertisePickers = async ({ alternative }: AdvertisePickersProps) => {
  if (alternative !== null) {
    const alternatives = await findAlternatives({
      where: {
        pageviews: { gte: adsConfig.minPageviewThreshold },
        adPrice: { not: null },
        ad: null,
      },
      orderBy: { pageviews: "desc" },
    })

    const relatedIds = alternative
      ? await findRelatedAlternativeIds({
          id: alternative,
          limit: 10,
          rankingScoreThreshold: 0.5,
          filter: `id IN [${alternatives.map(a => a.id).join(",")}]`,
        })
      : []

    return (
      <AdsPickerAlternatives
        alternatives={alternatives}
        selectedId={alternative}
        relatedIds={relatedIds}
      />
    )
  }

  const ads = await findAds({})

  return (
    <div className="flex flex-col items-center gap-4 md:gap-6">
      <AdsPicker ads={ads} className="mx-auto" />

      <Stack
        size="sm"
        className="mx-auto justify-center text-center opacity-80 duration-200 hover:opacity-100"
        asChild
      >
        <ExternalLink href="https://openads.co" doFollow>
          <span className="text-xs text-muted-foreground">Powered by</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 180 40"
            width="180"
            height="40"
            role="img"
            aria-label="OpenAds Logo"
            fill="none"
            className="h-4 w-auto"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20 40c11.046 0 20-8.954 20-20S31.046 0 20 0 0 8.954 0 20s8.954 20 20 20ZM9.361 11.915c-2.978 5.957-2.127 16.596 0 18.723 2.128 2.128 14.468 2.128 16.17 1.702 1.703-.425 6.383-3.404 7.234-8.085.852-4.68-1.276-15.319-4.68-17.446-3.405-2.128-14.893.85-18.724 5.106Z"
            />
            <path
              fill="currentColor"
              d="M172.204 31.42c-4.08 0-6.48-1.47-6.93-4.95l3.78-.3c.21 1.77 1.2 2.52 3.12 2.52 1.8 0 2.82-.69 2.82-2.01 0-1.02-.57-1.59-2.01-1.92l-2.34-.54c-3.15-.66-5.04-2.04-5.04-4.65 0-2.91 2.43-4.74 6.63-4.74 3.57 0 5.94 1.44 6.6 4.74l-3.78.33c-.3-1.59-1.29-2.31-2.97-2.31-1.68 0-2.61.66-2.61 1.74 0 .87.6 1.41 2.19 1.77l2.46.54c3.42.72 4.92 2.25 4.92 4.8 0 3.21-2.37 4.98-6.84 4.98ZM159.252 10h4.02v21h-4.02v-2.73c-.78 2.01-2.61 3.15-5.07 3.15-4.17 0-6.87-3.3-6.87-8.31 0-5.19 2.91-8.28 6.87-8.28 2.52 0 4.26 1.2 5.07 3.03V10Zm-3.84 18.3c2.19 0 3.93-1.53 3.93-5.19 0-3.72-1.74-5.25-3.93-5.25-2.19 0-3.93 1.53-3.93 5.25 0 3.66 1.74 5.19 3.93 5.19ZM142.317 31l-1.71-5.37h-7.92l-1.71 5.37h-4.32l7.2-21h6.03l7.23 21h-4.8Zm-8.67-8.4h5.97l-3-9.42-2.97 9.42ZM119.91 14.83c3.48 0 5.61 2.22 5.61 6.27V31h-4.08v-9.06c0-2.94-1.14-4.11-3.27-4.11-2.28 0-3.63 1.35-3.63 4.11V31h-4.08V15.25h4.08v2.76c.72-1.89 2.7-3.18 5.37-3.18ZM100.367 14.83c5.49 0 8.22 3.9 7.92 9.06h-11.91c.06 2.43 1.23 4.53 4.23 4.53 1.95 0 3.3-.9 3.84-2.88l3.6.63c-.78 2.94-3.18 5.25-7.5 5.25-5.19 0-8.28-3.33-8.28-8.34 0-5.1 3.27-8.25 8.1-8.25Zm-3.99 6.63h7.77c-.03-1.77-1.14-3.72-3.78-3.72-2.55 0-3.87 1.86-3.99 3.72ZM84.356 14.83c4.08 0 6.6 3.21 6.6 8.31 0 5.01-2.43 8.28-6.6 8.28-2.43 0-4.29-1.05-5.4-3.06v8.34h-4.02V15.25h3.96v2.7c.99-1.98 3-3.12 5.46-3.12Zm-1.47 13.53c2.25 0 3.93-1.71 3.93-5.22 0-3.54-1.68-5.25-3.93-5.25-2.28 0-3.96 1.71-3.96 5.25 0 3.51 1.68 5.22 3.96 5.22ZM62.32 31.42C55.99 31.42 52 27.04 52 20.5S55.99 9.58 62.32 9.58s10.35 4.38 10.35 10.92-4.02 10.92-10.35 10.92Zm0-3.6c3.45 0 5.73-2.43 5.73-7.32 0-4.89-2.28-7.35-5.73-7.35-3.45 0-5.73 2.46-5.73 7.35s2.28 7.32 5.73 7.32Z"
            />
          </svg>
        </ExternalLink>
      </Stack>
    </div>
  )
}
