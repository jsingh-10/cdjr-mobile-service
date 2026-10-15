# Turlock CDJR — The Mobile Mechanic

Static, mobile-first concept for the page reached from the mobile mechanic van’s QR code. Built for showing Ed the idea. No framework, build step, login, backend, external fonts, or runtime dependencies.

## Open locally

Double-click `index.html` or open it in a browser. Keep `styles.css` and `app.js` beside it. An optional local server is `python3 -m http.server 8000` from this folder; then visit http://localhost:8000.

The two buttons switch between personal and fleet forms without reloading. Switching request type starts fresh fields; the shared consent remains. Required fields have an asterisk and inline validation. At least one service and contact consent are required. Timing preferences, mileage, and notes are optional. Other requires an explanation when selected. ZIPs outside the supplied list receive a soft notice and remain eligible to submit.

Submitting only displays a demo confirmation. Nothing is sent, logged, or written to localStorage, sessionStorage, or cookies. Fields are cleared on successful submission. The callback promise is proposed copy for dealer approval, not an operational commitment from this demo.

## Placeholders

- `[DEALER LOGO]`: a labeled box only; no manufacturer or Mopar marks reproduced.
- `(209) XXX-XXXX`: both call buttons use the dummy `tel:+12090000000`; replace the text and link together before use.
- Dealership street address, footer ZIP, service days and hours.
- Privacy link: reveals placeholder text, not an approved privacy policy.
- `qr-preview.png`: real QR encoding **https://example.com/mobile-service**, for proof layouts only. Generated with Python qrcode; no generator or dependency is needed to view/use the PNG. Keep the full white quiet zone and verify the final printed code scans.
- Service area, services, scheduling options, consent wording, and one-business-day callback promise need dealer approval before launch.

## To make it real

1. Add a backend that sends each request to the dealership, such as the dealership’s CRM web form endpoint or a form service like Formspree, approved by the dealer. Add server-side validation, spam protection, delivery/error handling, and approved data retention. Show success only after acceptance.
2. Host the page on the dealership’s own website/domain. The dealer’s website provider controls that domain and integration; this mockup is for showing Ed the idea.
3. Replace every placeholder and obtain approval for the privacy policy, contact consent, coverage, service availability, and callback commitment.
4. Generate a new QR code pointing to the final approved URL, **not this mockup or example.com**. Test on phones and the printed van proof before production.

## Verification — 2026-10-15

Passed DOM execution checks for both modes: empty submissions and inline errors, first-invalid-field focus, completed submissions and confirmation focus, reset, conditional Other requirement, consent requirement, invalid ZIP format, all supplied local ZIPs, and soft out-of-area notice. All text inputs/selects/textareas have associated labels. No DOM runtime errors occurred. Source inspection confirms no network submission or browser storage code. The layout starts with a single column, 48px input controls, and at least 44px interactive targets, with visible focus styling.

**Browser verification remains incomplete:** the Chrome DevTools tool could not find Google Chrome, and the in-app browser rejected the local file URL under its security policy. No bypass was attempted. Consequently the 375px visual inspection, actual keyboard tab-through, desktop rendering check, and browser console check have not been verified. DOM tests are not a substitute for those checks.

Before presenting, open at 375px wide, switch both modes, submit empty and completed forms, tab through all controls (including Other and consent), check visible focus and no horizontal scrolling, and check the browser console. Also check desktop width and scan the QR preview.
