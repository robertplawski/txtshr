# txtshr - Simple Text Sharing Platform

A modern, minimalist text sharing platform built with TypeScript, React, and Cloudflare Workers. Share text snippets instantly with support for both anonymous and authenticated posting.

## 🚀 Features

- **Instant Text Sharing** - Create and share text snippets with a single click
- **Anonymous & Authenticated Posting** - Post anonymously or create an account for enhanced features
- **Privacy Controls** - Choose between public, unlisted, or private visibility for your texts
- **Clean & Minimal UI** - Beautiful, distraction-free interface built with shadcn/ui
- **Responsive Design** - Works perfectly on desktop and mobile devices
- **Fast & Reliable** - Built on Cloudflare Workers for global edge deployment
- **Type-Safe APIs** - End-to-end type safety with tRPC
- **Real-time Updates** - Instant UI updates with React Query

## 🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with latest features
- **TanStack Router** - Type-safe file-based routing
- **TanStack Query** - Powerful data fetching and caching
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **Vite** - Fast build tool and dev server

### Backend

- **Hono** - Lightweight, fast web framework for Cloudflare Workers
- **tRPC** - End-to-end type-safe APIs
- **Drizzle ORM** - TypeScript-first ORM
- **Cloudflare D1** - Serverless SQLite database
- **Better Auth** - Modern authentication solution

### Infrastructure

- **Cloudflare Workers** - Serverless edge runtime
- **TurboRepo** - Monorepo build system
- **TypeScript** - Full type safety across the stack

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or bun package manager
- Cloudflare account (for deployment)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/robertplawski/txtshr.git
   cd txtshr
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example files and configure your environment:

   ```bash
   # For the web app
   cp apps/web/.env.example apps/web/.env

   # For the server
   cp apps/server/.env.example apps/server/.env
   ```

4. **Set up the database**

   ```bash
   npm run db:push
   ```

5. **Start the development servers**

   ```bash
   npm run dev
   ```

   This will start:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000

## 🎯 Usage

### Creating Texts

1. **Anonymous Posting**: Simply enter a title and content, then click "Create Text"
2. **Authenticated Posting**: Sign up/in to access privacy controls and manage your texts

### Privacy Options

- **Public**: Visible to everyone on the homepage
- **Unlisted**: Only accessible with direct link
- **Private**: Only you can see it (requires account)

### Managing Your Texts

- View all your texts from your profile
- Delete texts you've created
- Share texts via direct links
- Copy text content to clipboard

## 🏗️ Project Structure

```
txtshr/
├── apps/
│   ├── web/                    # Frontend React application
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   ├── routes/         # TanStack Router routes
│   │   │   ├── lib/           # Utilities and configurations
│   │   │   └── utils/         # Helper functions
│   │   └── package.json
│   └── server/                 # Backend API
│       ├── src/
│       │   ├── db/            # Database schema and migrations
│       │   ├── lib/           # Server utilities
│       │   └── routers/       # tRPC route handlers
│       └── package.json
├── package.json               # Root package.json with scripts
└── README.md
```

## 🚀 Available Scripts

### Development

- `npm run dev` - Start all applications in development mode
- `npm run dev:web` - Start only the web application
- `npm run dev:server` - Start only the server

### Building

- `npm run build` - Build all applications for production
- `npm run check-types` - Check TypeScript types across all apps

### Database

- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio database UI
- `npm run db:generate` - Generate new migrations
- `npm run db:migrate` - Run pending migrations

## 🔧 Configuration

### Environment Variables

#### Web App (apps/web/.env)

```
VITE_API_URL=http://localhost:3000
```

#### Server (apps/server/.env)

```
DATABASE_URL=your-database-url
BETTER_AUTH_SECRET=your-auth-secret
BETTER_AUTH_URL=http://localhost:3000
```

### Database Setup

The application uses Cloudflare D1 (SQLite) with Drizzle ORM. For local development:

1. **Local Development**: The database runs automatically with `wrangler dev`
2. **Production**: Configure your Cloudflare D1 database in wrangler.jsonc

## 🌐 Deployment

### Deploy to Cloudflare Workers

1. **Configure wrangler.jsonc** in apps/server/
2. **Set up Cloudflare D1 database**
3. **Deploy the server**

   ```bash
   cd apps/server
   npm run deploy
   ```

4. **Build and deploy the frontend**
   ```bash
   npm run build
   # Deploy the built files to your preferred hosting service
   ```

### Environment-Specific Deployments

- **Development**: Uses local SQLite database
- **Staging**: Configure staging environment variables
- **Production**: Set up production database and auth secrets

## 🔐 Authentication

The app uses Better Auth for authentication with the following features:

- Email/password authentication
- Session management
- Protected routes
- User-specific text management

## 📱 API Endpoints

The backend provides the following tRPC procedures:

### Texts

- `texts.create` - Create a new text
- `texts.createAnonymous` - Create anonymous text
- `texts.getById` - Get text by ID
- `texts.getAll` - Get paginated public texts
- `texts.delete` - Delete a text (owner only)

### Auth

- `auth.signUp` - User registration
- `auth.signIn` - User login
- `auth.signOut` - User logout
- `auth.getSession` - Get current session

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run check-types`
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please open an issue on the GitHub repository or contact the maintainers.

## 🙏 Acknowledgments

- Built with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Deployed on [Cloudflare Workers](https://workers.cloudflare.com/)
