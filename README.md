# Tak Business Admin

## Overview

Tak Business Admin is the internal web console for operating the Tak Business platform. It consolidates core workflows for user management, business operations, billing, transactions, support, and system health.

## Documentation

- [ADMIN_PORTAL](docs/ADMIN_PORTAL.md) - full developer guide (routes, permissions, data models, backend integration map).

## Local development

```bash
npm install
npm run dev
```

## Test accounts (development only)

These accounts are defined in `src/data/mockData.js` under `TEST_ADMINS`.

- superadmin / super123 (Super Admin)
- finance / finance123 (Finance Admin)
- support / support123 (Support Admin)

## Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run lint checks

## Deployment

Build artifacts are generated into `dist/`.

## Support

For questions about workflows or backend integration, start with `docs/ADMIN_PORTAL.md`.
