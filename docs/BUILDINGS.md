# Desktop module buildings

The Creative Workshop provides manual placement for Notes, Focus, Accounts and Videos. Notes and Focus each have three preset Rodin models for Forest, Fuji Sakura Town and Ideal City. Accounts and Videos reuse their existing themed discovery boards, preview surfaces and content transitions.

## Placement and relocation

Installing or enabling a module does not automatically place a new building. Open the module's workshop detail and choose Place Building. If the current scene already contains its building, the action becomes Move Building and reuses the saved identity.

Placement begins with free camera rotation, panning and zoom. Pick Up disables rotation and panning while preserving wheel zoom. The ghost follows the pointer and validates ground support, footprint height variation, terrain barriers and other module buildings. Invalid ground remains dark red and clicking it does not release the ghost. Clicking valid ground locks the preview; Confirm persists it. Escape while holding returns to camera adjustment, restores an existing building to its original location and hides a new unsaved preview. Cancel leaves placement without saving.

Positions are stored separately from module content under `state.buildings[module][theme]` in the workshop IndexedDB database. Each theme has independent locations. Disabling hides buildings; enabling restores saved positions. Uninstalling removes the module's saved locations across all themes. Reinstalling requires manual placement again.

## Camera and content

Normal clicks on Notes and Focus buildings approach the building smoothly and open the module. The camera stays focused while its UI is open and returns when it closes. Relocation is available only through the workshop.

Placed Accounts and Videos boards retain the original surface framing, article/video previews and content transitions. Their visible models and collision bounds follow the saved placement. Escape uses the shared UI exit path and releases the board focus. Immediate restoration resets camera and controls synchronously; entering a board releases conflicting building, mailbox and record-player camera ownership first.

## Collision and assets

Committed buildings have scene-local axis-aligned collision bounds independent of render meshes. Companion spawn/placement checks and walking steps consult these bounds, including body-radius clearance and swept movement checks. Moving a building updates its bounds and refreshes companion paths; removal deletes its collider. Manually placed discovery boards are excluded from the old static obstacle snapshots to avoid blocking their former locations.

The six Notes/Focus assets include a GLB, independent image-generation reference and Rodin manifest. Runtime loading normalizes model sizes. Generation uses the project's private image configuration and Rodin REST client; local credentials and intermediate generation state are not release content.

## Scope and verification

New building controls are gated off in Android; this change does not modify mobile or Android source files. Shared web bundles are rebuilt for desktop use.

Verification includes desktop builds, core store/feed/discovery/pet tests, collision boundary/swept-step tests, browser placement and scene-restoration checks, and `tests/test-board-exit.mjs`, which exercises placed board entry clicks, Escape return, camera dragging and wheel zoom.
