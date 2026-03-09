import { Outlet, createRootRoute, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ScrollToTop } from '#/components/ScrollToTop'
import { getIsLoggedIn, login } from '#/lib/auth'
import { refreshAccessToken } from '#/lib/api'

import '../styles.css'

export const Route = createRootRoute({
  /**
   * beforeLoad — 모든 라우트 진입 전에 실행되는 인증 가드
   *
   * 새로고침 시 메모리(_token)가 초기화되므로 getIsLoggedIn()이 false가 됩니다.
   * 이 경우 즉시 로그인 페이지로 보내지 않고, 먼저 Refresh Token 쿠키로
   * Access Token 복구를 시도합니다.
   *
   * 흐름:
   *  1. getIsLoggedIn() === true → 통과 (이미 메모리에 토큰 있음)
   *  2. getIsLoggedIn() === false + /auth/refresh 성공 → 메모리 복구 후 통과
   *  3. getIsLoggedIn() === false + /auth/refresh 실패 → /login 으로 redirect
   */
  beforeLoad: async ({ location }) => {
    if (location.pathname === '/login') return

    if (!getIsLoggedIn()) {
      // 새로고침으로 메모리가 초기화된 경우 → Refresh Token 쿠키로 복구 시도
      const result = await refreshAccessToken()

      if (!result) {
        // Refresh Token도 없거나 만료 → 로그인 필요
        throw redirect({ to: '/login' })
      }

      // 서버가 role을 함께 반환하므로 JWT 디코딩 없이 바로 복구
      login(result.role, result.accessToken)
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
