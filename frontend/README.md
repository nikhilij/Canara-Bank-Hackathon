# TrustVault Frontend

## Overview
This is the React + Tailwind CSS frontend for TrustVault, providing user consent management, audit logs, tokenization, and compliance dashboards.

## Features
- Modern UI with Tailwind CSS
- JWT authentication and role-based access
- Consent management (grant, revoke, view)
- Tokenization and detokenization of sensitive data
- Audit log viewer
- Compliance dashboard
- Real-time integration with backend APIs

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Tailwind CSS Integration
- Tailwind is pre-configured in `tailwind.config.js`, `postcss.config.js`, and `src/index.css`.
- Use Tailwind utility classes in all components for rapid UI development.

### 3. Environment Variables
Create a `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### 4. Run the App
```bash
npm start
```

## API Integration
- All API calls use JWT and are routed to the backend (`/api/v1`).
- See `src/services/` for integration with auth, consent, tokenization, audit, and compliance endpoints.
- Example: `tokenizationService.tokenize(data, dataType, purpose, retention)`

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── contexts/
│   ├── hooks/
│   └── utils/
├── public/
├── tailwind.config.js
├── postcss.config.js
├── index.css
```

## Customization
- Update theme colors in `tailwind.config.js`.
- Add new pages/components in `src/pages` and `src/components`.

## Testing
```bash
npm test
```

## Deployment
- Build with `npm run build` and deploy to Vercel, Netlify, or your cloud provider.

## Documentation
- See `/docs` and backend README for full API and architecture details.
