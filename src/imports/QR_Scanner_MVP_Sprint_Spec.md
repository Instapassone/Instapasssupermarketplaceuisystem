# QR Ticket Scanner MVP - Sprint Specification
**InstaPass | Sprint Week of June 1-7, 2026**

---

## Problem Statement

Event organizers at InstaPass venues currently rely on manual ticket entry or barcode scanning, which is slow, error-prone, and creates bottlenecks at entry points. QR code scanning is the industry standard for high-volume events and will dramatically accelerate check-ins while reducing scanning errors. This MVP enables fast, mobile-first QR ticket scanning with real-time validation and duplicate prevention.

**Impact of not solving**: Continued slow check-ins, reduced customer satisfaction, and competitive disadvantage against venues using modern scanning systems.

---

## Goals

1. **Enable real-time QR scanning** from mobile camera with <500ms validation latency
2. **Reduce scanning errors** to <1% through duplicate prevention and visual/haptic feedback
3. **Support offline fallback** with manual ticket lookup for network failures
4. **Achieve mobile-optimized UX** that works seamlessly on iPhone/Android in event environments
5. **Establish metrics baseline** for scan success rate, validation time, and duplicate detection

---

## Non-Goals

- **Desktop/tablet optimization** – MVP is mobile-first only; desktop support deferred to Phase 2
- **Barcode scanning** – QR only; 1D barcodes add complexity outside 1-week scope
- **Scan analytics dashboard** – Metrics collection only; visualization deferred to Phase 2
- **Multi-venue support** – Single venue per session; multi-venue routing is Phase 2 work
- **Custom QR branding** – Standard QR codes only; custom designs deferred

---

## User Stories

### Event Operator (Primary User)
- As an **event operator**, I want to **open the QR scanner on my phone and scan tickets**, so that **I can quickly check people into the event**
- As an **event operator**, I want to **see immediate visual feedback** (green for valid, yellow for warnings, red for invalid), so that **I know if a ticket was accepted or rejected without reading text**
- As an **event operator**, I want to **see a history of recent scans with statistics**, so that **I can monitor check-in progress and spot patterns**

### Event Operator (Fallback Scenario)
- As an **event operator**, I want to **manually search for a ticket by name, email, or ticket ID** when QR scanning fails, so that **I can still check people in without needing the scanner**

### System
- As a **system**, I want to **prevent duplicate scans of the same ticket**, so that **the same person can't enter twice with the same ticket**
- As a **system**, I want to **provide haptic and audio feedback**, so that **operators get clear confirmation in noisy event environments**

---

## Requirements by Priority

### P0: Must-Have (MVP Scope)

#### Core Scanning & Validation
- [ ] **QR Scanner Component** renders camera feed from device camera via WebRTC
  - *Acceptance*: Camera initializes on component mount; user grants camera permission via browser prompt
  - *Acceptance*: Canvas overlay displays crosshair; live feed shows in real-time
  - *Acceptance*: Scan loop runs via requestAnimationFrame at 30fps

- [ ] **QR Detection** scans canvas for valid QR codes using jsQR library
  - *Acceptance*: Detects standard ISO/IEC 18004 QR codes containing ticket IDs
  - *Acceptance*: Handles rotated/distorted QR codes within ±45° angle
  - *Acceptance*: Detection runs on every frame; CPU usage <30%

- [ ] **Ticket Validation API** integrates with backend to verify scanned tickets
  - *Acceptance*: Calls `/api/validate-scan` with ticket ID and event context
  - *Acceptance*: Returns ticket status (valid/invalid) and reason within 500ms
  - *Acceptance*: Handles network errors gracefully with offline fallback

- [ ] **Duplicate Prevention** tracks scanned tickets in session to block re-scanning
  - *Acceptance*: Stores scanned ticket IDs in Set; rejects duplicate scans immediately
  - *Acceptance*: Shows warning message when duplicate detected (yellow status)
  - *Acceptance*: Persists across browser refresh via sessionStorage

#### Visual & Haptic Feedback
- [ ] **Color-Coded Status Display** shows scan result with immediate visual confirmation
  - *Acceptance*: Green = valid ticket accepted; Yellow = warning (e.g., duplicate); Red = invalid/rejected
  - *Acceptance*: Status displays for 3 seconds then clears
  - *Acceptance*: Accessible color contrast ratio ≥4.5:1

- [ ] **Haptic Feedback** provides tactile confirmation for valid scans
  - *Acceptance*: Vibration patterns differ for valid (short) vs. invalid (long) scans
  - *Acceptance*: Gracefully degrades on devices without Vibration API

- [ ] **Audio Feedback** provides sound confirmation in noisy environments
  - *Acceptance*: Success tone for valid scans; error tone for invalid
  - *Acceptance*: Respectful volume levels (<70dB); mutable by user

