# PathPilot UI & Design Guidelines

> Design System, Visual Identity, and Component Guidelines for PathPilot

---

## 1. Design Philosophy

PathPilot's visual identity is built around the concept of clarity, progress, and focused learning. As an educational SaaS platform, the interface minimizes visual clutter while providing high-contrast cues that guide users through structured career tracks.

The design relies on three core tenets:
1. **Purposeful Visual Hierarchy**: Important actions, career progress meters, and primary navigation elements take visual precedence.
2. **Modern SaaS Aesthetic**: Clean surfaces, soft drop shadows, rounded corners (`rounded-xl`), and vibrant indigo/cyan accents reflect modern web applications.
3. **Calm Focus**: Neutral background tones (`#F8FAFC`) reduce eye fatigue during extended learning sessions.

---

## 2. Color Palette

PathPilot utilizes a curated color tokens palette declared in `:root` CSS variables and utility classes:

| Token Name | Hex Code | Purpose & Usage |
| :--- | :--- | :--- |
| **Primary** | `#4F46E5` (Indigo 600) | Main brand identity color, primary action buttons, active navigation states. |
| **Primary Dark** | `#3730A3` (Indigo 800) | Hover states for primary buttons and dark accent elements. |
| **Secondary / Accent** | `#06B6D4` (Cyan 500) | Highlights, secondary badges, and progress bar accent gradients. |
| **Success** | `#10B981` (Emerald 500) | Module completion badges, success alerts, and completed progress indicators. |
| **Warning** | `#F59E0B` (Amber 500) | In-progress statuses, warnings, and medium-difficulty indicators. |
| **Danger / Error** | `#EF4444` (Red 500) | Error messages, form validation alerts, and destructive actions. |
| **Background** | `#F8FAFC` (Slate 50) | Primary canvas background color for all page layouts. |
| **Surface** | `#FFFFFF` (White) | Component container backgrounds, cards, modal overlays, and navbar. |
| **Text Main** | `#0F172A` (Slate 900) | Primary headings, table text, and high-emphasis body copy. |
| **Text Muted** | `#64748B` (Slate 500) | Secondary body copy, subheaders, helper text, and timestamps. |

---

## 3. Typography

PathPilot uses the **Inter** font family with a system fallback stack for crisp legibility across screens.

```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Type Scale

| Level | Size / Line Height | Weight | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Heading 1** | `2.25rem` (36px) / 1.2 | `Bold` (700) | `text-3xl font-bold` | Page titles (e.g., "Student Dashboard"). |
| **Heading 2** | `1.5rem` (24px) / 1.3 | `SemiBold` (600) | `text-2xl font-semibold` | Section titles & card headers. |
| **Heading 3** | `1.25rem` (20px) / 1.4 | `Medium` (500) | `text-xl font-medium` | Sub-section headers & module titles. |
| **Body Large** | `1.125rem` (18px) / 1.5 | `Regular` (400) | `text-lg font-normal` | Hero text & lead paragraphs. |
| **Body Regular**| `1.0rem` (16px) / 1.5 | `Regular` (400) | `text-base` | Default body copy, descriptions, and inputs. |
| **Small Text** | `0.875rem` (14px) / 1.4 | `Regular` (400) | `text-sm text-slate-500` | Metadata, badges, timestamps, and captions. |

---

## 4. Spacing System

PathPilot adheres to an 8-point spacing grid to maintain consistent rhythm and component alignment.

### Layout Padding & Margins

- **Containers**: Max width `max-w-7xl` centered with horizontal padding `px-4 sm:px-6 lg:px-8`.
- **Page Sections**: Vertical margin/padding `py-8` to `py-12` between major page blocks.
- **Card Padding**: Internal card padding `p-6` (24px) for desktop and `p-4` (16px) on mobile viewports.
- **Grid Gaps**: Standard gap `gap-6` (24px) between grid cards.

---

## 5. Components Guidelines

### Buttons
- **Primary Button**: `bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-colors shadow-sm`
- **Secondary Button**: `bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-2 rounded-lg transition-colors`
- **Outline Button**: `border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium px-4 py-2 rounded-lg`

### Cards
- **Standard Surface Card**: `bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow`
- **Interactive Module Card**: Includes checkbox control, title, duration badge, and progress pill.

### Sidebar & Navbar
- **Navbar**: Top sticky bar (`sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200`) housing brand logo, route links, and profile badge.

### Forms & Input Fields
- **Text Inputs**: `w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900`
- **Labels**: `block text-sm font-medium text-slate-700 mb-1`

### Badges
- **Success Badge**: `bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2.5 py-0.5 rounded-full`
- **Warning Badge**: `bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold px-2.5 py-0.5 rounded-full`
- **Neutral Badge**: `bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-0.5 rounded-full`

### Progress Bars
- **Container**: `w-full bg-slate-200 rounded-full h-2.5 overflow-hidden`
- **Fill Bar**: `bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out`

### Empty States
- Centered layout with muted illustration or icon (`text-slate-400`), title (`text-lg font-medium text-slate-700`), helper text (`text-slate-500`), and a prominent call-to-action button (e.g., "Explore Careers").

### Loading States
- Animated skeleton pulse loaders (`animate-pulse bg-slate-200 rounded-md`) matching layout shapes to minimize layout shifts.

### Error States
- Alert banner with red border (`bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded-r-md`).

---

## 6. Responsive Breakpoints

PathPilot implements responsive design matching Tailwind CSS default breakpoints:

| Breakpoint | Minimum Width | Target Devices | Layout Adjustments |
| :--- | :--- | :--- | :--- |
| **Mobile (`sm`)** | `640px` | Smart phones (Portrait/Landscape) | Single column layouts, stacked forms, collapsible menu. |
| **Tablet (`md`)** | `768px` | Tablets & small laptops | 2-column grid cards, visible header navigation. |
| **Desktop (`lg`)** | `1024px` | Standard Laptops & Desktop monitors | 3-column career grid, full dashboard analytics sidebar. |
| **Large Desktop (`xl`)** | `1280px` | Widescreen Displays | Container max-width capped at `1280px` centered. |

---

## 7. Core Design Principles

1. **Consistency**: Uniform application of colors, typography scales, button states, and padding conventions across all views.
2. **Accessibility (a11y)**: High contrast ratios for body copy against light surfaces ($>4.5:1$), visible keyboard focus indicators, and semantic HTML elements (`nav`, `main`, `header`, `footer`).
3. **Minimalism**: Eliminating non-essential decorative elements to focus user attention entirely on learning materials and progress indicators.
4. **Professional SaaS Feel**: Crisp borders, subtle drop shadows, smooth transitions (`duration-200`), and responsive layouts that mirror industry-leading platforms.
