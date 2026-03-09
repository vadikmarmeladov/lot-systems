import * as React from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'
import { useStore } from '@nanostores/react'
import { getMe, useWeather } from '#client/queries'
import * as stores from '#client/stores'
import { Layout } from '#client/components/ui'
import { System } from '#client/components/System'
import { Settings } from '#client/components/Settings'
import { Logs } from '#client/components/Logs'
import { Sync } from '#client/components/Sync'
import { DirectMessageThread } from '#client/components/DirectMessageThread'
import { StatusPage } from '#client/components/StatusPage'
import { ApiPage } from '#client/components/ApiPage'
import { ConnectionStatus } from '#client/components/ConnectionStatus'
import { render } from '#client/utils/render'
import { listenSSE } from '#client/utils/sse'
import { useSun } from '#client/utils/sun'
import { useMirror } from '#client/utils/mirror'
import { useSound } from '#client/utils/sound'
import { useRadio } from '#client/utils/radio'
import { sync } from '../sync'
import { initRecipeWidget } from '#client/stores/recipeWidget'

// Error boundary to prevent blank page when a widget crashes
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null; errorInfo: string | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[App] Render error caught by boundary:', error, info.componentStack)
    this.setState({ errorInfo: info.componentStack || null })
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'Unknown error'
      return (
        <Layout>
          <div style={{ padding: '24px' }}>
            <p>Something went wrong.</p>
            <p style={{ opacity: 0.3, marginTop: '8px', fontSize: '0.85em', wordBreak: 'break-word' }}>
              {errorMessage}
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                style={{ textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', font: 'inherit', padding: 0 }}
              >
                Retry
              </button>
              <button
                onClick={() => {
                  // Clear SW cache and reload
                  if ('caches' in window) {
                    caches.keys().then(names => {
                      names.forEach(name => caches.delete(name))
                    })
                  }
                  if (navigator.serviceWorker) {
                    navigator.serviceWorker.getRegistrations().then(regs => {
                      regs.forEach(r => r.unregister())
                    })
                  }
                  setTimeout(() => window.location.reload(), 300)
                }}
                style={{ textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit', font: 'inherit', padding: 0 }}
              >
                Clear cache &amp; reload
              </button>
            </div>
          </div>
        </Layout>
      )
    }
    return this.props.children
  }
}

sync.listen('users_total', (data) => {
  stores.usersTotal.set(data.value)
})
sync.listen('users_online', (data) => {
  stores.usersOnline.set(data.value)
})
sync.listen('live_message', (data) => {
  stores.liveMessage.set(data.message)
})

const queryClient = new QueryClient()

const App = () => {
  const mirrorRef = React.useRef<HTMLVideoElement>(null)
  const user = useStore(stores.me)
  const router = useStore(stores.router)
  const isMirrorOn = useStore(stores.isMirrorOn)
  const isSoundOn = useStore(stores.isSoundOn)
  const isRadioOn = useStore(stores.isRadioOn)

  const { data: weather, refetch: refetchWeather } = useWeather()

  const isLoaded = React.useMemo(() => {
    // Only require user data to load - weather is optional
    // Weather is only used in System and SelfCareMoments components
    return !!user
  }, [user])

  React.useEffect(() => {
    // Initialize router to listen to URL changes
    const unbindRouter = stores.router.listen(() => {})

    // Fetch version info
    fetch('/api/public/status')
      .then((res) => res.json())
      .then((data) => {
        stores.appVersion.set(data.version || '0.0.3')
        stores.lastUpdate.set(new Date())
      })
      .catch(() => {
        stores.appVersion.set('0.0.3')
      })

    getMe().then((user) => {
      stores.me.set(user)

      // Sync theme from user metadata (server) to local stores
      if (user.metadata?.theme) {
        const { theme: themeName, baseColor, accentColor, customThemeEnabled } = user.metadata.theme
        console.log('[App] Syncing theme from server:', themeName, customThemeEnabled)

        // Update theme stores
        if (customThemeEnabled && themeName === 'custom' && baseColor && accentColor) {
          stores.customTheme.set({ base: baseColor, acc: accentColor })
          stores.isCustomThemeEnabled.set(true)
          stores.theme.set('custom')
        } else if (themeName && themeName !== 'custom') {
          stores.isCustomThemeEnabled.set(false)
          stores.theme.set(themeName as any)
        }
      }

      // Sync timeChime setting from user (server) to local store
      if (user.timeChime !== undefined) {
        stores.isTimeChimeEnabled.set(user.timeChime)
        console.log('[App] Syncing timeChime from server:', user.timeChime)
      }

      if (!user.firstName && !user.lastName) {
        stores.goTo('settings')
      }
    }).catch((err) => {
      console.error('[App] Failed to fetch user:', err)
      // Redirect to login if auth fails
      window.location.href = '/login'
    })

    listenSSE(
      '/api/sync',
      (data: any) => {
        sync.emit(data.event, data.data)
        stores.lastUpdate.set(new Date())
      },
      {
        onOpen: () => {
          stores.isConnected.set(true)
        },
        onError: () => {
          stores.isConnected.set(false)
        },
      }
    )

    // Initialize recipe widget periodic checking
    initRecipeWidget()

    return () => {
      unbindRouter()
    }
  }, [])

  React.useEffect(() => {
    if (weather !== undefined) {
      stores.weather.set(weather)
    }
  }, [weather])

  useSun(weather || null, refetchWeather)

  useMirror(mirrorRef, isMirrorOn)

  useSound(isSoundOn)

  useRadio(isRadioOn)

  if (!isLoaded) {
    return <Layout>Loading...</Layout>
  }

  return (
    <>
      <ConnectionStatus />
      <Layout>
        {(!router || router.route === 'system') && <System />}
        {router?.route === 'settings' && <Settings />}
        {router?.route === 'api' && <ApiPage />}
        {router?.route === 'sync' && <Sync />}
        {router?.route === 'dm' && router.params?.userId && (
          <DirectMessageThread userId={router.params.userId} />
        )}
        {router?.route === 'status' && <StatusPage noWrapper />}
        {router?.route === 'logs' && <Logs />}
        {isMirrorOn && (
          <video
            ref={mirrorRef}
            playsInline
            autoPlay
            muted
            className="w-full h-full object-cover fixed inset-0 -z-10 -scale-x-100"
          />
        )}
      </Layout>
    </>
  )
}

render(
  <QueryClientProvider client={queryClient}>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </QueryClientProvider>
)
