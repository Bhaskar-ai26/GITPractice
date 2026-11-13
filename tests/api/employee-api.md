# Employee REST API

Demo API for employee (member) CRUD, authentication token issuance, and file upload.
Source: `http://localhost:5002/api-docs/` (OpenAPI 3.0.3 spec at `http://localhost:5002/api-docs.json`).

Base URL: `http://localhost:5002`

Automated tests: [employee-api.spec.ts](./employee-api.spec.ts)

GitHub Actions excludes this suite because the API server is not in this repository. To run it locally, start the API server on port 5002 and run `npx playwright test tests/api/employee-api.spec.ts`.

---

## Authentication

| Scheme (per spec) | Header | Result observed |
|---|---|---|
| Basic | `Authorization: Basic base64(username:password)` | **Works** on all member and upload endpoints (`admin:admin`) |
| Bearer JWT from `POST /api/auth/login` | `Authorization: Bearer <token>` | **Rejected** with `401 {"error":"unauthorized"}` on member endpoints |
| Bearer token from `POST /oauth/token` | `Authorization: Bearer <token>` | **Rejected** with `401 {"error":"unauthorized"}` on member endpoints |
| API key | `x-api-key: <key>` | Rejected with a placeholder value (`x`); no valid key is documented |

Missing credentials on protected endpoints return `401 {"error":"unauthorized"}`.

> **Note:** The spec lists Basic, API key, Bearer, and OAuth2 as accepted schemes, but in this environment only Basic auth was accepted for the member and upload endpoints.

---

## Endpoints

### 1. POST /api/auth/login: Issue JWT

Issues a token for a username and password.

**Request body (JSON)**

| Field | Type | Required |
|---|---|---|
| `username` | string | yes |
| `password` | string | yes |

**Responses**

| Status | Body | Notes |
|---|---|---|
| 200 | `{ "token_type": "Bearer", "access_token": "<jwt>", "expires_in": "1h" }` | Valid credentials (`admin` / `admin`) |
| 401 | `{ "error": "invalid_credentials", "message": "Invalid username or password" }` | Wrong password, or missing fields |

---

### 2. POST /oauth/token: Issue OAuth2 client credentials token

**Request body (JSON)**

| Field | Type | Required | Example |
|---|---|---|---|
| `grant_type` | string | yes | `client_credentials` |
| `client_id` | string | yes | `demo-client` |
| `client_secret` | string | yes | `demo-secret` |

**Responses**

| Status | Body | Notes |
|---|---|---|
| 200 | `{ "token_type": "Bearer", "access_token": "<token>", "expires_in": 3600 }` | Valid client |
| 400 | `{ "error": "unsupported_grant_type" }` | `grant_type` other than `client_credentials` |
| 401 | `{ "error": "invalid_client" }` | Wrong `client_secret` |

---

### 3. GET /api/members: List all members

Requires authentication.

**Query parameters**

| Name | Type | Required | Values |
|---|---|---|---|
| `gender` | string | no | `male`, `female` (matched case-insensitively) |

**Responses**

| Status | Body | Notes |
|---|---|---|
| 200 | `[ { "id": 1, "name": "John Smith", "gender": "Male" }, ... ]` | Array of members. Without a filter, all members are returned. |
| 404 | `{ "msg": "Member with gender other doesn't exist" }` | No member matches the `gender` filter |
| 401 | `{ "error": "unauthorized" }` | Missing or invalid credentials |

---

### 4. POST /api/members: Create member

Requires authentication.

**Request body (JSON)**

| Field | Type | Required | Rules |
|---|---|---|---|
| `name` | string | yes | 4 to 25 characters |
| `gender` | string | yes | `male` or `female` |

**Responses**

| Status | Body | Notes |
|---|---|---|
| 201 | `{ "id": 39, "name": "...", "gender": "..." }` | Member created. `id` is assigned by the server. |
| 400 | `{ "msg": "Name should be 4 to 25 characters long" }` | Name length out of range |
| 400 | `{ "msg": "Gender should be either male or female only" }` | Invalid gender |
| 400 | `{ "msg": "Please provide a name and gender" }` | Missing `name` or `gender` |
| 401 | `{ "error": "unauthorized" }` | Missing or invalid credentials |

