# Background Video Implementation Plan

Plan for adding a full screen background video to the `index.html` hero, modeled on
[darcystamp.com](https://darcystamp.com/). The video plays automatically, muted, on
loop, with no YouTube UI or logos, the moment a visitor lands on the site.

---

## Decision: YouTube embed, not self hosted

We will use a **YouTube embed** driven by the YouTube IFrame JS API, exactly like
Darcy Stamp does. We are **not** self hosting the video file.

### Why YouTube over self hosting
- **Zero bandwidth cost to us.** The video is served by YouTube, not Vercel. This
  completely sidesteps the Vercel free tier bandwidth limit (100 GB per month),
  which a self hosted 150 to 250 MB hero would blow through in only a few hundred
  visits.
- **100 percent client side.** It is just a `div`, an `iframe`, and a small script.
  No server, no serverless function, nothing special. Drops straight into our
  vanilla HTML and JS hero.
- **Proven in production.** Darcy Stamp is live proof that a no logo, no sound,
  autoplaying YouTube background works.

---

## How Darcy Stamp did it (our reference)

Their hero is a YouTube embed (`youtube.com/embed/CBPkK92ED6E`), which is
Squarespace's built in background video feature.

The UI is hidden with two techniques:

1. **Embed parameters strip the chrome:** `controls=0`, `modestbranding=1`,
   `rel=0`, `iv_load_policy=3`, `showinfo=0`, `playsinline=1`, `enablejsapi=1`.
2. **Scale and crop.** The iframe is blown up larger than the viewport and shifted
   so YouTube's edge UI (logo, title) is pushed off screen and cropped by the
   container. The pixel values are computed by JS and recalculated on resize to keep
   a 16:9 video covering the whole box.

We will simplify their setup: they start playback through the JS API
(`autoplay=0` plus a ready handler), but we can just use `autoplay=1&mute=1`
directly.

---

## What we will build

- A full bleed YouTube background video filling the hero, like Darcy Stamp.
- Muted, autoplay, looping, no controls, no logos.
- A darkening gradient overlay so the hero text stays readable on top of the video.
- **Mobile fallback to the static photo.** YouTube iframe autoplay is unreliable on
  mobile (especially iOS), so phones show the existing white headshot instead. This
  is already wired up in our hero, so it slots in cleanly: **video on desktop, photo
  on mobile.**
- A small resize script for the cover crop so the video always fills the area with
  no black bars.

---

## Caveats to keep in mind
- **Muted is mandatory** for autoplay. This is fine, we want no sound anyway.
- **Looping** needs either `loop=1&playlist=VIDEO_ID` or a small "on ended, restart"
  handler.
- **Mobile autoplay is unreliable** for YouTube iframes, hence the photo fallback.
- **A faint logo or title can briefly flash** on load or at the loop seam. The
  overlay div plus a poster image cover this, but it is not guaranteed 100 percent
  gone, because YouTube deliberately limits what `modestbranding` removes.
- **Loop seam.** There can be a brief stutter when the video restarts. It is not a
  perfectly seamless loop.

---

## Open questions to answer before we implement

> Answer these, then we build.

### 1. YouTube video link
- Is the roughly 30 second clip uploaded to YouTube yet?
- If yes, paste the link or the video ID here: `__________`
- It must be **Public or Unlisted**, not Private, or the embed will not play.
- If it is not uploaded yet, we build now with a **placeholder video ID** and you
  swap in the real one later (we will mark the exact line to change).

**Answer:**

### 2. Hero text treatment
Darcy's text is a single short quote at bottom left. Our current hero has more
content (eyebrow, a long bio paragraph, and two buttons). Pick one:

- **Option A, keep all current hero text** over the video, with a darkening overlay
  so it stays legible.
- **Option B, trim it down** closer to Darcy's minimal cinematic style (for example
  eyebrow, one short line, and the buttons).

**Answer:**

### 3. Layout confirmation
Confirmed: **full bleed background video** like Darcy, replacing the current split
layout (text left, photo right 52 percent).

**Answer (confirm or change):**

---

## Implementation checklist (once questions are answered)
- [ ] Add the YouTube IFrame API script and player container to `index.html` hero.
- [ ] Configure embed params: `autoplay=1`, `mute=1`, `controls=0`,
      `loop=1&playlist=VIDEO_ID`, `playsinline=1`, `modestbranding=1`, `rel=0`,
      `iv_load_policy=3`.
- [ ] Add the cover crop CSS and resize script (scale iframe to fill, crop overflow).
- [ ] Add the darkening gradient overlay for text legibility.
- [ ] Keep the static photo fallback on mobile (less than or equal to 860px).
- [ ] Add a poster image behind the video to cover the initial load flash.
- [ ] Test autoplay on desktop Chrome, Safari, Firefox.
- [ ] Confirm mobile shows the photo, not a broken video.