#### Scan History & Monitoring
- [ ] **Scan History Panel** displays last 50 scans with timestamp and status
  - *Acceptance*: Real-time list updates immediately after each scan
  - *Acceptance*: Shows attendee name and ticket status for each scan
  - *Acceptance*: Real-time counts: Total scans, Valid, Invalid, Duplicates

- [ ] **Session Statistics** displays high-level metrics during event
  - *Acceptance*: Scan rate (scans/min); Success rate (valid/total); Duplicate rate
  - *Acceptance*: Updates in real-time as scans are processed

#### Fallback & Error Handling
- [ ] **Manual Lookup Form** enables fallback search when QR fails
  - *Acceptance*: Search by attendee name, email, or ticket ID
  - *Acceptance*: Calls `/api/manual-lookup` endpoint; returns matching tickets
  - *Acceptance*: UI clearly labels as "Fallback" to distinguish from QR scanning

- [ ] **Error Recovery** handles network/camera failures gracefully
  - *Acceptance*: Camera permission denial shows friendly message with troubleshooting steps
  - *Acceptance*: Network timeout falls back to manual lookup after 2 seconds
  - *Acceptance*: Stale data warning when offline >5 minutes

#### Responsive Design
- [ ] **Mobile-First Layout** optimized for portrait and landscape orientation
  - *Acceptance*: Camera feed scales to fill screen; controls below or side-by-side
  - *Acceptance*: Touch targets ≥48px for easy tapping
  - *Acceptance*: Tested on iPhone 12+ and Samsung Galaxy A series

- [ ] **Dark Mode Support** for event environment usability
  - *Acceptance*: All text, buttons, status boxes adapt to dark mode
  - *Acceptance*: Camera feed area maintains high contrast
  - *Acceptance*: Uses Tailwind CSS dark mode utilities

---

### P1: Nice-to-Have (Phase 2 / Beyond Sprint)

- [ ] **Scan Performance Analytics** – detailed metrics dashboard for event teams
- [ ] **Custom Branding** – venue logos/theming in scanner interface
- [ ] **Multi-Venue Support** – switch between events/venues in same session
- [ ] **Batch Scan Mode** – rapid-fire scanning with minimal UI between scans
- [ ] **Accessibility Improvements** – screen reader support; WCAG AA compliance
- [ ] **Offline Mode** – full scan capability when network unavailable (sync on reconnect)

---

### P2: Future Considerations (Post-MVP)

- [ ] **Desktop/Tablet Support** – optimize for larger screens and USB camera support
- [ ] **Barcode Scanning** – 1D barcode support for legacy tickets
- [ ] **Ticket Printing** – on-demand reprint of tickets for lost/damaged cases
- [ ] **Admin Dashboard** – venue-level reporting and event analytics
- [ ] **Webhook Integration** – real-time push notifications to backend systems

---

## Success Metrics

### Leading Indicators (Track During Sprint)
- **Component Test Coverage**: ≥80% unit test coverage for QR detection and validation logic
- **Performance Budget**: Camera loop CPU usage <30%, validation API latency p95 <500ms
- **Error Recovery Rate**: Network timeouts fall back to manual lookup within 2s, 100% of time
- **Accessibility**: WCAG AA contrast ratios on all UI elements; keyboard navigation works

### Lagging Indicators (Measure Post-Launch)
- **Scan Success Rate**: Valid ticket acceptance ≥99% (track false rejections)
- **Duplicate Prevention**: <0.1% duplicate scans in production
- **Check-In Speed**: Average scan-to-result time ≤2 seconds (vs. 10-15s manual entry)
- **User Satisfaction**: Operator feedback score ≥4.5/5 on usability
- **Adoption**: Scanner used for ≥50% of check-ins at first deployed venue within 2 weeks

---

## Acceptance Criteria by Component

### QRScanner.tsx (Core Scanning Engine)
✅ Camera initializes on mount and requests permission  
✅ requestAnimationFrame loop runs continuously at ~30fps  
✅ jsQR library detects QR codes within 100-200ms per frame  
✅ Scanned ticket ID extracted and passed to validation  
✅ Duplicate check blocks re-scanning same ticket  
✅ Haptic/audio feedback triggers immediately on scan  
✅ Component unmounts cleanly; camera stream stops  

### ScanResult.tsx (Visual Feedback)
✅ Displays color-coded status box (green/yellow/red)  
✅ Shows ticket status text: "Accepted", "Duplicate", "Invalid"  
✅ Auto-clears after 3 seconds or on next scan  
✅ Includes icon indicators (checkmark/warning/X)  
✅ Accessible contrast ratios ≥4.5:1  

