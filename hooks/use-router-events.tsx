"use client"
import { useRouter } from "next/navigation"

export function useRouterEvents() {
  const router = useRouter()

  const navigateWithHash = (path: string) => {
    if (path.includes("#")) {
      const [pathname, hash] = path.split("#")

      if (pathname === "" || pathname === "/") {
        // Navigate to homepage first, then scroll to section
        router.push("/")
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        }, 100)
      } else {
        router.push(path)
      }
    } else {
      router.push(path)
    }
  }

  return { navigateWithHash }
}
