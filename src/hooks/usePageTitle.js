import { useEffect } from 'react'

const APP = 'OnlyIndians'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP}` : APP
  }, [title])
}

export default usePageTitle