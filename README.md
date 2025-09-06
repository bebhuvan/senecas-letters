# Letters to Lucilius - Seneca

A beautiful, modern digital collection of Seneca's 124 letters to his friend Lucilius, built with Astro and deployed on Cloudflare Pages.

![Seneca Letters Screenshot](https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=400&fit=crop&auto=format)

## 📖 About

This project presents Lucius Annaeus Seneca's complete correspondence with Lucilius Junior (62-65 CE) in a modern, accessible format. The letters contain timeless wisdom on Stoic philosophy, practical ethics, and the art of living well.

### Features

- **124 Complete Letters** - All surviving letters with full text
- **Beautiful Typography** - Optimized for reading with multiple font sizes
- **Theme Support** - Light/dark mode with system preference detection  
- **Responsive Design** - Works perfectly on all devices
- **Fast Search** - Find letters by content, themes, or topics
- **Smart Organization** - Browse by themes, chronologically, or featured selections
- **Progressive Enhancement** - Works without JavaScript, enhanced with it
- **Static Generation** - Lightning fast with Astro's static site generation

## 🏗️ Tech Stack

- **[Astro](https://astro.build/)** - Static site generator
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Cloudflare Pages](https://pages.cloudflare.com/)** - Hosting and edge delivery
- **Vanilla CSS** - No frameworks, just beautiful custom styles
- **Content Collections** - Structured content management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Git

### Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seneca-letters
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:4321
   ```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable Astro components
│   ├── Navigation.astro
│   ├── LetterCard.astro
│   └── ...
├── content/            # Content collections
│   ├── config.ts       # Content schema
│   └── letters/        # 124 letter markdown files
│       ├── letter-001.md
│       ├── letter-002.md
│       └── ...
├── layouts/            # Page layouts
│   └── BaseLayout.astro
├── pages/              # Route pages
│   ├── index.astro     # Homepage
│   ├── archive.astro   # Letter archive
│   ├── search.astro    # Search page
│   ├── about.astro     # About page
│   └── letters/
│       └── [...slug].astro  # Dynamic letter pages
└── styles/
    └── global.css      # Global styles & CSS custom properties

public/
├── favicon.svg         # Site favicon
├── robots.txt         # SEO robots file
└── fonts/             # Self-hosted fonts (optional)

scripts/
└── import-letters.js   # Letter import utility
```

## 🎨 Design System

### Typography
- **Headings**: Newsreader (Google Fonts)
- **Body**: Newsreader for reading content
- **UI**: Instrument Sans for navigation and metadata
- **Scale**: 1.25 modular scale for consistent hierarchy

### Colors
```css
--royal-blue: #2563EB;     /* Primary accent */
--soft-blue: #E8F0FE;      /* Selection & highlights */
--text-primary: #1a1a1a;   /* Main text */
--text-secondary: #4a4a4a; /* Secondary text */
--bg-primary: #ffffff;     /* Main background */
--bg-soft: #fafaf8;        /* Soft background sections */
```

### Layout
- **Max Width**: 1200px for containers
- **Content Width**: 760px for optimal reading
- **Responsive**: Mobile-first approach
- **Spacing**: Consistent rhythm with CSS custom properties

## 📝 Content Management

### Letter Format

Each letter is a Markdown file with frontmatter:

```markdown
---
number: 1
title: "On Saving Time"
date: "Summer, 62 CE" 
location: "Campania"
themes: ["time", "mortality", "philosophy"]
readingTime: 8
featured: true
excerpt: "Nothing is ours except time..."
---

# Letter 1: On Saving Time

Letter content goes here...
```

### Adding New Letters

1. Create a new markdown file in `src/content/letters/`
2. Follow the frontmatter schema defined in `src/content/config.ts`
3. Build will automatically generate the letter page

### Themes

Letters are organized by themes for easy discovery:

- Time & Mortality
- Philosophy & Wisdom  
- Friendship & Society
- Virtue & Character
- Wealth & Poverty
- Health & Body

## 🌐 Deployment

### Cloudflare Pages (Recommended)

1. **Connect Repository**
   - Go to Cloudflare Pages dashboard
   - Connect your GitHub/GitLab repository

2. **Configure Build**
   ```
   Build command: npm run build
   Build output: dist
   Root directory: /
   Node.js version: 18+
   ```

3. **Deploy**
   - Automatic deployments on every push
   - Preview deployments for pull requests
   - Global CDN delivery

### Alternative Hosting

This is a static site and can be deployed anywhere:

- **Netlify**: Connect repo, set build command to `npm run build`
- **Vercel**: Import project, zero config needed
- **GitHub Pages**: Use GitHub Actions with Astro's official action
- **Any Static Host**: Upload the `dist` folder contents

## 🔧 Configuration

### Site URL

Update in `astro.config.mjs`:

```js
export default defineConfig({
  site: 'https://your-domain.com',
  // ...
});
```

### Fonts

Self-host fonts for better performance:

1. Download font files to `public/fonts/`
2. Update CSS in `src/styles/global.css`
3. Add preload links in `BaseLayout.astro`

### Analytics

Add analytics in `BaseLayout.astro`:

```astro
<!-- Cloudflare Web Analytics (privacy-friendly) -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js' 
        data-cf-beacon='{"token": "your-token"}'></script>
```

## 📱 Progressive Enhancement

The site works without JavaScript and progressively enhances:

- **Core Content**: Always accessible, semantic HTML
- **Theme Toggle**: CSS-only fallback, enhanced with JS
- **Search**: Basic CSS filtering, enhanced with JS
- **Navigation**: Works with pure CSS, smooth with JS

## 🔍 SEO Features

- Semantic HTML structure
- Meta tags with Open Graph
- Sitemap generation (automatic)
- Robots.txt
- Fast loading scores
- Mobile-friendly design

## 🧪 Testing

```bash
# Type checking
npm run astro check

# Build test
npm run build

# Preview build
npm run preview
```

## 📄 License

The source code is available under the MIT License. 

Seneca's letters are in the public domain. This project uses translations that are also in the public domain.

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- Additional letter themes and categorization
- Enhanced search functionality  
- Better mobile navigation
- Accessibility improvements
- Performance optimizations

## 🙏 Acknowledgments

- **Seneca** - For the timeless wisdom
- **Public Domain Translations** - Making this content accessible
- **Astro Team** - For the excellent static site generator
- **Cloudflare** - For fast, global delivery

---

> "Every new thinker is a beginning, for he begins by thinking for himself." — Seneca

Built with ❤️ for lovers of philosophy and beautiful web experiences.