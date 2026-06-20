# 보안 응답 헤더 설정 가이드

`<meta>` CSP는 `frame-ancestors`(클릭재킹)·HSTS·`X-Content-Type-Options` 같은
**HTTP 헤더 전용 항목**을 적용할 수 없습니다. GitHub Pages 역시 커스텀 응답 헤더를
지원하지 않으므로, 아래 방법 중 하나로 보강합니다.

---

## 방법 A — Cloudflare를 GitHub Pages 앞에 두기 (권장, 무료)

`www.cusoft.co.kr` DNS를 Cloudflare로 옮기고(orange-cloud 프록시 ON), 대시보드에서 헤더를 주입합니다.

1. Cloudflare에 도메인 등록 → 네임서버 변경 → `www` 레코드 프록시 ON
2. **Rules → Transform Rules → Modify Response Header → Create rule**
3. 다음 헤더를 **Set static** 으로 추가:

| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `SAMEORIGIN` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `geolocation=(), microphone=(), camera=(), interest-cohort=()` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Content-Security-Policy` | (아래 한 줄) |

```
default-src 'self'; base-uri 'self'; object-src 'none'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'sha256-eBAuw1S9lDS1qogwV3MHYwoAap5cMtltnVNonZH5wJc='; frame-src https://www.google.com https://maps.google.com; connect-src 'self' https://formspree.io; form-action 'self' https://formspree.io mailto:; frame-ancestors 'self'; upgrade-insecure-requests
```

> 헤더로 CSP를 주입하면 `index.html`의 `<meta>` CSP는 제거해도 됩니다(중복 시 더 엄격한 쪽 적용).
> 단, 인라인 스크립트 **해시(`sha256-...`)는 양쪽 동일**해야 합니다.

---

## 방법 B — Cloudflare Pages / Netlify로 호스팅

저장소 루트의 **`_headers`** 파일이 자동 적용됩니다(이미 포함됨). GitHub Pages 대신
Cloudflare Pages 또는 Netlify에 연결만 하면 됩니다. 추가 설정 불필요.

---

## ⚠️ 인라인 스크립트 수정 시 — CSP 해시 재계산

`index.html` `<head>`의 테마 초기화 `<script>` 본문을 바꾸면 해시가 달라집니다.
아래로 새 해시를 만들어 `meta`/`_headers`/Cloudflare 값의 `'sha256-...'` 를 모두 교체하세요.

```bash
# <script> 와 </script> 사이 본문(앞뒤 공백 포함)을 그대로 해시
python3 - <<'PY'
import re, hashlib, base64
html = open("index.html", encoding="utf-8").read()
s = html.index('<script>') + len('<script>')
e = html.index('</script>', s)
print("sha256-" + base64.b64encode(hashlib.sha256(html[s:e].encode()).digest()).decode())
PY
```

---

## 검증

배포 후 헤더가 실제 적용됐는지 확인:

```bash
curl -sI https://www.cusoft.co.kr | grep -iE "content-security|strict-transport|x-frame|x-content-type|referrer-policy|permissions-policy"
```

온라인 점검: [securityheaders.com](https://securityheaders.com) · [Mozilla Observatory](https://observatory.mozilla.org)
