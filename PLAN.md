# 林间来信 · implementation acceptance

Build on the existing 0.7-width river and bridge. Preserve scenery; introduce social UI only.

- Four Rodin animals (reference-led Meituan kangaroo, fox, rabbit, bear), recorded jobs and local GLBs.
- IndexedDB friends/messages/drafts/status/posts/media, idempotent friendship, storage errors surfaced.
- Empty initial world; add/search friends; character highlights, anchored bubbles/status, camera focus/restore, safe slots.
- Chat text/Emoji/stickers/image, unread/history, IME handling, draft/scroll preservation.
- 24h statuses, photo/text details, own publishing/clearing.
- Memory orbs, full posts/photos/likes/comments, share into chat, own publishing/profile.
- Scripted greetings/replies/periodic updates, pause/replay, background pause, explicit local-demo labeling.
- Desktop dual panels + mobile tabs, reduced motion, input/camera separation.
- Validate persistence, duplicates, event identity, expiry, image limits, real asset placement, browser errors, eight-character stress and FPS. Save screenshots and acceptance report with any limitations.

Work streams: social-store (data agent), social-characters (scene agent), Rodin assets (asset agent), social UI/integration/browser QA (root).
