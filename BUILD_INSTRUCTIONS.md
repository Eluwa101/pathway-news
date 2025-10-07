# Build Instructions - LDS Student Community App

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

### 3. Environment Setup

Create a `.env` file in the root directory (if not already present):

```bash
touch .env
```

Add your Supabase credentials to the `.env` file:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note**: Get these values from your Supabase project dashboard at [supabase.com](https://supabase.com)

### 4. Run Development Server

```bash
npm run dev
```

The app will start on `http://localhost:8080`

### 5. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### 6. Preview Production Build

```bash
npm run preview
```

## Database Setup

### Option 1: Using Lovable Cloud (Recommended)
- The database is automatically configured if you're using Lovable Cloud
- Tables and policies are already set up via migrations

### Option 2: Manual Supabase Setup
If setting up your own Supabase project:

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the migrations in the `supabase/migrations` folder
3. Update your `.env` file with your project credentials

## Troubleshooting

### Port Already in Use
If port 8080 is already in use, you can change it in `vite.config.ts`:

```typescript
server: {
  host: "::",
  port: 3000, // Change this to your preferred port
}
```

### Dependencies Issues
If you encounter dependency issues:

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
If you see build errors:

1. Ensure all dependencies are up to date:
   ```bash
   npm update
   ```

2. Check Node.js version:
   ```bash
   node --version
   ```
   Should be v18 or higher.

## Project Structure

```
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   ├── integrations/   # Supabase integration
│   └── index.css       # Global styles
├── supabase/
│   ├── functions/      # Edge functions
│   └── migrations/     # Database migrations
└── public/             # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Technology Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage)
- **Build Tool**: Vite
- **Routing**: React Router v6

## Support

For issues or questions:
- Check the [Lovable Documentation](https://docs.lovable.dev/)
- Visit the project repository issues page
- Contact the development team

## License

See LICENSE file for details.
