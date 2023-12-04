"use client"

import { useCallback, useEffect } from "react"

export function ThemeSync() {
  const callback = useCallback((e: MediaQueryListEvent | MediaQueryList) => {
    const isDark = e.matches
    const el = document.documentElement

    if (isDark) {
      el.classList.add("dark")
      el.classList.remove("light")
    } else {
      el.classList.add("light")
      el.classList.remove("dark")
    }
  }, [])

  // Manage transitions between light/dark mode
  useEffect(() => {
    const mql = window.matchMedia(MEDIA_QUERY.darkMode)

    // Set initially based on user preference
    callback(mql)

    mql.addEventListener("change", callback)

    return () => {
      mql.removeEventListener("change", callback)
    }
  }, [callback])

  return null
}

const MEDIA_QUERY = {
  darkMode: "(prefers-color-scheme: dark)",
}