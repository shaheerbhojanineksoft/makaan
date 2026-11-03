# Pakistan Property Portal

A Pakistan-centric real estate portal built with **React (Vite)** and **Tailwind CSS v4**, themed on the national flag: Deep Forest Green `#01411C`, Clean White `#FFFFFF`, with off-white `#F9FAFB` and light-green `#F0FDF4` accents.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in /dist
npm run preview  # serve the production build locally
```

## Folder structure

```
src/
├── components/
│   ├── Navbar.jsx            # Logo, About Us, Contact Us, Advanced Booking CTA
│   ├── HeroSearch.jsx        # Landmark hero + glassmorphism multi-tab search
│   ├── FeaturedAgents.jsx    # Featured verified property experts
│   ├── FeaturedPlots.jsx     # Exclusive featured plots
│   ├── FreshProperties.jsx   # Newest listings with "New" badges
│   ├── AdvancedBookings.jsx  # Trending projects, horizontal carousel
│   ├── Footer.jsx
│   ├── ScrollToTop.jsx
│   └── ui/                   # Logo, SectionHeading, Badge primitives
├── pages/
│   ├── Home.jsx              # Composes all sections in scroll order
│   └── ComingSoon.jsx        # Placeholder for not-yet-built routes
├── data/                     # Dummy JSON arrays — swap for API responses
│   ├── agents.js
│   ├── plots.js
│   ├── properties.js
│   ├── projects.js
│   ├── filters.js            # Cities, property/project types, price bounds
│   └── siteConfig.js         # Brand strings, hero image, stats
├── utils/
│   └── format.js             # PKR Lac/Crore formatting, relative dates
├── App.jsx                   # React Router setup for all future screens
├── main.jsx
└── index.css                 # Theme tokens (@theme), slider + utilities
```

## Routes

| Path | Status |
| --- | --- |
| `/` | Home — fully implemented |
| `/about` | Placeholder |
| `/contact` | Placeholder |
| `/properties` | Placeholder (receives search params) |
| `/properties/:id` | Placeholder |
| `/agents` | Placeholder |
| `/agents/:id` | Placeholder |
| `/advanced-booking` | Placeholder |
| `*` | 404 |

To ship a new screen, create `src/pages/YourPage.jsx` and replace the matching
`<Route element={<ComingSoon … />} />` in `App.jsx`.

## Theme tokens

Defined once in `src/index.css` under `@theme`, so they are available as normal
Tailwind utilities (`bg-brand`, `text-brand-soft`, …):

| Token | Value | Usage |
| --- | --- | --- |
| `brand` | `#01411C` | Primary / flag green |
| `brand-dark` | `#012b13` | Hover, gradients |
| `brand-light` | `#046a2e` | Secondary green |
| `brand-soft` | `#F0FDF4` | Light green section tint |
| `offwhite` | `#F9FAFB` | Off-white section surface |

## Connecting a Node.js backend

Every section renders from a plain array export, so replacing the data layer
requires no component changes:

```jsx
// before
import { featuredAgents } from '../data/agents'

// after
const [featuredAgents, setFeaturedAgents] = useState([])

useEffect(() => {
  fetch('/api/agents?featured=true&limit=10')
    .then((res) => res.json())
    .then(setFeaturedAgents)
}, [])
```

`HeroSearch` forwards its filter payload — `{ purpose, city, propertyType, maxPrice }`
— to the `onSearch` prop, which `Home.jsx` maps onto the `/properties` route.

## Assets

`SITE.heroImage` in `src/data/siteConfig.js` defaults to
`/public/hero-pakistan.svg` — a locally authored, licence-free illustration of
Badshahi Mosque, Minar-e-Pakistan, Mazar-e-Quaid and Faisal Mosque. To use your
own photograph instead, drop it into `/public` and point `heroImage` at it.

Listing/agent imagery in `src/data/*.js` uses remote placeholder URLs so the demo
renders offline-free of setup. Replace them with your own licensed CDN assets
before going to production.
