# Shital Dental Services — React frontend

A mobile-first dental-lab inquiry and digital bill workspace built with React + Vite.

## Run locally

1. Install Node.js 18 or newer.
2. Open a terminal in this folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL printed by Vite (normally `http://localhost:5173`).

To create a production build, run `npm run build`; the output is in `dist/`.

## Demo login

- Username: `admin`
- Password: `admin`

These are demonstration credentials only. This is a frontend-only prototype; do not expose it publicly or use the demo login to protect real patient information. Replace it with a proper backend and secure authentication before production use.

## Main features

- Dashboard with total inquiries, today's inquiries, sent count and bill totals.
- Patient inquiry form matching the supplied New Dental Art slip: doctor, patient, date, tooth shade, upper/lower tooth selection, material instructions, trial/final stages, notes and bill line items.
- Digital bill preview and PNG generation.
- Inquiry history with search, status filters, edit, delete and re-share.
- Admin-editable doctor directory (add, edit and remove).
- Admin-editable WhatsApp destination and lab details.
- JSON backup export and restore.
- Responsive layout designed for phone screens.

## WhatsApp sharing behaviour

The inquiry text is formatted and a PNG bill image is generated in the browser. On browsers/devices that support sharing files, the native share sheet receives both the text and image; choose WhatsApp and the destination chat. On unsupported browsers, the PNG downloads and WhatsApp opens with the text prefilled. Attach the downloaded PNG in that chat and press Send. A normal website cannot silently send a WhatsApp message or image in the background. Fully automatic sending requires a backend and the official WhatsApp Business Platform/API with its setup and permissions.

Enter the WhatsApp number in Settings with country code, e.g. `919876543210` (digits only).

## Storage and production notes

- Data is stored in this browser's `localStorage` on this device. It does not sync across devices and can be lost if browser data is cleared. Export backups regularly.
- For multi-user access, secure patient data, central backups, and reliable WhatsApp API sending, add a backend/database and authenticated server-side accounts.
- The bill is a digital inquiry/bill template based on the two reference slips. Verify the lab's legal/business details and billing requirements before issuing it as a tax invoice.
