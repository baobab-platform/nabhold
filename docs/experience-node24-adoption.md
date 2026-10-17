# Nabhold Node.js 24 baseline

Under the accepted ADR-SHARED-040 and baobab-dev, the Nabhold frontend builds and runs on Node.js 24. The package engine is >=24.19.0 <25, CI and production Docker build are pinned to 24.21.0, and the devcontainer already uses the baobab-dev Node 24 image. The frontend does not own PostgreSQL; database-backed engines follow PostgreSQL 17 independently.

This is a runtime alignment increment, not complete adoption of published Shared UI packages and not an identity, onboarding or market-activation receipt. Validate locked install, TS, all unit tests, Redis TLS fixture, Next build and Playwright before merge. The production Docker image is a version-pinned upstream Node image, not yet digest-pinned; deployment asset hardening remains an independent infrastructure acceptance requirement.
