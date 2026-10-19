import type { SupabaseClient } from '@supabase/supabase-js';

export type AuthUser = { id: string; email: string | undefined };

/**
 * 인증 사용자를 반환한다. 세션이 없으면 null.
 * null 처리(redirect·에러 반환·throw)는 각 호출부가 기존대로 수행한다.
 *
 * 내부 구현은 getUser()(Auth 서버 왕복). 0627 커밋 B에서 getClaims()(로컬 검증)로 교체 예정 —
 * 반환 계약({id, email} | null)은 그대로 유지한다.
 */
export async function getAuthUser(supabase: SupabaseClient): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return { id: user.id, email: user.email };
}
