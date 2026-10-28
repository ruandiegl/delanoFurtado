import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useConsent } from '@/consent/context'
import { getAnalyticsClient } from './client'

export function AnalyticsBridge() {
  const { analytics } = useConsent()
  const { pathname } = useLocation()
  useEffect(() => { if (analytics === 'granted') getAnalyticsClient().grant(pathname) }, [analytics, pathname])
  return null
}
