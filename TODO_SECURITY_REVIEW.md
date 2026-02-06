# Personal Blog Review TODO

## P0 - Immediate

- [ ] Rotate all leaked secrets immediately (DB password, R2 keys) and remove secrets from git history with `git filter-repo` or BFG. (Codebase is sanitized now; key rotation/history cleanup still required)
- [x] Remove default weak admin credentials from migration; switch to first-run admin bootstrap with strong password requirements.
- [x] Move JWT secret to environment/config and use a single shared source for both token generation and verification.

## P1 - Security

- [x] Restrict `GET /posts/:id` to published posts only for public API; use protected admin API for draft access.
- [x] Add upload validation: MIME allowlist, max file size, extension/content checks, and reject unsafe files.
- [x] Fix upload service initialization failure path; avoid registering upload handler when service is unavailable (or return `503`).
- [x] Change auth cookie to `HttpOnly + Secure + SameSite` and add CSRF protection strategy.
- [x] Replace permissive CORS (`*` + credentials) with explicit allowed origins and strict headers/methods.

## P2 - Performance and Maintainability

- [ ] Optimize list queries to `SELECT` only required fields (exclude heavy JSON fields like `content/meta` from list endpoints).
- [ ] Add real pagination support (`page`, `pageSize`) with validation and limits.
- [ ] Remove hardcoded backend URLs (`127.0.0.1`/`localhost`) and use unified environment-based API config.
- [ ] Refactor `frontend/src/app/admin/edit/[id]/page.tsx` by removing temporary comments/hacks and extracting reusable logic.
