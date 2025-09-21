# System Configuration for BellAudioPWA

## Agent Coordination Rules
- All PWA-related decisions must be validated by PWAConverter agent
- Audio optimization changes require WebAudioOptimizer approval
- UI modifications need MobileUIAdapter sign-off
- Background audio features must pass BackgroundAudioManager review
- Performance changes require PerformanceOptimizer analysis
- All features must pass QualityAssurance validation

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript ES2020+
- **Audio Engine**: Web Audio API, AudioWorklet
- **PWA Features**: Service Worker, Web App Manifest
- **Mobile APIs**: Media Session API, Wake Lock API
- **Build Tools**: Webpack/Vite for PWA optimization
- **Testing**: Jest, Web Test Runner, Lighthouse CI

## Development Standards
- Mobile-first responsive design
- Progressive enhancement for PWA features
- Accessibility compliance (WCAG 2.1 AA)
- Performance budget: < 3s initial load on 3G
- Audio latency target: < 50ms on mobile devices

## Quality Gates
- PWA Lighthouse score: 90+ across all categories
- Audio performance: stable playback at 44.1kHz/16-bit
- Mobile compatibility: iOS Safari 14+, Chrome Mobile 90+
- Background audio: functional across all supported platforms
- Offline functionality: core features available without network

## Security Requirements
- Content Security Policy implementation
- Secure audio file handling and validation
- Service Worker security best practices
- Cross-origin resource handling for audio assets