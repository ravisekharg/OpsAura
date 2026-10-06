import { Badge } from "@/components/ui/badge"
import type { BadgeProps } from "@/components/ui/badge"

type Env = "DEV" | "QA" | "UAT" | "PROD"

const envVariantMap: Record<Env, BadgeProps["variant"]> = {
  DEV: "dev",
  QA: "qa",
  UAT: "uat",
  PROD: "prod",
}

export function EnvBadge() {
  const env = (process.env.NEXT_PUBLIC_APP_ENV ?? "DEV") as Env
  const variant = envVariantMap[env] ?? "dev"
  return <Badge variant={variant}>{env}</Badge>
}
