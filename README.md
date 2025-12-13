<<<<<<< HEAD
# xandeum-analytics
=======
# Xandeum pNode Analytics Platform

A modern analytics platform for Xandeum pNodes, providing insights into the network of storage provider nodes. Similar to Solana validator dashboards like stakewiz.com and validators.app, but designed specifically for Xandeum's storage provider network.

## Live Link / Repository

- Live site: https://xandeum-analytics-mom2xhe79-eloo075s-projects.vercel.app
- GitHub repository: https://github.com/your-org/xandeum-analytics

Replace the above with your actual deployment URL and repository once created (see Deployment and Publishing sections below).

## Features

- **Real-time pNode Data**: Retrieves all pNodes appearing in gossip using pNode RPC (pRPC) calls
- **Comprehensive Dashboard**: View all pNodes with detailed information including:
  - Status (online/offline/syncing)
  - Public keys and addresses
  - Storage capacity and usage
  - Reputation scores
  - Uptime tracking
  - Latency metrics
  - Regional distribution
- **Advanced Filtering**: Filter by status, sort by various metrics
- **Search Functionality**: Search pNodes by pubkey, ID, address, or region
- **Statistics Overview**: Network-wide statistics including:
  - Total nodes and online/offline counts
  - Total storage capacity and usage
  - Average reputation scores
  - Average uptime
- **Modern UI/UX**: Beautiful, responsive design with dark mode support
- **Auto-refresh**: Automatically refreshes data every minute

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd xandeum-analytics
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Configure RPC endpoint:
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` and set your Xandeum RPC endpoint.

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```
 
## Deployment

### Option A: Deploy to Vercel (Recommended)

1. Create a Vercel account at https://vercel.com and install the CLI:
   ```bash
   npm i -g vercel
   ```
2. From the project directory, deploy:
   ```bash
   vercel
   ```
   For production:
   ```bash
   vercel --prod
   ```
3. In Vercel Project Settings → Environment Variables, set (optional):
   - `NEXT_PUBLIC_XANDEUM_RPC` – Your RPC endpoint

Vercel will give you a live URL to share for review.

### Option B: Self-host (Node.js server)

1. Build the app:
   ```bash
   npm run build
   ```
2. Start the server (Node 18+):
   ```bash
   npm start
   ```
3. Put it behind an HTTPS reverse proxy (Nginx/Caddy) on port 3000.

## Configuration

### RPC Endpoint

The platform connects to Xandeum pNode RPC endpoints. You can configure the RPC endpoint in two ways:

1. **Environment Variable** (Recommended):
   Create a `.env.local` file:
   ```
   NEXT_PUBLIC_XANDEUM_RPC=https://rpc.xandeum.network
   ```

2. **Direct Configuration**:
   Edit `lib/rpc.ts` and update the `DEFAULT_RPC_ENDPOINT` constant.

### RPC Methods

The platform attempts to call various RPC methods to retrieve pNode data:
- `getPNodes`
- `get_pnodes`
- `getClusterNodes`
- `getGossipNodes`

If none of these methods work, the platform will use mock data for demonstration purposes. Once you have the correct RPC method names from the Xandeum documentation, update `lib/rpc.ts` accordingly.

**Note**: Join the [Xandeum Discord](https://discord.gg/uqRSmmM5m) for API documentation and support.

## Using the Platform

- **Dashboard**: Overall metrics and charts for quick insight.
- **Search**: Find nodes by `pubkey`, `id`, `address`, or `region`.
- **Filter**: Status filter with colored dots for Online/Offline/Syncing.
- **Sort**: Choose metric (Reputation, Uptime, Storage Capacity/Used, Latency, Region) and order. Active column headers show arrows.
- **Node details**: Click a row for more info.
- **Export**: Download the visible dataset as CSV.

## Project Structure

```
xandeum-analytics/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main dashboard page
│   ├── providers.tsx      # React Query provider
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── DashboardHeader.tsx
│   ├── StatsCards.tsx
│   ├── PNodeTable.tsx
│   ├── SearchBar.tsx
│   ├── FilterBar.tsx
│   └── RefreshButton.tsx
├── lib/                   # Utilities and services
│   ├── rpc.ts            # Xandeum RPC client
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
└── package.json
```

## Tech Stack

- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **TanStack Query (React Query)**: Data fetching and caching
- **Lucide React**: Icon library
- **Axios**: HTTP client for RPC calls

## Features in Detail

### Dashboard Overview
- Network statistics at a glance
- Real-time node counts and status
- Storage capacity metrics
- Performance indicators

### pNode Table
- Sortable columns (reputation, uptime, storage, latency, region)
- Status indicators with color coding
- Storage usage visualization
- Reputation score bars
- Relative time display for last seen

### Search & Filter
- Real-time search across multiple fields
- Filter by node status
- Multiple sorting options
- Ascending/descending order toggle

## Publishing to GitHub

1. Initialize and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Xandeum pNode Analytics"
   ```
2. Create a GitHub repo and push (using GitHub CLI):
   ```bash
   gh repo create your-org/xandeum-analytics --public --source=. --remote=origin --push
   ```
   Or manually:
   ```bash
   git remote add origin https://github.com/your-org/xandeum-analytics.git
   git branch -M main
   git push -u origin main
   ```

## Contributing

This is an open-source project. Feel free to submit issues and pull requests.

## License

MIT

## Additional Documentation

- **[pNode Update Guide](./PNODE_UPDATE_GUIDE.md)**: Step-by-step instructions for updating your Xandeum pNode to the latest version

## Support

For questions about the Xandeum network and API:
- Join the [Xandeum Discord](https://discord.gg/uqRSmmM5m)
- Visit [xandeum.network](https://xandeum.network) and check the Docs section

>>>>>>> aa5273b (Initial commit: Xandeum pNode Analytics)
