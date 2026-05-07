InstaPass QR Studio
Design Systems Playbook
Component Library • Screen System • QR Branding Architecture
1. Design System Foundation
Brand Identity
Premium. Modern. Dark UI. Entertainment-tech.
Color: Dark navy (#1A1A2E) as primary, cyan (#00D9FF) as accent
Typography: Arial (default body), size 14px regular, size 18px bold for headers
Spacing: 8px base unit (all spacing multiples of 8)
Radius: 4px for inputs, 8px for cards, 12px for modals
Color Palette
Purpose
Hex
RGB
Usage
Primary Dark
#1A1A2E
26, 26, 46
Backgrounds, text
Accent Cyan
#00D9FF
0, 217, 255
Active states, CTAs
Success
#00E5B8
0, 229, 184
Completed, valid
Warning
#FFB800
255, 184, 0
Cautions, pending
Error
#FF6B6B
255, 107, 107
Errors, danger
Neutral Light
#F5F5F5
245, 245, 245
Form fields, cards
Border Gray
#E8E8E8
232, 232, 232
Dividers, borders


2. Reusable Component Library
2.1 Form Components
Text Input
Height: 40px, padding 12px horizontal, 8px vertical
Border: 1px #E8E8E8, radius 4px
States: Default (#F5F5F5), Focus (#00D9FF border), Error (#FF6B6B border), Disabled (gray)
Label: 12px bold above, 8px spacing
Dropdown/Select
Height: 40px, same padding/border as input
Chevron icon right-aligned, 16px
Open state: expand dropdown 200px width, shadow, max 5 items visible
Color Picker
Visual: 40px square preview swatch + hex input beside
Click swatch: open color picker modal (8-color palette presets + custom picker)
Hex input: real-time preview update
Toggle
Size: 48px wide, 24px height
Off: gray background, white circle left
On: cyan background, white circle right, smooth 150ms transition
File Upload
Visual: Dashed border 2px #00D9FF, 80px height min
States: Default (icon + \"Drag or click\"), Hover (darker border), Uploading (spinner), Complete (checkmark + filename)
Accept: PNG, JPG, SVG (logos only)
2.2 Button Styles
Type
Default
Hover
Active
Primary
Cyan bg, dark text, 40px
Darker cyan, shadow lift
Loading spinner
Secondary
Gray outline, 40px
Light gray fill
Darker outline
Tertiary
Text only, gray
Underline appears
Underline dark
Danger
Red outline, red text
Red fill, white text
Darker red


2.3 Card Component
Background: #F5F5F5
Border: 1px #E8E8E8, radius 8px
Padding: 16px
Hover: subtle shadow increase, border to #00D9FF
Variant (dark): #2A2A3E background, lighter text
2.4 QR Preview Panel
Square container: 300x300px minimum
Border: 2px #00D9FF
Background: white with subtle grid pattern
Below: dimensions (e.g. 300x300px), file size, scan reliability score
Real-time update with 300ms debounce on form changes
3. Screen System & Layouts
3.1 Generator Screen
Left Panel (Form) | Right Panel (Live Preview)
Left Panel: 50% width
Header: \"Create QR Code\" (18px bold)
Section 1 (Essential): URL input + Code name + Template dropdown + Size
Section 2 (Expandable \"Branding\"): Logo upload + Color customization + Watermark text
Section 3 (Expandable \"Advanced\"): Error correction + Quiet zone + CTA ring text
Bottom: Two buttons [Export] [Reset]
Right Panel: 50% width, dark background (#1A1A2E)
Header: \"Preview\" (18px, cyan)
QR preview centered, 300x300px
Below: Size, file size, scan reliability meter
Bottom: Export format selector (PNG, SVG, PDF, print)
3.2 Templates Screen
Grid of template cards
Layout: 3 columns, 280px wide cards
Card structure: Thumbnail (200x200px) + Name (16px bold) + Category badge + Description
Hover: Cyan outline + \"Use template\" button overlay
Categories: Retail, Events, Brand, Loyalty (filter tabs top)
Selecting template navigates to Generator with form pre-filled
3.3 My QR Codes Screen
Table view with thumbnail preview
Columns: Thumbnail (100x100px) | Name | URL | Template | Date Created | Scans | Actions (edit/delete)
Sorting: Date (default desc), Name, Scans
Filter bar: Search + Category dropdown + Date range
Bulk actions: Checkbox select all + Export selected (ZIP) + Delete
Row click: opens detail drawer (preview + metadata + analytics)
3.4 Analytics Screen
Dashboard with metrics + chart
Top KPI tiles: Total scans | Today scans | Unique devices | Conversion rate
Tile design: white bg, dark text, left-aligned number (28px bold), label (12px gray)
Main chart: Line graph (scans over time, 7d/30d/90d toggle)
Secondary: Device type breakdown (pie), Top codes (table)
Filter by date range, code category, export as CSV
4. QR Branding Layer Architecture
4.1 QR Code Anatomy
Quiet zone: 4px white border on all sides (required for scannability)
Data area: Core QR pattern (no modifications allowed)
Module: Smallest QR square unit (typically 4-8px)
Branding layers: Logo center (optional), watermark (footer/ring), CTA text (ring)
4.2 Logo Placement Rules
Center Logo (Optional, Recommended)
Max size: 25-30% of QR code width
Position: Absolute center
Background: White square or circle with 4px padding
Impact: Blocks ~15% of data area; error correction handles recovery
Corner Logo (Alternative)
Position: Bottom right, 8px from edge
Size: 15-20% of QR width
Impact: Minimal scan impact, preserves alignment
4.3 Watermark & CTA Ring
CTA Ring Text (Circle Design)
Style: Text following circular path around QR
Examples: \"SCAN HERE\", \"GET 15% OFF\", \"UNLOCK EXCLUSIVE CONTENT\"
Spacing: 12-16px from QR quiet zone
Font: 10-12px bold, single color (match QR primary color)
Watermark/Footer Text
Position: Below QR, outside quiet zone
Style: \"Powered by InstaPass\" or custom event/venue name
Font: 8px gray, right-aligned
Opacity: 60-70% to avoid visual clutter
4.4 Branded Frame Treatments
Option 1: Circular Frame
QR contained in circle, 20px border
Border color: Brand primary (e.g. red, blue, purple)
Option 2: Rounded Square
Radius: 12px, 16px padding, bold border
Use for event/ticketing style
Option 3: Gradient Background
Subtle gradient behind QR (brand colors)
Maintains contrast and scannability
4.5 Scan Reliability Scoring
Calculate based on: Error correction level + logo size + color contrast
Display as: Visual meter (green/yellow/red) + percentage
Red alert: Logo > 30%, weak contrast, low error correction
Green: All best practices met, 95%+ reliability
5. Figma Make Implementation Prompts
Prompt 1: Create Generator Screen
Copy & paste into Figma Make:
\"Create a professional QR Studio generator screen with: Left panel (50% width) containing form with Essential section (URL input, Code name, Template dropdown, Size selector), Branding section (expandable, logo upload, color picker, watermark text), Advanced section (expandable, error correction, quiet zone, CTA ring). Right panel (50% width, dark #1A1A2E background) with 300x300px QR preview, dimensions/size below, export format selector at bottom. Use primary color #1A1A2E, accent #00D9FF. Form inputs: 40px height, 1px border #E8E8E8, 4px radius. Buttons: Primary (cyan background 40px), Secondary (gray outline). Include real-time preview debounce of 300ms.\"
Prompt 2: Create Templates Grid
Copy & paste into Figma Make:
\"Create template library screen: 3-column grid layout, 280px wide cards. Each card: 200x200px thumbnail preview QR code, 16px bold name below, small category badge (Retail/Events/Brand), 2-line description. Cards have light gray background #F5F5F5, 1px border #E8E8E8, 8px radius. On hover: cyan border #00D9FF, show \"Use template\" button overlay. Include 3 templates per category: Retail (Product, Loyalty, Inventory), Events (Registration, Social, Contact), Brand (Standard, Campaign). Add filter tabs at top.\"

Prompt 3: My QR Codes Table
Copy & paste into Figma Make:
\"Create table view: Columns - Thumbnail (100x100px), Name (16px bold), URL (truncated), Template, Date Created, Scans (blue text), Actions (edit/delete icons). Header row: dark #1A1A2E background, white text. Table rows: alternating white and light gray #F5F5F5. Add filter bar above: Search input, Category dropdown, Date range picker. Include bulk select checkbox, \"Export selected\" and \"Delete\" buttons. Row hover: light cyan background. Sorting indicators on headers.\"
Prompt 4: Analytics Dashboard
Copy & paste into Figma Make:
\"Create analytics dashboard: Top section has 4 KPI metric tiles (Total scans, Today scans, Unique devices, Conversion rate). Tiles: white background, left-aligned number (28px bold dark), label (12px gray). Main content: line chart showing scans over time (7d/30d/90d toggle), secondary pie chart for device breakdown, table of top codes. Include date range filter at top, export CSV button. Use cyan accent #00D9FF for active states and chart colors.\"

6. MVP Roadmap & Prioritization
Phase 1 MVP (Weeks 1-3)
Generator screen: Essential form only (no expandable sections yet)
QR code generation with center logo + basic color
Export: PNG + SVG
My QR Codes: Simple table view (no bulk actions)
Templates: 3 basic templates
Phase 2 (Weeks 4-6)
Expandable Branding section (logo, watermark, CTA ring)
Advanced section (error correction, frame treatments)
Scan reliability scoring
Template library expanded to 8+
Basic analytics dashboard
Phase 3+ (Future)
Bulk generator (CSV import)
AI Designer (auto-generate design variants)
Team collaboration & permissions
Advanced analytics (A/B testing, geo-tracking)
Dynamic codes & API integration
