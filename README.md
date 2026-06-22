# 씨유소프트 (CU Soft) 홈페이지

소프트웨어 전문 기업 **씨유소프트**의 공식 기업 홈페이지입니다.
별도의 빌드 도구 없이 동작하는 순수 **HTML · CSS · JavaScript** 정적 사이트입니다.

## ✨ 특징

- **원페이지 스크롤 구조** — 회사소개 / 서비스 / 진행과정 / 포트폴리오 / 강점 / 문의
- **반응형 디자인** — 모바일 우선, 태블릿·데스크톱까지 대응
- **기업/전문가형 디자인** — 블루 계열 브랜드 컬러, CSS 변수로 토큰화
- **가벼운 인터랙션** — 모바일 메뉴, 스크롤 등장 애니메이션, 통계 카운터, 포트폴리오 필터
- **문의 폼 검증** — 클라이언트 측 필수값/이메일 검증 + `mailto:` 폴백
- **접근성 고려** — 시맨틱 마크업, 건너뛰기 링크, `aria` 속성, 모션 최소화 지원
- **외부 의존성 최소화** — 폰트(Noto Sans KR)만 CDN 사용

## 📁 디렉터리 구조

```
.
├── index.html          # 전체 페이지 마크업
├── css/
│   └── style.css       # 디자인 토큰 + 반응형 스타일
├── js/
│   └── main.js         # 메뉴/스크롤/필터/폼 검증 로직
├── assets/
│   ├── logo.svg        # 로고
│   └── favicon.svg     # 파비콘
└── README.md
```

## 🚀 로컬 실행

정적 파일이므로 `index.html`을 브라우저로 바로 열어도 되지만,
폰트/경로를 정확히 확인하려면 로컬 서버 사용을 권장합니다.

```bash
# Python 3
python3 -m http.server 8000
# 그 후 브라우저에서 http://localhost:8000 접속
```

```bash
# Node (http-server 설치 시)
npx http-server -p 8000
```

### Eclipse + Tomcat 으로 실행

이 저장소에는 **Dynamic Web Project 메타데이터**(`.project`, `.settings/`, `WEB-INF/web.xml`)가
포함되어 있어 이클립스에서 바로 Tomcat에 올릴 수 있습니다. 정적 파일은 **프로젝트 루트**가
웹 콘텐츠 루트로 매핑됩니다(Deploy Assembly `/` → `/`).

1. **File → Import → Git / 또는 Existing Projects into Workspace** 로 이 폴더 가져오기
2. **Window → Show View → Servers** → 우클릭 **New → Server → Apache → Tomcat v9.0** →
   Tomcat 설치 경로 지정 (사전 준비: JDK + Tomcat 다운로드)
3. 프로젝트 우클릭 → **Properties → Targeted Runtimes** 에서 추가한 Tomcat 체크
4. 프로젝트 우클릭 → **Run As → Run on Server** → Tomcat 선택 → Finish
5. 브라우저: `http://localhost:8080/cusoft-homepage/`
   - 컨텍스트 경로 변경: **Properties → Web Project Settings → Context root**

> **Tomcat 10(Jakarta EE) 사용 시**: `WEB-INF/web.xml` 의 네임스페이스를
> `https://jakarta.ee/xml/ns/jakartaee` · `version="5.0"` 으로,
> `.settings/org.eclipse.wst.common.project.facet.core.xml` 의 `jst.web` 를 `5.0` 으로 변경하세요.
> (정적 사이트라 서블릿 클래스는 없어 동작엔 문제 없습니다.)

> 참고: 이 사이트는 서버측 코드가 없어 Tomcat이 필수는 아니며, 위 정적 서버(Python/Node)로도 동일하게 동작합니다.

## 🌐 배포 (GitHub Pages)

1. 저장소 **Settings → Pages** 이동
2. **Build and deployment → Source** 를 `Deploy from a branch` 로 설정
3. 브랜치를 선택하고 `/ (root)` 폴더 지정 후 저장
4. 잠시 후 제공되는 URL로 접속

## ✉️ 문의 폼 실제 전송 설정 (Formspree)

문의 폼은 기본적으로 **메일 앱 열기(mailto)** 로 동작합니다.
아래 설정을 마치면 방문자가 작성한 문의가 **지정 메일로 자동 전송**됩니다(백엔드 불필요).

