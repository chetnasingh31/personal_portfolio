# CHETNA SIKARWAR - Premium Portfolio Website

A premium, modern, fully responsive personal portfolio for a final-year Information Technology student specializing in Data Analytics, Machine Learning, and Software Development.

## Tech Stack
- HTML5
- CSS3 (custom design system, glassmorphism, animations)
- Vanilla JavaScript (UI interactions, typing effect, scroll animations)

## Key Features
- Dark + light mode toggle with saved preference
- Sticky glassmorphism navbar with mobile menu
- Animated hero section with typing effect and gradient heading
- Scroll progress indicator
- Section reveal transitions on scroll
- Premium project cards with hover motion
- Animated skill bars
- Contact form (direct inbox delivery via FormSubmit)
- Particle background and loader animation
- SEO-focused meta tags and semantic section structure
- Fully responsive across desktop, tablet, and mobile

## Project Structure
```text
chetna_portfolio/
|- index.html
|- README.md
|- style.css
|- main.js
|- chetna_sikarwar_CV.pdf
```

## Run Locally
1. Open the project folder.
2. Start a local static server:
   - Python: `python -m http.server 5500`
3. Open `http://localhost:5500`.

You can also open `index.html` directly, but a local server is recommended for smoother behavior.

## Deployment

### Netlify
1. Push this folder to GitHub.
2. In Netlify, click **Add new site** -> **Import an existing project**.
3. Select the repo.
4. Build command: leave empty.
5. Publish directory: `.`
6. Deploy.

### Vercel
1. Import the GitHub repo in Vercel.
2. Framework preset: **Other**.
3. Build command: leave empty.
4. Output directory: `.`
5. Deploy.

### GitHub Pages
1. Push the repository to GitHub.
2. Go to **Settings** -> **Pages**.
3. Set source to deploy from `main` branch root.
4. Save and wait for Pages URL generation.

## Contact Form Setup
- The form is configured to send messages to `chetnasikarwar703@gmail.com` through FormSubmit.
- On first submission, FormSubmit may email an activation link to this inbox. Activate once so all future messages are delivered.

## Resume Button Setup
- Current resume file path is:
  - `chetna_sikarwar_CV.pdf`
- Replace this file with your latest resume while keeping the same filename for instant update.
