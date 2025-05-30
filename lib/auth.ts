import { getRandomDigits } from "@primoui/utils"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { admin, createAuthMiddleware, magicLink, oneTimeToken } from "better-auth/plugins"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { cache } from "react"
import { config } from "~/config"
import { claimsConfig } from "~/config/claims"
import EmailMagicLink from "~/emails/magic-link"
import EmailWelcome from "~/emails/welcome"
import { env } from "~/env"
import { sendEmail } from "~/lib/email"
import { db } from "~/services/db"

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  socialProviders: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },

    github: {
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
  },

  session: {
    cookieCache: {
      enabled: true,
    },
  },

  account: {
    accountLinking: {
      enabled: true,
    },
  },

  hooks: {
    after: createAuthMiddleware(async ({ path, context }) => {
      const { newSession, responseHeaders } = context

      // Revalidate the callback URL after login
      if (path.startsWith("/callback/:id")) {
        const callbackURL = responseHeaders?.get("location")

        if (callbackURL) {
          revalidatePath(callbackURL)
        }
      }

      // Send a message to the user after registration
      if (path.startsWith("/sign-up")) {
        if (newSession) {
          const to = newSession.user.email
          const name = newSession.user.name
          const subject = `Welcome to ${config.site.name}`

          await sendEmail({ to, subject, react: EmailWelcome({ to, name }) })
        }
      }
    }),
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        const to = email
        const subject = `Your ${config.site.name} Login Link`

        await sendEmail({ to, subject, react: EmailMagicLink({ to, url }) })
      },
    }),

    oneTimeToken({
      expiresIn: claimsConfig.otpExpiration,
      generateToken: async () => getRandomDigits(claimsConfig.otpLength),
    }),

    admin(),
  ],
})

export const getServerSession = cache(async () => {
  return auth.api.getSession({
    headers: await headers(),
  })
})
