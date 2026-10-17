# main integration — 2026-10-16

Merged remote `524373f` (four commits since `814ed55`) with local Fuji scene work `731decc`.

- Resolved source conflicts in initialization, group scene, companion placement, discovery and social UI. Rebuilt dist from combined source.
- Kept Fuji scene lifecycle, railway/petals, scene-specific layout and retained social state. Ported remote lazy forest building loads, scoped obstacle caches, static transform freezing, background RAF pause and capture-only framebuffer retention.
- Retained remote live group boards and forest group camera; attached boards to the scene-switchable group root. Fuji retains compact labels and its existing no-camera-move building entrance.
- Kept remote avatar/desktop/data changes. API credentials remain in ignored local configuration.
- Named final media are retained; temporary `.capture-recordings` fragments are ignored.

Passed: npm test; test-group-chat; test-placement-cache; test-static-transforms; test-build-cache; test-static-files; test-showa-browser (nine groups/nine friends, five switches, mobile simulation, draft/unread/attachment retention); test-performance-browser (lazy model success/failure, hidden-page pause, capture output). Build succeeded.

Evidence: browser.json, performance-browser.json, screenshots and capture clip in this directory. Desktop Edge plus mobile viewport simulation; no physical-device claim. Build/merge checks do not revalidate paid asset generation.
