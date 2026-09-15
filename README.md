# Dotrip

한국 영화·드라마 촬영지 탐방·기록·여행계획 플랫폼

촬영지를 다녀온 사람이 기록을 남기고, 같은 작품의 팬이 그 기록을 참고해
여행을 계획한다.

**배포**: https://dotrip.io

## 주요 기능

- **촬영지 탐색** (`/spot-finder`) — 네이버 지도에서 촬영지를 마커·클러스터로 탐색
- **방문 기록** (`/story`) — Tiptap 에디터로 방문 스토리 작성, 태그 검색, 좋아요
- **여행 플랜 작성** (`/my-plan`) — 일정·스팟·비용·항공편을 묶은 계획 작성, 드래그 정렬
- **공개 플랜 담기** (`/plan-finder`) — 다른 사람의 공개 플랜을 토스페이먼츠 결제로 내 플랜에 복사.
  금액은 서버가 정해 주문에 먼저 저장하고, 승인 시 돌아온 금액과 대조한다
- **계정 관리** (`/mypage`) — 프로필·비밀번호 변경. 탈퇴 시 개인정보(이메일·닉네임·프로필 사진)만
  익명화하고 콘텐츠·결제 기록은 보존

## 기술 스택

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, next-themes (다크 모드)
- **DB / Auth**: Prisma 7 + Supabase (PostgreSQL · Auth · Storage)
- **에디터**: Tiptap 3
- **폼 / 검증**: React Hook Form + Zod
- **지도**: 네이버 지도 SDK, 카카오 REST API (장소 검색 · 좌표→주소 · 교통)
- **결제**: 토스페이먼츠 SDK
- **테스트**: Jest, React Testing Library
- **CI / 배포**: GitHub Actions, Vercel
- **분석**: Google Analytics 4, Vercel Analytics

## 개발 방식

- **CI**: push·PR마다 lint → 타입 검사 → 테스트 → 빌드 네 단계를 실행한다
  (`.github/workflows/ci.yml`). 결과는 디스코드로 알림.
- **테스트**: 21개 스위트, 213개 케이스 (2026-09 기준 전부 통과)
- **AI 활용**: 코드는 Claude Code로 작성하되, 라이브러리 공식 문서·배포 설정과
  대조해 확인한 뒤 반영한다.
- **작업 기록**: 작업 단위마다 `docs/prompts/`에 회고를 남긴다 — 문제의 원인,
  결정의 근거, 되돌린 결정의 이유까지 기록.

## 로컬 실행

Node 22 (`.nvmrc`)

```bash
npm install
cp .env.example .env.local   # 아래 환경변수 채우기
npm run dev
```

`http://localhost:3000`에서 확인.

### 환경변수

기본 (없으면 실행 불가):

```bash
NEXT_PUBLIC_SUPABASE_URL=        # Supabase 대시보드 > Project Settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # 서버 전용 — 회원 탈퇴 등 admin API
DATABASE_URL=                    # Transaction 모드 (pgbouncer, port 6543)
DIRECT_URL=                      # Session 모드 (port 5432) — prisma migrate 전용
```

기능별 (해당 기능만 영향):

```bash
NEXT_PUBLIC_NAVER_MAP_CLIENT_ID= # 지도 표시
KAKAO_REST_API_KEY=              # 장소 검색 · 좌표→주소 · 교통 계산
NEXT_PUBLIC_TOSS_CLIENT_KEY=     # 결제 (클라이언트)
TOSS_SECRET_KEY=                 # 결제 승인 (서버 전용)
RAPID_API_KEY=                   # 항공권 검색
NEXT_PUBLIC_GA_ID=               # Google Analytics (선택)
```