1. [formspree.io](https://formspree.io) 가입 → **New Form** 생성 → 수신 메일 등록
2. 발급된 엔드포인트(`https://formspree.io/f/abcd1234`) 복사
3. `index.html` 의 문의 폼 `action`/`enctype` 을 교체:
   ```html
   <!-- 기본값(미설정): mailto 폴백 -->
   <form ... action="mailto:contact@cusoft.co.kr" method="post" enctype="text/plain">
   <!-- 교체 후: Formspree 비동기 전송 -->
   <form ... action="https://formspree.io/f/abcd1234" method="POST">
   ```
   `formspree.io/f/...` 로 바뀌면 JS가 자동으로 비동기 전송 모드로 동작합니다.
4. (선택) 첫 전송 시 Formspree 확인 메일의 링크를 클릭해 폼을 활성화

> 미설정 기본값(`action="mailto:..."`)에서는 JS가 있으면 메일 앱으로,
> JS가 없어도 브라우저 기본 mailto 전송으로 **안전하게 폴백**합니다.

## 🌐 배포 (GitHub Pages)

1. 저장소 **Settings → Pages** 이동
2. **Build and deployment → Source** 를 `Deploy from a branch` 로 설정
3. 브랜치를 선택하고 `/ (root)` 폴더 지정 후 저장
4. 잠시 후 제공되는 URL로 접속 (`.nojekyll` 포함되어 정적 파일 그대로 서빙)

### 커스텀 도메인 (`www.cusoft.co.kr`)

루트에 **`CNAME`** 파일이 이미 포함되어 있습니다. **DNS를 먼저 설정한 뒤** Pages를 켜세요.

> ⚠️ **순서 주의**: CNAME 파일이 있으면 `*.github.io` 접속이 커스텀 도메인으로 리다이렉트됩니다.
> DNS가 먼저 잡혀 있지 않으면 사이트 접근이 끊기므로 **DNS → Pages 활성화** 순서를 지키세요.

도메인 등록기관(가비아 등)에서 DNS 레코드 추가:

| 유형 | 이름 | 값 |
|---|---|---|
| `CNAME` | `www` | `<GitHub사용자명>.github.io` |
| `A` | `@` (apex) | `185.199.108.153` / `.109.153` / `.110.153` / `.111.153` |

- Settings → Pages → **Custom domain** 에 `www.cusoft.co.kr` 입력 → **Enforce HTTPS** 체크
- 보안 헤더(HSTS·클릭재킹 등) 보강은 [`docs/security-headers.md`](docs/security-headers.md) 참고

## 🔐 보안 (웹 취약점 대응)

이 사이트는 정적 페이지로 서버측 공격면이 없으며, 클라이언트측도 다음과 같이 방어합니다.

- **XSS**: 사용자 입력을 DOM에 삽입하지 않음. 오류 메시지는 `textContent`만 사용, `innerHTML`/`eval`/`document.write`/인라인 핸들러 전무. mailto 생성 시 `encodeURIComponent`로 **헤더 인젝션 차단**.
- **CSP (Content-Security-Policy)**: `<head>` 메타로 적용. 외부 스크립트 차단(`script-src 'self'` + 인라인 테마 스크립트는 **SHA-256 해시**로만 허용), 허용 출처를 폰트·지도·Formspree로 한정. `object-src 'none'`, `base-uri 'self'`, `form-action` 화이트리스트.
  - ⚠️ 인라인 테마 스크립트를 수정하면 **해시를 재계산**해야 합니다:
    ```bash
    # <script>...</script> 본문으로 해시 생성 후 CSP의 'sha256-...' 교체
    ```
- **역탭내빙(reverse tabnabbing)**: 외부 링크 모두 `rel="noopener noreferrer"`.
- **참조자 노출**: `referrer = strict-origin-when-cross-origin`.

### ⚠️ HTTP 헤더 레벨 한계 (GitHub Pages)

`<meta>` CSP로는 **`frame-ancestors`(클릭재킹)·HSTS·X-Content-Type-Options** 를 설정할 수 없고, GitHub Pages는 커스텀 응답 헤더를 지원하지 않습니다. 강화하려면 커스텀 도메인 앞에 **Cloudflare**(또는 Netlify/Cloudflare Pages)를 두고 다음 헤더를 추가하세요:

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: ... (frame-ancestors 'self' 포함)
```

> 브로슈어형 사이트라 인증·민감 동작이 없어 클릭재킹 실질 위험은 낮지만, 위 프록시 헤더로 완전 차단을 권장합니다.

## 🛠 콘텐츠 수정 가이드

- **회사 정보/연락처**: `index.html` 의 Contact·Footer 섹션 및 `<head>` JSON-LD 수정
- **서비스/포트폴리오 항목**: 해당 섹션의 `<article>` 카드 복제·편집
- **브랜드 컬러**: `css/style.css` 상단 `:root` 의 `--c-blue` / `--c-green` 등 변수 변경
- **공유 이미지**: `assets/og-image.png` (1200×630) 교체
- **지도**: Contact 섹션 `iframe` 의 주소 쿼리 및 카카오맵 링크 수정

---

© CU Soft Inc. 본 코드는 씨유소프트 홈페이지 제작용입니다.
