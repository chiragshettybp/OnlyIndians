import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getSubscriptions, getUnreadCount, isSubscribed, listTrendingCreators } from '../lib/api'
import { PLATFORM } from '../lib/constants'

const DataContext = createContext(null)
export const useData = () => useContext(DataContext)

export function DataProvider({ children }) {
  const [subscriptions, setSubscriptions] = useState([])
  const [unread, setUnread] = useState(0)
  const [trending, setTrending] = useState([])

  const loadSubscriptions = useCallback(async (uid) => {
    const { data, error } = await getSubscriptions(uid)
    if (!error) setSubscriptions(data ?? [])
    return { data, error }
  }, [])

  const loadUnread = useCallback(async (uid) => {
    const { data } = await getUnreadCount(uid)
    setUnread(data ?? 0)
  }, [])

  const loadTrending = useCallback(async () => {
    const { data, error } = await listTrendingCreators()
    if (!error) setTrending(data ?? [])
  }, [])

  const checkSubscribed = useCallback(async ({ subscriberId, creatorId }) => {
    const { data } = await isSubscribed({ subscriberId, creatorId })
    return data
  }, [])

  useEffect(() => {
    loadTrending()
  }, [loadTrending])

  const value = useMemo(
    () => ({
      subscriptions,
      unread,
      trending,
      loadSubscriptions,
      loadUnread,
      loadTrending,
      checkSubscribed,
      creatorCut: PLATFORM.creatorNetShare
    }),
    [subscriptions, unread, trending, loadSubscriptions, loadUnread, loadTrending, checkSubscribed]
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}