# Build Instructions - Pathway News

## About This App

**Pathway News** is a comprehensive web application designed for BYU-Pathway Connect students and community members. It serves as a centralized hub for:

- **Campus News & Updates**: Latest announcements, student stories, and campus events
- **Spiritual Resources**: Daily devotionals and faith-based content  
- **Career Development**: Job listings, career events, AI-powered career planning tools
- **Community Engagement**: WhatsApp groups, student resources, and networking
- **Educational Resources**: Book recommendations and learning materials

### Key Features

- **AI-Powered Career Advisor**: Interactive chat and career planning using Google Gemini AI
- **Rich Content Management**: Admin dashboard with rich text editor for news, events, and resources
- **Authentication System**: Secure email/password authentication for admin access
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Social Media Integration**: Enhanced Open Graph meta tags for rich social media previews

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
- **UI Components**: shadcn/ui, Radix UI
- **Backend**: Supabase (Database, Auth, Storage, Edge Functions)
- **AI Integration**: Google Gemini via Lovable AI Gateway
- **Rich Text Editor**: Tiptap with extensions for text formatting, colors, and links
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: React Query (TanStack Query)

## Admin Access

To access the admin dashboard:

1. Navigate to `/auth` to create an admin account
2. Sign up with your email and password
3. Verify your email (if email confirmation is enabled)
4. Access the admin dashboard at `/admin`

**Note**: For testing purposes, you may want to disable email confirmation in Supabase:
- Go to Authentication → Providers in your Supabase dashboard
- Disable "Confirm email" for faster testing

## Support

For issues or questions:
- Check the [Lovable Documentation](https://docs.lovable.dev/)
- Visit the project repository issues page
- Contact the development team

## License

See LICENSE file for details.
