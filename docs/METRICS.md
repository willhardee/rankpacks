# Metrics

## Definitions
- **Activation:** user joins a pack and submits a ranking within 24h.
- **Core loop:** create pack → invite → submissions → reveal → share → repeat.
- **Retention:** user returns within 7 days to create or submit a ranking.

## Events
Server-side events table logs:
- auth_signed_in
- onboarding_completed
- pack_created
- pack_opened
- pack_joined
- ranking_saved
- ranking_submitted
- pack_locked
- pack_revealed
- comment_posted
- reaction_added
- report_submitted
- buy_link_clicked
- invite_email_sent
- share_link_copied
- pwa_install_cta_clicked
