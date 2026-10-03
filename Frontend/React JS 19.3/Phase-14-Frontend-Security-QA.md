# Phase 14 - Frontend Security — Questions & Answers

# Authentication & Authorization

### Q283. Authentication
Verifying **who** the user is (login with password, OTP, SSO).

### Q284. Authorization
Deciding **what** an authenticated user is allowed to do (roles, permissions).

### Q285. Authentication vs Authorization
| Authentication | Authorization |
|---|---|
| "Who are you?" | "What can you access?" |
| Happens first | Happens after |
| Login, MFA | Roles, ACLs, policies |

### Q286. JWT
JSON Web Token: a signed token with three parts `header.payload.signature`. The server verifies the signature without a session lookup. The payload is **encoded, not encrypted** — don't put secrets in it.

### Q287. Access Token
Short-lived token (e.g., 5–15 min) sent with API requests (`Authorization: Bearer <token>`) to prove identity/permissions.

### Q288. Refresh Token
Longer-lived token used only to get a new access token when the old one expires. Store it more securely (HttpOnly cookie) and rotate it.

### Q289. JWT Authentication Flow
1. User logs in → server returns access + refresh token.
2. Client sends the access token on each request.
3. Access token expires → API returns 401.
4. Client calls refresh endpoint with refresh token → gets a new access token.
5. If refresh fails → log the user out.

---

# Security Vulnerabilities

### Q290. What is XSS?
**Cross-Site Scripting**: attacker injects malicious JavaScript that runs in other users' browsers, stealing tokens/data or acting as the user.

### Q291. Types of XSS
- **Stored**: payload saved in the DB (comments) and served to everyone.
- **Reflected**: payload in a URL/request reflected in the response.
- **DOM-based**: client-side JS writes untrusted data into the DOM (`innerHTML`).

### Q292. XSS Prevention in React
- React **escapes** values in JSX by default.
- Avoid `dangerouslySetInnerHTML`; if needed, sanitize with DOMPurify.
- Validate `href`/`src` (block `javascript:` URLs).
- Use a strict CSP and Trusted Types.
- Don't build HTML strings or use `eval`.

### Q293. What is CSRF?
**Cross-Site Request Forgery**: a malicious site makes the victim's browser send an authenticated request (cookies are sent automatically) to your site to perform an action.

### Q294. CSRF Prevention
- `SameSite` cookies (`Lax`/`Strict`)
- CSRF tokens (synchronizer/double-submit)
- Check `Origin`/`Referer` headers
- Require custom headers / use bearer tokens in headers
- Re-authenticate for sensitive actions

---

# Secure Storage

### Q295. Token Storage Strategies
| Option | Pros | Cons |
|---|---|---|
| Memory (JS variable) | Not persisted, safe from storage theft | Lost on refresh |
| HttpOnly cookie | JS can't read it → XSS can't steal it | Needs CSRF protection |
| localStorage/sessionStorage | Simple | Readable by any script → XSS steals tokens |

Common best practice: access token in memory, refresh token in an HttpOnly Secure SameSite cookie.

### Q296. localStorage vs Cookies
localStorage: JS-accessible, never auto-sent, ~5MB. Cookies: sent automatically with requests, can be HttpOnly/Secure/SameSite, ~4KB. Cookies are safer for auth tokens when configured correctly.

### Q297. Secure Cookie
`Secure` attribute: cookie is sent only over HTTPS.

### Q298. HttpOnly Cookie
`HttpOnly`: JavaScript (`document.cookie`) cannot read it, reducing token theft via XSS.

### Q299. SameSite Cookie
Controls cross-site sending: `Strict` (never cross-site), `Lax` (top-level navigations only; default in modern browsers), `None` (always, requires `Secure`). Main defense against CSRF.
```
Set-Cookie: refresh=abc; HttpOnly; Secure; SameSite=Strict; Path=/
```

---

# Advanced Security

### Q300. Content Security Policy (CSP)
An HTTP header that tells the browser which sources of scripts/styles/images are allowed, blocking injected scripts.
```
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com
```

### Q301. SSL Pinning
Mostly for **mobile apps** (React Native): the app trusts only a specific certificate/public key, preventing man-in-the-middle attacks even with a rogue CA. Not typically used in web frontends.

### Q302. dangerouslySetInnerHTML
React prop that injects raw HTML, bypassing escaping — a direct XSS risk if the HTML is untrusted.
```jsx
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
```

### Q303. Why React Escapes HTML by Default
JSX text values are converted to strings and escaped (`<` → `&lt;`), so injected markup renders as text, not executable HTML. This makes XSS much harder unless you opt out.
