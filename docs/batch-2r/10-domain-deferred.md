# Batch 2R Prompt 10: custom domain deferred

Date: 2026-07-15
Status: deferred to Batch 5.

The intended production domain is `https://nusacanvas.space`. It is not a staging alias and is not activated by this prompt.

## Explicitly out of scope

- Adding the domain or a route in Cloudflare.
- Creating, changing, or deleting DNS records.
- Redirecting workers.dev traffic.
- Adding a canonical URL that points to the domain.
- Removing `noindex` from staging or allowing staging to be indexed.
- Submitting a sitemap or connecting a search-console property.
- Creating analytics, advertising, or tracking configuration.

## Batch 5 activation gate

The domain may be considered only after a separate owner-approved production readiness review confirms domain ownership, DNS records, production security headers, indexability policy, canonical/sitemap policy, consent and privacy requirements, rollback, and post-launch monitoring. Until then, `workers.dev` staging remains noindex and the domain remains untouched.
