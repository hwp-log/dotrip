import type { SupabaseClient } from '@supabase/supabase-js';

export type AuthUser = { id: string; email: string | undefined };

/**
 * 인증 사용자를 반환한다. 세션이 없으면 null.
 * null 처리(redirect·에러 반환·throw)는 각 호출부가 기존대로 수행한다.
 *
 * 내부는 getClaims()로 JWT를 로컬 검증한다(0627). 서명 키가 ES256(비대칭)이라 Auth 서버 왕복 없이
 * JWKS로 서명만 확인한다. 세션 철회·사용자 삭제는 토큰 만료(≤1h) 전까지 반영되지 않으므로,
 * 즉시 서버 검증이 필요한 경로(결제 승인·회원 탈퇴·requireAdmin)는 getUser()를 그대로 쓴다.
 */
export async function getAuthUser(supabase: SupabaseClient): Promise<AuthUser | null> {
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) return null;
  return { id: data.claims.sub, email: data.claims.email };
}
