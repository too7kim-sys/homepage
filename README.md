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

## 🌐 배포 (GitHub Pages)

1. 저장소 **Settings → Pages** 이동
2. **Build and deployment → Source** 를 `Deploy from a branch` 로 설정
3. 브랜치를 선택하고 `/ (root)` 폴더 지정 후 저장
4. 잠시 후 제공되는 URL로 접속

## 🛠 콘텐츠 수정 가이드

- **회사 정보/연락처**: `index.html` 의 Contact·Footer 섹션 텍스트 수정
- **서비스/포트폴리오 항목**: 해당 섹션의 `<article>` 카드 복제·편집
- **브랜드 컬러**: `css/style.css` 상단 `:root` 의 `--c-primary` 등 변수 변경
- **통계 수치**: `index.html` Hero `data-count` / `data-suffix` 속성 변경
- **폼 수신 메일**: `js/main.js` 의 `mailto:contact@cusoft.co.kr` 변경
  (실제 전송이 필요하면 Formspree 등 폼 백엔드 연동 권장)

---

© CU Soft Inc. 본 코드는 씨유소프트 홈페이지 제작용입니다.
