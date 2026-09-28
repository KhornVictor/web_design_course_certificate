# Web Design Course Certificate Studio

An interactive, responsive web application for previewing, customizing, batch-printing, and exporting high-resolution course completion certificates for the **ITC (Institute of Technology of Cambodia)** and **GIC (Department of Information and Communication Engineering)** Crash Course.

Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## ✨ Features

- 🎓 **Interactive Certificate Studio**: Switch effortlessly between single-student inspection mode and a multi-column batch grid overview.
- 🔍 **Real-Time Student Search**: Quickly filter through student rosters by name with instant UI feedback.
- 🖨️ **Print-Ready Styles**: Dedicated print styling (`@media print`) configured for A4 landscape paper, page-break handling, and automatic removal of drawer/navigation UI elements.
- 💾 **High-Resolution PNG Export**: Client-side canvas rendering engine producing crisp 300 DPI A4 (2970 × 2100 px) downloadable certificate images.
- ⚙️ **Configurable Data**: Effortlessly customize student lists and course metadata using simple CSV and JSON files without writing any code.
- 🚀 **Static Export & GitHub Pages**: Configured for static HTML exports (`output: "export"`) with an automated GitHub Actions deployment workflow.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (**v18.18.0** or higher, **v20+** recommended; tested on **v22**)
- [Git](https://git-scm.com/)
- A package manager: `npm` (bundled with Node.js), `pnpm`, `yarn`, or `bun`

---

## 🚀 Getting Started

### 1. Clone the Repository

Clone this repository to your local machine using Git:

```bash
git clone https://github.com/KhornVictor/web_design_course_certificate.git
cd web_design_course_certificate
```

### 2. Install Dependencies

Install the required npm packages:

```bash
npm install
```

> If you prefer using other package managers:
> ```bash
> pnpm install   # or: yarn install   # or: bun install
> ```

### 3. Run the Development Server

Start the local development server:

```bash
npm run dev
```

### 4. Open in Your Browser

Open your browser and navigate to:

```text
http://localhost:3000
```

The application will automatically reload if you edit any files or update the certificate data.

---

## 🛠️ How to Customize Your Certificates

All certificate content is decoupled from code and can be customized via files in `public/` and `app/assets/`.

### 1. Update Student Names (`public/students.csv`)

Add or replace recipient names in [public/students.csv](public/students.csv). You can provide one name per line:

```csv
Eam Viracroth
Rorn Ravuth
Kim Chansopheak
Chenda Virakcheath
Ly Samnang
```

*(Alternatively, standard comma-separated CSV with a `name` header is also supported, as well as a JSON fallback at `public/students.json`)*.

---

### 2. Update Course & Signature Metadata (`public/cetification.json`)

Configure course titles, dates, signatures, and locations in [public/cetification.json](public/cetification.json):

```json
{
  "name": "CERTIFICATE OF COMPLETION",
  "for": "GIC Crash Course 2026",
  "signature": "Mrs. Seak Leng",
  "role": "Deputy Head of the Department of GIC",
  "subject": "Web Design",
  "location": "Phnom Penh, Cambodia",
  "start_date": "2026-08-31",
  "end_date": "2026-09-28"
}
```

#### Field Explanations:

| Field | Description | Example |
| :--- | :--- | :--- |
| `name` | Header title of the certificate | `"CERTIFICATE OF COMPLETION"` |
| `for` | Program or event title | `"GIC Crash Course 2026"` |
| `subject` | Course or subject name | `"Web Design"` |
| `signature` | Signatory's full name | `"Mrs. Seak Leng"` |
| `role` | Official title or role of signatory | `"Deputy Head of the Department of GIC"` |
| `location` | Location printed on certificate | `"Phnom Penh, Cambodia"` |
| `start_date` | Starting date (`YYYY-MM-DD`) | `"2026-08-31"` |
| `end_date` | Completion date (`YYYY-MM-DD`) | `"2026-09-28"` |

> **Note**: Dates are automatically parsed and formatted into elegant ordinal strings (e.g. *"From 31st August to 28th September 2026, Phnom Penh, Cambodia."*).

---

### 3. Replace Logos & Graphics (`app/assets/`)

To change the branding or signature images, replace the corresponding assets in [app/assets/](app/assets/):

| File | Description | Recommended Dimensions |
| :--- | :--- | :--- |
| `itc.png` | Institute of Technology of Cambodia Logo | Transparent PNG, ~400×400 px |
| `gic.png` | GIC Department Logo | Transparent PNG, ~400×400 px |
| `signature.png` | Signatory Signature Image | Transparent PNG, ~300×150 px |
| `ornamentalRule.png` | Center ornamental divider line | Transparent PNG |
| `certificate-background.jpg` | Background border & parchment texture | High-res Landscape JPG/PNG (1414×1000 px or higher) |

---

## 💻 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode with Turbopack on `http://localhost:3000` |
| `npm run build` | Compiles and exports an optimized static build into the `/out` directory |
| `npm run start` | Starts a local Next.js production server (not required for static exports) |
| `npm run lint` | Runs ESLint to check for code syntax and styling issues |

---

## 📁 Project Structure

```text
web_design_course_certificate/
├── app/
│   ├── assets/                     # Certificate logos, signatures, and background images
│   │   ├── certificate-background.jpg
│   │   ├── gic.png
│   │   ├── itc.png
│   │   ├── ornamentalRule.png
│   │   └── signature.png
│   ├── components/
│   │   ├── layout/
│   │   │   ├── CertificateDetailDrawer.tsx   # Student certificate inspector drawer
│   │   │   ├── CertificateStudio.tsx         # Main studio with batch/single view & search
│   │   │   └── StudioSettingsDrawer.tsx      # Configuration & batch print drawer
│   │   └── template/
│   │       └── Template.tsx                  # A4 responsive certificate canvas/SVG layout
│   ├── layout.tsx                  # Global HTML wrapper and font definitions
│   ├── page.tsx                    # Server component feeding certificate data to studio
│   └── globals.css                 # Tailwind CSS styles & print media rules
├── lib/
│   ├── assets.ts                   # Server-side parser for CSV, JSON config & base64 assets
│   ├── date-utils.ts               # Date range formatting with ordinal suffixes
│   ├── export-canvas.ts            # High-resolution (300 DPI) HTML5 Canvas PNG generator
│   └── image-size.ts               # Image dimensions helper
├── public/
│   ├── cetification.json           # Active course & signatory configuration
│   └── students.csv                # Student recipient roster
├── .github/
│   └── workflows/
│       └── nextjs.yml              # GitHub Actions workflow for GitHub Pages deployment
├── next.config.js                  # Next.js configuration (static export output: 'export')
├── package.json                    # Project dependencies and npm scripts
└── tsconfig.json                   # TypeScript configuration
```

---

## 🚢 Deployment

### Deploying to GitHub Pages

This project is pre-configured with a GitHub Actions workflow in `.github/workflows/nextjs.yml`.

1. Push your repository to GitHub.
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. The workflow will automatically trigger on pushes to the `main` branch, build the static site, and deploy it to GitHub Pages.

### Deploying to Vercel / Netlify / Cloudflare Pages

Because `next.config.js` specifies `output: 'export'`, running `npm run build` produces a standalone static bundle in the `out/` folder that can be hosted on any static hosting platform.

---

## 🧰 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Export Engine**: HTML5 Canvas API (300 DPI rasterization)

---

## 📄 License

This project is created for educational and certification purposes at the Institute of Technology of Cambodia (ITC).
