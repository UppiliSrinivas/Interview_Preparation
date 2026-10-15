# Frequently Used HTTP Status Codes for Frontend & Full Stack Interviews

## 1xx - Informational (Rarely Asked)

### 100 Continue

**Purpose:** Server received request headers and client can continue sending the request body.

---

# 2xx - Success Responses

### 200 OK

**Purpose:** Request completed successfully.

```http
GET /users/1
200 OK
```

Most common for:

* GET APIs
* Successful PUT/PATCH
* Successful DELETE (sometimes)

---

### 201 Created

**Purpose:** Resource successfully created.

```http
POST /users
201 Created
```

Most common for:

* Create User
* Create Product
* Create Order

---

### 202 Accepted

**Purpose:** Request accepted for processing but not completed yet.

```http
202 Accepted
```

Example:

* Background jobs
* File processing
* Email queues

---

### 204 No Content

**Purpose:** Request successful but no response body returned.

```http
DELETE /users/1
204 No Content
```

Commonly used for:

* DELETE APIs

---

# 3xx - Redirection Responses

### 301 Moved Permanently

**Purpose:** Resource permanently moved to a new URL.

```http
301 Moved Permanently
```

Example:

* HTTP → HTTPS redirects

---

### 302 Found

**Purpose:** Temporary redirect.

```http
302 Found
```

Example:

* Login redirects
* Temporary routing changes

---

### 304 Not Modified

**Purpose:** Cached resource is still valid.

```http
304 Not Modified
```

Used for:

* Browser caching
* Performance optimization

---

# 4xx - Client Errors

### 400 Bad Request

**Purpose:** Invalid request from client.

```http
400 Bad Request
```

Examples:

* Missing required fields
* Invalid JSON
* Invalid query params

---

### 401 Unauthorized

**Purpose:** Authentication required or token invalid.

```http
401 Unauthorized
```

Examples:

* Missing JWT
* Expired Access Token

---

### 403 Forbidden

**Purpose:** User is authenticated but not authorized.

```http
403 Forbidden
```

Examples:

* User role restrictions
* Access denied

---

### 404 Not Found

**Purpose:** Requested resource does not exist.

```http
404 Not Found
```

Examples:

* Invalid User ID
* Invalid Product ID

---

### 405 Method Not Allowed

**Purpose:** HTTP method not supported.

```http
405 Method Not Allowed
```

Example:

```http
POST /users/1
```

When only GET is allowed.

---

### 409 Conflict

**Purpose:** Resource conflict exists.

```http
409 Conflict
```

Examples:

* Email already exists
* Username already exists

---

### 422 Unprocessable Entity

**Purpose:** Validation failed.

```http
422 Unprocessable Entity
```

Examples:

* Invalid email format
* Password too short

---

### 429 Too Many Requests

**Purpose:** Rate limit exceeded.

```http
429 Too Many Requests
```

Examples:

* OTP spam
* API throttling

---

# 5xx - Server Errors

### 500 Internal Server Error

**Purpose:** Unexpected server-side error.

```http
500 Internal Server Error
```

Examples:

* Database crash
* Unhandled exceptions

---

### 502 Bad Gateway

**Purpose:** Invalid response from upstream server.

```http
502 Bad Gateway
```

Examples:

* API Gateway issues
* Reverse proxy failures

---

### 503 Service Unavailable

**Purpose:** Server temporarily unavailable.

```http
503 Service Unavailable
```

Examples:

* Maintenance mode
* High traffic load

---

### 504 Gateway Timeout

**Purpose:** Upstream server took too long to respond.

```http
504 Gateway Timeout
```

Examples:

* Slow microservice
* Database timeout

---

# Most Important Codes for Interviews

```text
200 - Success
201 - Created
204 - No Content

400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
409 - Conflict
422 - Validation Error
429 - Too Many Requests

500 - Internal Server Error
503 - Service Unavailable
```

---

# Common Interview Question

Q: Difference between 401 and 403?

401 Unauthorized
→ Authentication failed.

Example:

```http
Missing JWT Token
```

403 Forbidden
→ Authentication successful but access denied.

Example:

```http
User role cannot access Admin APIs
```

---

# Common Interview Question

Q: Difference between 400 and 422?

400 Bad Request
→ Request structure itself is invalid.

Example:

```json
{
  "email":
}
```

422 Unprocessable Entity
→ Request structure is valid but business validation failed.

Example:

```json
{
  "email": "invalid-email"
}
```

---

# Easy Memory Trick

```text
2xx → Success
3xx → Redirect
4xx → Client Mistake
5xx → Server Mistake
```
