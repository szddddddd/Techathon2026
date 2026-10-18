# Scene mailbox and Universal Inbox

The integration with upstream commit 39cd5f5 retains the local Rodin mailbox models, scene placement, picking, camera transition and responsive outer panel geometry. The internal interface, contacts, platform icons, message lists, details, demo setup, permissions, manual import and persistence use the upstream Universal Inbox implementation.

`src/mailbox-inbox.js` is now only a scene-framing bridge. It calls the existing `socialUI.loadInbox()` and opens the shared directory. There is one inbox and one message store, rather than a second set of demo messages or adapters. The obsolete local `registerAdapter` interface has been replaced by upstream connectors; see [Universal Inbox](UNIVERSAL-INBOX.md).

The mailbox entry places the object on the left and the existing Universal Inbox panel on the right. Narrow screens use the local bottom-sheet layout. Closing the inbox restores the previous camera pose. Child inbox panels retain the scene framing. Normal dock navigation keeps its existing appearance. `mailbox-inbox.css` applies only while `body.mailbox-scene-open` is present.

No real platform account is connected by this integration. Upstream demo and explicit manual-import behavior are retained.
