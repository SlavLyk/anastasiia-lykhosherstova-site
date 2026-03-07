# Anastasiia Lykhosherstova Site — Project Instructions

## Frontend Tasks
For every frontend task (components, pages, layouts, styling, redesigns), use the `frontend-design` skill. This ensures high design quality and avoids generic aesthetics.

## Writing Style
Never use hyphens or dashes in visible text content on the site. Use commas instead. This applies to all HTML content, labels, descriptions, and copy.

## Site Overview
Personal website for Anastasiia Lykhosherstova, professional violinist and composer based in Calgary, Alberta.

## Design System
- Colors: --dark #111010, --charcoal #1c1b1a, --mid #2e2c2a, --gold #C9A55A, --gold-light #E8D5A3, --ivory #f7f3ec
- Fonts: Cormorant Garamond (serif display) + Jost (sans body)
- Tone: dark luxury, sophisticated, gold accents used with restraint
- No grey backgrounds, keep it dark

## Tech Stack
- Vanilla HTML, CSS, JS static site
- Deployed on Vercel
- shared.js injects nav and footer into every page
- style.css holds global styles and variables
- Breakpoints: 860px primary mobile, 1024px tablet
- Serverless functions in /api/ using ES module export default

## Pages
- index.html: home hero with YYC Musicians photo on right side
- about.html: sticky photo left, content right, social strip at bottom
- services.html: alternating image and content blocks
- lessons.html: statement full width, two columns learning and teaching experience, pillars, format, CTA
- gallery.html: masonry grid with real photos
- events.html: Notion API integration via /api/events
- contact.html: form submits to /api/contact via Resend

## Real Photos in Use
- yycmusicians photo: home page hero (right side)
- Photo_Anastasiia.jpg: about page sticky left column
- Gallery uses real photos from root directory (anastasia_violinist__ prefix files)

## Email
- Contact form sends via Resend API to budkoanastasia08@gmail.com
- Requires RESEND_API_KEY env var in Vercel