### ScanHistory.tsx (Monitoring Panel)
✅ Displays list of last 50 scans in real-time  
✅ Shows attendee name, timestamp, and status for each scan  
✅ Updates statistics counters immediately after each scan  
✅ Responsive layout on mobile (stacks vertically)  

### ManualLookup.tsx (Fallback)
✅ Search form accepts name, email, or ticket ID input  
✅ Calls backend API and displays matching tickets  
✅ Clearly labeled as fallback option  
✅ Graceful handling of no-results state  

### API Routes
✅ `/api/validate-scan` returns validation result within 500ms  
✅ `/api/manual-lookup` returns matching tickets or empty set  
✅ Both routes handle errors and return appropriate status codes  

### Utils & Helpers
✅ Vibration patterns work on iOS/Android  
✅ Audio feedback plays consistently across browsers  
✅ Browser capability checks prevent errors on unsupported devices  

---

## Dependencies & Risks

### External Dependencies
- **jsQR Library**: Confirmed stable; ensure v1.4+ for performance
- **Backend API**: `/api/validate-scan` and `/api/manual-lookup` endpoints must be ready
- **Camera Hardware**: Requires device with forward-facing camera
- **Browser Support**: Works on Safari (iOS 14+), Chrome (Android 8+)

### Technical Risks
- **Mobile Safari Camera Limitations**: Safari on iOS has stricter camera permissions; may require custom UX
- **Network Latency**: If backend is slow (>1s), UX suffers; needs clear timeout handling
- **Battery Drain**: Continuous camera + frame processing can drain battery; consider 60s idle shutdown
- **Duplicate Prevention Scope**: SessionStorage clears on tab close; acceptable for single-shift events

### Mitigation Strategies
- [ ] Test on at least 2 iOS and 2 Android devices before launch
- [ ] Implement 2-second timeout for validation API; fall back to manual lookup
- [ ] Add idle detection; automatically close camera after 2 minutes of inactivity
- [ ] Document that operators should refresh page between events (or implement logout)

---

## Open Questions

| Question | Owner | Priority |
|----------|-------|----------|
| What is the exact API response format from `/api/validate-scan`? | Backend Team | P0 |
| Should duplicate scans be rejected silently or show a warning? | Product/UX | P0 |
| Do we need to support QR codes with custom data formats (beyond ticket IDs)? | Product | P1 |
| What is the acceptable latency for validation API? Target <500ms? | DevOps | P0 |
| Should we log all scan events for compliance/auditing? | Legal/Compliance | P1 |
| Do we need multi-language support for error messages? | Product | P2 |

---

## Sprint Timeline & Milestones

### Week of June 1-7, 2026 | 1 Engineer

| Day | Milestone | Deliverable |
|-----|-----------|-------------|
| **Mon 6/1** | Setup & Integration | Environment ready; backend API contract finalized; component scaffolding complete |
| **Tue-Wed 6/2-3** | Core Scanning Engine | QRScanner.tsx complete with camera, jsQR detection, duplicate prevention |
| **Wed-Thu 6/3-4** | Validation & Feedback | ScanResult.tsx + API integration; haptic/audio feedback working |
| **Fri 6/5** | History & Fallback | ScanHistory.tsx + ManualLookup.tsx complete; all P0 requirements met |
| **Fri 6/5 PM** | Testing & Polish | Unit tests for critical paths; responsive design tested on devices; bug fixes |
| **Mon 6/8** | Demo Ready | MVP ready for internal demo and QA |

**End-of-Sprint Deliverable**: Fully functional QR scanner MVP running on mobile devices with all P0 features complete.

---

## Definition of Done

✅ All P0 requirements implemented and tested  
✅ Unit tests written for QR detection, validation, duplicate prevention  
✅ Responsive design verified on iPhone 12+ and Galaxy A series  
✅ Dark mode tested and working  
✅ Camera permission flow validated on both iOS and Android  
✅ Network error handling tested with manual timeout scenarios  
✅ Code review completed; no critical linting issues  
✅ Ready for QA and internal demo  
✅ README and QUICK_START guide updated for operators  

---

## Notes for Implementation

### Day-to-Day Priorities
1. **Get camera working first** – this is the critical path
2. **Integrate validation API early** – don't wait until the end
3. **Test on real devices daily** – browser dev tools don't replicate mobile behavior
4. **Keep scope tight** – only P0 this week; P1 features wait for next sprint

### Recommended Dev Environment
- Local Next.js dev server with mobile device testing via USB or ngrok
- Mock API responses if backend endpoints aren't ready
- Real device testing daily (even if just a personal phone)

### Communication Cadence
- Daily standup to track progress against milestones
- EOD updates on blockers or API contract changes
- QA sign-off before Friday close

