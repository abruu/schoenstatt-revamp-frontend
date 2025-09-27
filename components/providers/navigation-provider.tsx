"use client"

import { useNavigationLoading } from "@/hooks/use-navigation-loading"
import { NavigationLoader } from "@/components/common/navigation-loader"

interface NavigationProviderProps {
  children: React.ReactNode
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const { isLoading } = useNavigationLoading()

  return (
    <>
      <NavigationLoader isLoading={isLoading} />
      {children}
    </>
  )
}