---

### 5. GET /api/members/{id}: Get member by id

Requires authentication.

**Path parameters**

| Name | Type | Required |
|---|---|---|
| `id` | integer | yes |

**Responses**

| Status | Body | Notes |
|---|---|---|
| 200 | `[ { "id": 1, "name": "John Smith", "gender": "Male" } ]` | Matches the spec: a single-item array |
| 404 | `{ "msg": "Member with id 999 doesn't exist" }` | Unknown id, or a non-numeric id such as `abc` |
| 401 | `{ "error": "unauthorized" }` | Missing or invalid credentials |

---

### 6. PUT /api/members/{id}: Update member by id

Requires authentication. Partial update: send only the fields to change.

**Path parameters**

| Name | Type | Required |
|---|---|---|
| `id` | integer | yes |

**Request body (JSON), all fields optional**

| Field | Type | Rules |
|---|---|---|
| `name` | string | 4 to 25 characters |
| `gender` | string | `male` or `female` |

**Responses**

| Status | Body | Notes |
|---|---|---|
| 200 | `{ "msg": "Member with id 38 is updated successfully", "member": { "id": 38, "name": "...", "gender": "..." } }` | Updated record |
| 200 | Same shape | Empty body `{}` returns 200 and leaves the record unchanged |
| 400 | `{ "msg": "Name should be 4 to 25 characters long" }` | Invalid name length |
| 400 | `{ "msg": "Gender should be either male or female only" }` | Invalid gender |
| 404 | `{ "msg": "Member with id 999 doesn't exist" }` | Unknown id |
| 401 | `{ "error": "unauthorized" }` | Missing or invalid credentials |

---

### 7. DELETE /api/members/{id}: Delete member by id

Requires authentication.

**Path parameters**

| Name | Type | Required |
|---|---|---|
| `id` | integer | yes |

**Responses**

| Status | Body | Notes |
|---|---|---|
| 200 | `{ "msg": "Member with id 39 is deleted successfully", "members": [ ...remaining members... ] }` | The deleted id is no longer in `members`, and `GET /api/members/{id}` then returns 404 |
| 404 | `{ "msg": "Member with id 999 doesn't exist" }` | Unknown id |
| 401 | `{ "error": "unauthorized" }` | Missing or invalid credentials |

---

### 8. POST /api/upload: Upload image file

Requires authentication. Content type `multipart/form-data`.

**Form fields**

| Name | Type | Required | Notes |
|---|---|---|---|
| `file` | binary | yes | Image file. `.png` is accepted; `.txt` is rejected. |

**Responses**

| Status | Body | Notes |
|---|---|---|
| 201 | `{ "success": true, "message": "File uploaded successfully!", "url": "http://localhost:5002/fileuploads/<name>.png" }` | Valid image |
| 400 | `{ "success": false, "message": "Unsupported extension!" }` | Disallowed extension |
| 500 | `{ "success": false, "message": {} }` | Request with no `file` part. The spec documents 400 here, so this is a discrepancy. |
| 401 | `{ "error": "unauthorized" }` | Missing or invalid credentials |

---

## Spec vs. observed behavior

| # | Area | Spec | Observed |
|---|---|---|---|
| 1 | Bearer / OAuth2 tokens on member endpoints | Accepted | Rejected with 401. Only Basic auth works. |
| 2 | Upload with no file | 400 | 500 |
| 3 | `GET /api/members/{id}` | Array of members | Matches (single-item array) |

## Running the tests

```powershell
npx playwright test tests/api/employee-api.spec.js --project=chromium --reporter=list
```

The server at `http://localhost:5002` must be running. The tests run serially because they share one server-side member store, and parallel create/delete calls produced inconsistent 404 results during exploration. The suite creates and deletes its own member records. Uploads leave files in the server's `fileuploads` folder.
