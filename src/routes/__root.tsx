import { Outlet, createRootRoute, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ScrollToTop } from '#/components/ScrollToTop'
import { getIsLoggedIn } from '#/lib/auth'

import '../styles.css'

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    if (!getIsLoggedIn() && location.pathname !== '/login') {
      throw redirect({ to: '/login' })
    }
  },
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <Outlet />
      <ScrollToTop />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}
