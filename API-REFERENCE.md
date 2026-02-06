# @clipdeck/api-client API Reference

A fully typed TypeScript client library for the Clipdeck API. Provides service clients for campaigns, clips, users, notifications, balance, studios, and disputes.

---

## Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Authentication](#authentication)
- [Configuration](#configuration)
  - [ClientConfig](#clientconfig)
- [Error Handling](#error-handling)
  - [ApiError](#apierror)
  - [Error Codes](#error-codes)
  - [Error Handling Pattern](#error-handling-pattern)
- [Services](#services)
  - [Campaigns](#campaigns)
    - [campaigns.list()](#campaignslistfilters)
    - [campaigns.getById()](#campaignsgetbyidid)
    - [campaigns.create()](#campaignscreatedata)
    - [campaigns.update()](#campaignsupdateid-data)
    - [campaigns.join()](#campaignsjoinid)
    - [campaigns.leave()](#campaignsleaveid)
    - [campaigns.getParticipants()](#campaignsgetparticipantsid)
    - [campaigns.updateStatus()](#campaignsupdatestatusid-status)
  - [Clips](#clips)
    - [clips.list()](#clipslistfilters)
    - [clips.getById()](#clipsgetbyidid)
    - [clips.submit()](#clipssubmitdata)
    - [clips.updateStatus()](#clipsupdatestatusid-status-reason)
    - [clips.getStats()](#clipsgetstatsid)
    - [clips.getStatsHistory()](#clipsgetstatshistoryid)
  - [Users](#users)
    - [users.getMe()](#usersgetme)
    - [users.updateMe()](#usersupdatemedata)
    - [users.getProfile()](#usersgetprofile)
    - [users.updateProfile()](#usersupdateprofiledata)
    - [users.getById()](#usersgetbyidid)
    - [users.getByUsername()](#usersgetbyusernameusername)
    - [users.search()](#userssearchquery-limit)
    - [users.getReferralStats()](#usersgetreferralstats)
    - [users.generateReferralCode()](#usersgeneratereferralcode)
    - [users.applyReferral()](#usersapplyreferralcode)
  - [Notifications](#notifications)
    - [notifications.list()](#notificationslistparams)
    - [notifications.getUnreadCount()](#notificationsgetunreadcount)
    - [notifications.markAsRead()](#notificationsmarkasreadid)
    - [notifications.markAllAsRead()](#notificationsmarkallasread)
    - [notifications.remove()](#notificationsremoveid)
  - [Balance](#balance)
    - [balance.getBalance()](#balancegetbalance)
    - [balance.getTransactions()](#balancegettransactionsparams)
    - [balance.requestPayout()](#balancerequestpayoutdata)
  - [Studios](#studios)
    - [studios.list()](#studioslistfilters)
    - [studios.getBySlug()](#studiosgetbyslugslug)
    - [studios.create()](#studioscreatedata)
    - [studios.update()](#studiosupdateslug-data)
    - [studios.remove()](#studiosremoveslug)
    - [studios.getMembers()](#studiosgetmembersslug)
    - [studios.join()](#studiosjoinslug)
    - [studios.leave()](#studiosleaveslug)
    - [studios.rate()](#studiosrateslug-rating-review)
    - [studios.getInvites()](#studiosgetinvites)
  - [Disputes](#disputes)
    - [disputes.list()](#disputeslistfilters)
    - [disputes.getById()](#disputesgetbyidid)
    - [disputes.create()](#disputescreatedata)
    - [disputes.getMine()](#disputesgetmine)
    - [disputes.resolve()](#disputesresolveid-action-notes)
- [Types](#types)
  - [PaginatedResponse\<T\>](#paginatedresponset)
  - [CampaignListFilters](#campaignlistfilters)
  - [CreateCampaignData](#createcampaigndata)
  - [UpdateCampaignData](#updatecampaigndata)
  - [ClipListFilters](#cliplistfilters)
  - [SubmitClipData](#submitclipdata)
  - [UpdateUserData](#updateuserdata)
  - [UpdateProfileData](#updateprofiledata)
  - [NotificationListParams](#notificationlistparams)
  - [TransactionListParams](#transactionlistparams)
  - [RequestPayoutData](#requestpayoutdata)
  - [StudioListFilters](#studiolistfilters)
  - [CreateStudioData](#createstudiodata)
  - [UpdateStudioData](#updatestudiodata)
  - [DisputeListFilters](#disputelistfilters)
  - [CreateDisputeData](#createdisputedata)

---

## Getting Started

### Installation

```bash
npm install @clipdeck/api-client
```

### Quick Start

```typescript
import { ClipdeckClient } from '@clipdeck/api-client';

const client = new ClipdeckClient({
  baseURL: 'https://api.clipdeck.io',
  getToken: async () => localStorage.getItem('auth_token'),
});

// List active campaigns
const { data: campaigns } = await client.campaigns.list({ status: 'active' });

// Get current user
const me = await client.users.getMe();

// Check notifications
const { count } = await client.notifications.getUnreadCount();
```

### Authentication

The client supports Bearer token authentication via the `getToken` callback. This function is called before every request, allowing you to dynamically provide tokens from any auth system.

```typescript
// Example with NextAuth.js
import { getSession } from 'next-auth/react';

const client = new ClipdeckClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL!,
  getToken: async () => {
    const session = await getSession();
    return session?.accessToken ?? null;
  },
});
```

```typescript
// Example with a simple token store
let authToken: string | null = null;

const client = new ClipdeckClient({
  baseURL: 'https://api.clipdeck.io',
  getToken: async () => authToken,
});

// Set the token after login
function onLogin(token: string) {
  authToken = token;
}
```

---

## Configuration

### ClientConfig

The configuration object passed to `ClipdeckClient` (or any individual service client).

| Property   | Type                                | Required | Default | Description                                                                                              |
| ---------- | ----------------------------------- | -------- | ------- | -------------------------------------------------------------------------------------------------------- |
| `baseURL`  | `string`                            | Yes      | --      | The base URL of the Clipdeck API (e.g., `'https://api.clipdeck.io'`).                                    |
| `getToken` | `() => Promise<string \| null>`     | No       | --      | Async function returning the current auth token. When provided, it is injected as a `Bearer` token.      |
| `timeout`  | `number`                            | No       | `10000` | Request timeout in milliseconds. Requests exceeding this duration will throw a network-level `ApiError`. |

```typescript
import { ClipdeckClient, ClientConfig } from '@clipdeck/api-client';

const config: ClientConfig = {
  baseURL: 'https://api.clipdeck.io',
  getToken: async () => localStorage.getItem('auth_token'),
  timeout: 15000,
};

const client = new ClipdeckClient(config);
```

---

## Error Handling

### ApiError

All errors thrown by the client are instances of `ApiError`, providing a consistent structure for error handling.

| Property  | Type      | Description                                                                                  |
| --------- | --------- | -------------------------------------------------------------------------------------------- |
| `code`    | `string`  | A machine-readable error code (e.g., `'NOT_FOUND'`, `'VALIDATION_ERROR'`).                   |
| `message` | `string`  | A human-readable error description.                                                          |
| `status`  | `number`  | The HTTP status code. `0` indicates a network or client-side error.                          |
| `details` | `unknown` | Optional additional data, such as field-level validation errors.                             |
| `name`    | `string`  | Always `'ApiError'`.                                                                         |

### Error Codes

| Code               | HTTP Status | Description                                    |
| ------------------ | ----------- | ---------------------------------------------- |
| `VALIDATION_ERROR` | 400         | Request body or parameters failed validation.  |
| `UNAUTHORIZED`     | 401         | Missing or invalid authentication token.       |
| `FORBIDDEN`        | 403         | Authenticated user lacks required permissions. |
| `NOT_FOUND`        | 404         | Requested resource does not exist.             |
| `CONFLICT`         | 409         | Resource conflict (e.g., duplicate entry).     |
| `NETWORK_ERROR`    | 0           | Unable to reach the server.                    |
| `CLIENT_ERROR`     | 0           | Client-side error before the request was sent. |
| `UNKNOWN_ERROR`    | varies      | An unrecognized or unexpected error.           |

### Error Handling Pattern

```typescript
import { ClipdeckClient, ApiError } from '@clipdeck/api-client';

const client = new ClipdeckClient({
  baseURL: 'https://api.clipdeck.io',
  getToken: async () => myToken,
});

try {
  const campaign = await client.campaigns.getById('non-existent-id');
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case 'NOT_FOUND':
        console.error('Campaign not found');
        break;
      case 'UNAUTHORIZED':
        console.error('Please log in again');
        // redirect to login
        break;
      case 'NETWORK_ERROR':
        console.error('Unable to reach server. Check your connection.');
        break;
      default:
        console.error(`[${error.code}] ${error.message} (HTTP ${error.status})`);
    }

    // Access validation details if available
    if (error.details) {
      console.error('Details:', error.details);
    }
  }
}
```

---

## Services

### Campaigns

Service client for campaign management operations. Access via `client.campaigns`.

---

#### `campaigns.list(filters?)`

Lists campaigns with optional filtering and pagination.

**HTTP Route:** `GET /campaigns`

**Parameters:**

| Name      | Type                   | Required | Description                              |
| --------- | ---------------------- | -------- | ---------------------------------------- |
| `filters` | `CampaignListFilters`  | No       | Filter and pagination options.           |

`CampaignListFilters` fields:

| Name     | Type     | Required | Description                                                         |
| -------- | -------- | -------- | ------------------------------------------------------------------- |
| `status` | `string` | No       | Filter by status (`'draft'`, `'active'`, `'paused'`, `'completed'`).|
| `page`   | `number` | No       | Page number (1-indexed).                                            |
| `limit`  | `number` | No       | Items per page.                                                     |

**Returns:** `Promise<PaginatedResponse<Record<string, unknown>>>`

**Throws:** `ApiError`

```typescript
const result = await client.campaigns.list({ status: 'active', page: 1, limit: 10 });
console.log(result.data);       // Campaign objects
console.log(result.totalPages); // Total pages available
```

---

#### `campaigns.getById(id)`

Retrieves a single campaign by its unique identifier.

**HTTP Route:** `GET /campaigns/:id`

**Parameters:**

| Name | Type     | Required | Description           |
| ---- | -------- | -------- | --------------------- |
| `id` | `string` | Yes      | The unique campaign ID. |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404) if the campaign does not exist.

```typescript
const campaign = await client.campaigns.getById('camp_abc123');
console.log(campaign.title);
```

---

#### `campaigns.create(data)`

Creates a new campaign.

**HTTP Route:** `POST /campaigns`

**Parameters:**

| Name   | Type                 | Required | Description                      |
| ------ | -------------------- | -------- | -------------------------------- |
| `data` | `CreateCampaignData` | Yes      | Campaign creation payload.       |

See [CreateCampaignData](#createcampaigndata) for field details.

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `VALIDATION_ERROR` (400) or `UNAUTHORIZED` (401).

```typescript
const campaign = await client.campaigns.create({
  title: 'Epic Moments',
  description: 'Share your most epic gaming moments',
  budget: 1000,
  maxParticipants: 50,
  tags: ['gaming', 'highlights'],
});
```

---

#### `campaigns.update(id, data)`

Updates an existing campaign with partial data.

**HTTP Route:** `PATCH /campaigns/:id`

**Parameters:**

| Name   | Type                 | Required | Description                        |
| ------ | -------------------- | -------- | ---------------------------------- |
| `id`   | `string`             | Yes      | The unique campaign ID.            |
| `data` | `UpdateCampaignData` | Yes      | Fields to update.                  |

See [UpdateCampaignData](#updatecampaigndata) for field details.

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404), `VALIDATION_ERROR` (400), or `FORBIDDEN` (403).

```typescript
const updated = await client.campaigns.update('camp_abc123', {
  title: 'Updated Campaign Title',
  budget: 2000,
});
```

---

#### `campaigns.join(id)`

Joins a campaign as an editor/participant.

**HTTP Route:** `POST /campaigns/:id/join`

**Parameters:**

| Name | Type     | Required | Description              |
| ---- | -------- | -------- | ------------------------ |
| `id` | `string` | Yes      | The campaign ID to join. |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404) or `CONFLICT` (409) if already joined or campaign is full.

```typescript
const participation = await client.campaigns.join('camp_abc123');
```

---

#### `campaigns.leave(id)`

Leaves a campaign that the authenticated user has previously joined.

**HTTP Route:** `POST /campaigns/:id/leave`

**Parameters:**

| Name | Type     | Required | Description               |
| ---- | -------- | -------- | ------------------------- |
| `id` | `string` | Yes      | The campaign ID to leave. |

**Returns:** `Promise<void>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404) or `VALIDATION_ERROR` (400) if not a participant.

```typescript
await client.campaigns.leave('camp_abc123');
```

---

#### `campaigns.getParticipants(id)`

Retrieves the list of participants for a given campaign.

**HTTP Route:** `GET /campaigns/:id/participants`

**Parameters:**

| Name | Type     | Required | Description           |
| ---- | -------- | -------- | --------------------- |
| `id` | `string` | Yes      | The unique campaign ID. |

**Returns:** `Promise<Record<string, unknown>[]>`

**Throws:** `ApiError`

```typescript
const participants = await client.campaigns.getParticipants('camp_abc123');
participants.forEach(p => console.log(p.username));
```

---

#### `campaigns.updateStatus(id, status)`

Updates the status of a campaign (e.g., draft -> active -> paused -> completed).

**HTTP Route:** `PATCH /campaigns/:id/status`

**Parameters:**

| Name     | Type     | Required | Description                                                        |
| -------- | -------- | -------- | ------------------------------------------------------------------ |
| `id`     | `string` | Yes      | The unique campaign ID.                                            |
| `status` | `string` | Yes      | New status: `'draft'`, `'active'`, `'paused'`, or `'completed'`.   |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404), `VALIDATION_ERROR` (400) for invalid transitions, or `FORBIDDEN` (403).

```typescript
const campaign = await client.campaigns.updateStatus('camp_abc123', 'active');
console.log(campaign.status); // 'active'
```

---

### Clips

Service client for clip submission, review, and statistics. Access via `client.clips`.

---

#### `clips.list(filters?)`

Lists clips with optional filtering and pagination.

**HTTP Route:** `GET /clips`

**Parameters:**

| Name      | Type              | Required | Description                     |
| --------- | ----------------- | -------- | ------------------------------- |
| `filters` | `ClipListFilters` | No       | Filter and pagination options.  |

`ClipListFilters` fields:

| Name         | Type     | Required | Description                                                    |
| ------------ | -------- | -------- | -------------------------------------------------------------- |
| `campaignId` | `string` | No       | Filter by campaign ID.                                         |
| `editorId`   | `string` | No       | Filter by editor/submitter ID.                                 |
| `status`     | `string` | No       | Filter by status (`'pending'`, `'approved'`, `'rejected'`).    |
| `page`       | `number` | No       | Page number (1-indexed).                                       |
| `limit`      | `number` | No       | Items per page.                                                |

**Returns:** `Promise<PaginatedResponse<Record<string, unknown>>>`

**Throws:** `ApiError`

```typescript
const result = await client.clips.list({
  campaignId: 'camp_abc123',
  status: 'approved',
  page: 1,
  limit: 25,
});
```

---

#### `clips.getById(id)`

Retrieves a single clip by its unique identifier.

**HTTP Route:** `GET /clips/:id`

**Parameters:**

| Name | Type     | Required | Description        |
| ---- | -------- | -------- | ------------------ |
| `id` | `string` | Yes      | The unique clip ID. |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404).

```typescript
const clip = await client.clips.getById('clip_xyz789');
console.log(clip.title, clip.status);
```

---

#### `clips.submit(data)`

Submits a new clip to a campaign. The clip starts with `'pending'` status.

**HTTP Route:** `POST /clips`

**Parameters:**

| Name   | Type             | Required | Description                  |
| ------ | ---------------- | -------- | ---------------------------- |
| `data` | `SubmitClipData` | Yes      | Clip submission payload.     |

See [SubmitClipData](#submitclipdata) for field details.

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `VALIDATION_ERROR` (400) or `FORBIDDEN` (403) if not a campaign participant.

```typescript
const clip = await client.clips.submit({
  campaignId: 'camp_abc123',
  title: 'Incredible Clutch',
  description: 'A 1v5 clutch in the final round',
  videoUrl: 'https://cdn.example.com/clips/clutch.mp4',
  duration: 30,
  platform: 'twitch',
});
```

---

#### `clips.updateStatus(id, status, reason?)`

Reviews a clip by updating its status (approve or reject).

**HTTP Route:** `PATCH /clips/:id/status`

**Parameters:**

| Name     | Type     | Required | Description                                                  |
| -------- | -------- | -------- | ------------------------------------------------------------ |
| `id`     | `string` | Yes      | The unique clip ID.                                          |
| `status` | `string` | Yes      | New status: `'approved'` or `'rejected'`.                    |
| `reason` | `string` | No       | Reason for the status change (recommended when rejecting).   |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404), `VALIDATION_ERROR` (400), or `FORBIDDEN` (403).

```typescript
// Approve
await client.clips.updateStatus('clip_xyz789', 'approved');

// Reject with reason
await client.clips.updateStatus('clip_xyz789', 'rejected', 'Does not meet quality standards');
```

---

#### `clips.getStats(id)`

Retrieves current performance statistics for a clip (views, engagement, etc.).

**HTTP Route:** `GET /clips/:id/stats`

**Parameters:**

| Name | Type     | Required | Description        |
| ---- | -------- | -------- | ------------------ |
| `id` | `string` | Yes      | The unique clip ID. |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404).

```typescript
const stats = await client.clips.getStats('clip_xyz789');
console.log(stats.views, stats.engagement);
```

---

#### `clips.getStatsHistory(id)`

Retrieves historical performance statistics snapshots for a clip over time.

**HTTP Route:** `GET /clips/:id/stats/history`

**Parameters:**

| Name | Type     | Required | Description        |
| ---- | -------- | -------- | ------------------ |
| `id` | `string` | Yes      | The unique clip ID. |

**Returns:** `Promise<Record<string, unknown>[]>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404).

```typescript
const history = await client.clips.getStatsHistory('clip_xyz789');
history.forEach(snapshot => {
  console.log(snapshot.date, snapshot.views);
});
```

---

### Users

Service client for user account, profile, and referral operations. Access via `client.users`.

---

#### `users.getMe()`

Retrieves the authenticated user's account information.

**HTTP Route:** `GET /users/me`

**Parameters:** None

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `UNAUTHORIZED` (401).

```typescript
const me = await client.users.getMe();
console.log(me.email, me.displayName);
```

---

#### `users.updateMe(data)`

Updates the authenticated user's account details.

**HTTP Route:** `PATCH /users/me`

**Parameters:**

| Name   | Type             | Required | Description               |
| ------ | ---------------- | -------- | ------------------------- |
| `data` | `UpdateUserData` | Yes      | Fields to update.         |

See [UpdateUserData](#updateuserdata) for field details.

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `VALIDATION_ERROR` (400) or `UNAUTHORIZED` (401).

```typescript
const updated = await client.users.updateMe({
  displayName: 'NewDisplayName',
  avatarUrl: 'https://cdn.example.com/new-avatar.png',
});
```

---

#### `users.getProfile()`

Retrieves the authenticated user's extended profile (bio, social links, skills).

**HTTP Route:** `GET /users/me/profile`

**Parameters:** None

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `UNAUTHORIZED` (401).

```typescript
const profile = await client.users.getProfile();
console.log(profile.bio, profile.skills);
```

---

#### `users.updateProfile(data)`

Updates the authenticated user's profile information.

**HTTP Route:** `PATCH /users/me/profile`

**Parameters:**

| Name   | Type                | Required | Description               |
| ------ | ------------------- | -------- | ------------------------- |
| `data` | `UpdateProfileData` | Yes      | Fields to update.         |

See [UpdateProfileData](#updateprofiledata) for field details.

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `VALIDATION_ERROR` (400) or `UNAUTHORIZED` (401).

```typescript
const profile = await client.users.updateProfile({
  bio: 'Award-winning clip editor',
  socialLinks: { twitter: 'https://twitter.com/editor42' },
  skills: ['video-editing', 'color-grading'],
});
```

---

#### `users.getById(id)`

Retrieves a user by their unique identifier.

**HTTP Route:** `GET /users/:id`

**Parameters:**

| Name | Type     | Required | Description         |
| ---- | -------- | -------- | ------------------- |
| `id` | `string` | Yes      | The unique user ID. |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404).

```typescript
const user = await client.users.getById('usr_abc123');
console.log(user.displayName);
```

---

#### `users.getByUsername(username)`

Retrieves a user by their username.

**HTTP Route:** `GET /users/username/:username`

**Parameters:**

| Name       | Type     | Required | Description                  |
| ---------- | -------- | -------- | ---------------------------- |
| `username` | `string` | Yes      | The unique username to look up. |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404).

```typescript
const user = await client.users.getByUsername('progamer42');
console.log(user.displayName, user.id);
```

---

#### `users.search(query, limit?)`

Searches for users by a text query. Matches against usernames, display names, and other profile fields.

**HTTP Route:** `GET /users/search`

**Parameters:**

| Name    | Type     | Required | Description                              |
| ------- | -------- | -------- | ---------------------------------------- |
| `query` | `string` | Yes      | The search query string.                 |
| `limit` | `number` | No       | Maximum number of results to return.     |

**Returns:** `Promise<Record<string, unknown>[]>`

**Throws:** `ApiError`

```typescript
const results = await client.users.search('editor', 10);
results.forEach(user => console.log(user.username));
```

---

#### `users.getReferralStats()`

Retrieves the authenticated user's referral statistics.

**HTTP Route:** `GET /users/me/referrals`

**Parameters:** None

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `UNAUTHORIZED` (401).

```typescript
const stats = await client.users.getReferralStats();
console.log(stats.totalReferrals, stats.earned);
```

---

#### `users.generateReferralCode()`

Generates a new referral code for the authenticated user.

**HTTP Route:** `POST /users/me/referrals/generate`

**Parameters:** None

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `UNAUTHORIZED` (401).

```typescript
const result = await client.users.generateReferralCode();
console.log('Share this code:', result.code);
```

---

#### `users.applyReferral(code)`

Applies a referral code to the authenticated user's account.

**HTTP Route:** `POST /users/me/referrals/apply`

**Parameters:**

| Name   | Type     | Required | Description                   |
| ------ | -------- | -------- | ----------------------------- |
| `code` | `string` | Yes      | The referral code to apply.   |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `VALIDATION_ERROR` (400) if code is invalid, or `CONFLICT` (409) if already used.

```typescript
const result = await client.users.applyReferral('REF-ABC123');
console.log(result.message);
```

---

### Notifications

Service client for in-app notification operations. Access via `client.notifications`.

---

#### `notifications.list(params?)`

Lists notifications for the authenticated user with optional filtering.

**HTTP Route:** `GET /notifications`

**Parameters:**

| Name     | Type                     | Required | Description                      |
| -------- | ------------------------ | -------- | -------------------------------- |
| `params` | `NotificationListParams` | No       | Filter and pagination options.   |

`NotificationListParams` fields:

| Name         | Type      | Required | Description                                             |
| ------------ | --------- | -------- | ------------------------------------------------------- |
| `page`       | `number`  | No       | Page number (1-indexed).                                |
| `limit`      | `number`  | No       | Items per page.                                         |
| `unreadOnly` | `boolean` | No       | When `true`, only unread notifications are returned.    |
| `type`       | `string`  | No       | Filter by notification type.                            |

**Returns:** `Promise<PaginatedResponse<Record<string, unknown>>>`

**Throws:** `ApiError` -- notably `UNAUTHORIZED` (401).

```typescript
const result = await client.notifications.list({ unreadOnly: true, limit: 10 });
console.log(result.data);
```

---

#### `notifications.getUnreadCount()`

Retrieves the count of unread notifications.

**HTTP Route:** `GET /notifications/unread/count`

**Parameters:** None

**Returns:** `Promise<{ count: number }>`

**Throws:** `ApiError` -- notably `UNAUTHORIZED` (401).

```typescript
const { count } = await client.notifications.getUnreadCount();
if (count > 0) {
  console.log(`${count} new notifications`);
}
```

---

#### `notifications.markAsRead(id?)`

Marks one or all notifications as read.

**HTTP Route:** `PATCH /notifications/:id/read` (with ID) or `PATCH /notifications/read` (without ID)

**Parameters:**

| Name | Type     | Required | Description                                              |
| ---- | -------- | -------- | -------------------------------------------------------- |
| `id` | `string` | No       | Notification ID. If omitted, marks all as read.          |

**Returns:** `Promise<void>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404) or `UNAUTHORIZED` (401).

```typescript
// Mark a specific notification as read
await client.notifications.markAsRead('notif_abc123');

// Mark all notifications as read
await client.notifications.markAsRead();
```

---

#### `notifications.markAllAsRead()`

Marks all notifications as read, regardless of type or age.

**HTTP Route:** `PATCH /notifications/read-all`

**Parameters:** None

**Returns:** `Promise<void>`

**Throws:** `ApiError` -- notably `UNAUTHORIZED` (401).

```typescript
await client.notifications.markAllAsRead();
```

---

#### `notifications.remove(id)`

Deletes a notification by its unique identifier.

**HTTP Route:** `DELETE /notifications/:id`

**Parameters:**

| Name | Type     | Required | Description                     |
| ---- | -------- | -------- | ------------------------------- |
| `id` | `string` | Yes      | The notification ID to delete.  |

**Returns:** `Promise<void>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404) or `UNAUTHORIZED` (401).

```typescript
await client.notifications.remove('notif_abc123');
```

---

### Balance

Service client for balance and payout operations. Access via `client.balance`.

---

#### `balance.getBalance()`

Retrieves the authenticated user's current account balance.

**HTTP Route:** `GET /balance`

**Parameters:** None

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `UNAUTHORIZED` (401).

```typescript
const balance = await client.balance.getBalance();
console.log(`Available: $${balance.available}`);
console.log(`Pending: $${balance.pending}`);
```

---

#### `balance.getTransactions(params?)`

Lists balance transactions with optional filtering by type and date range.

**HTTP Route:** `GET /balance/transactions`

**Parameters:**

| Name     | Type                    | Required | Description                      |
| -------- | ----------------------- | -------- | -------------------------------- |
| `params` | `TransactionListParams` | No       | Filter and pagination options.   |

`TransactionListParams` fields:

| Name        | Type     | Required | Description                                            |
| ----------- | -------- | -------- | ------------------------------------------------------ |
| `page`      | `number` | No       | Page number (1-indexed).                               |
| `limit`     | `number` | No       | Items per page.                                        |
| `type`      | `string` | No       | Filter by type (`'earning'`, `'payout'`, `'bonus'`).   |
| `startDate` | `string` | No       | ISO 8601 start date filter.                            |
| `endDate`   | `string` | No       | ISO 8601 end date filter.                              |

**Returns:** `Promise<PaginatedResponse<Record<string, unknown>>>`

**Throws:** `ApiError` -- notably `UNAUTHORIZED` (401).

```typescript
const result = await client.balance.getTransactions({
  type: 'earning',
  startDate: '2025-01-01',
  endDate: '2025-06-30',
  page: 1,
  limit: 25,
});
result.data.forEach(tx => console.log(tx.amount, tx.description));
```

---

#### `balance.requestPayout(data)`

Requests a payout from the authenticated user's available balance.

**HTTP Route:** `POST /balance/payouts`

**Parameters:**

| Name   | Type               | Required | Description                |
| ------ | ------------------ | -------- | -------------------------- |
| `data` | `RequestPayoutData`| Yes      | Payout request payload.    |

See [RequestPayoutData](#requestpayoutdata) for field details.

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `VALIDATION_ERROR` (400) if balance is insufficient or validation fails.

```typescript
const payout = await client.balance.requestPayout({
  amount: 100,
  method: 'paypal',
  details: { email: 'editor@example.com' },
});
console.log(`Payout ${payout.id} is ${payout.status}`);
```

---

### Studios

Service client for studio management operations. Access via `client.studios`.

---

#### `studios.list(filters?)`

Lists studios with optional search, sorting, and pagination.

**HTTP Route:** `GET /studios`

**Parameters:**

| Name      | Type                | Required | Description                     |
| --------- | ------------------- | -------- | ------------------------------- |
| `filters` | `StudioListFilters` | No       | Filter and pagination options.  |

`StudioListFilters` fields:

| Name     | Type     | Required | Description                                          |
| -------- | -------- | -------- | ---------------------------------------------------- |
| `page`   | `number` | No       | Page number (1-indexed).                             |
| `limit`  | `number` | No       | Items per page.                                      |
| `search` | `string` | No       | Search query (matches name/description).             |
| `sortBy` | `string` | No       | Sort field (`'rating'`, `'members'`, `'created'`).   |

**Returns:** `Promise<PaginatedResponse<Record<string, unknown>>>`

**Throws:** `ApiError`

```typescript
const result = await client.studios.list({
  search: 'esports',
  sortBy: 'rating',
  page: 1,
  limit: 10,
});
```

---

#### `studios.getBySlug(slug)`

Retrieves a studio by its unique slug.

**HTTP Route:** `GET /studios/:slug`

**Parameters:**

| Name   | Type     | Required | Description                         |
| ------ | -------- | -------- | ----------------------------------- |
| `slug` | `string` | Yes      | The unique URL-safe studio slug.    |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404).

```typescript
const studio = await client.studios.getBySlug('pixel-editors');
console.log(studio.name, studio.memberCount);
```

---

#### `studios.create(data)`

Creates a new studio.

**HTTP Route:** `POST /studios`

**Parameters:**

| Name   | Type               | Required | Description                 |
| ------ | ------------------ | -------- | --------------------------- |
| `data` | `CreateStudioData` | Yes      | Studio creation payload.    |

See [CreateStudioData](#createstudiodata) for field details.

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `VALIDATION_ERROR` (400) or `CONFLICT` (409) if slug is taken.

```typescript
const studio = await client.studios.create({
  name: 'Highlight Hub',
  slug: 'highlight-hub',
  description: 'The best gaming highlights',
  website: 'https://highlighthub.gg',
});
```

---

#### `studios.update(slug, data)`

Updates an existing studio with partial data.

**HTTP Route:** `PATCH /studios/:slug`

**Parameters:**

| Name   | Type               | Required | Description                           |
| ------ | ------------------ | -------- | ------------------------------------- |
| `slug` | `string`           | Yes      | The unique studio slug.               |
| `data` | `UpdateStudioData` | Yes      | Fields to update.                     |

See [UpdateStudioData](#updatestudiodata) for field details.

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404), `VALIDATION_ERROR` (400), or `FORBIDDEN` (403).

```typescript
const updated = await client.studios.update('pixel-editors', {
  description: 'A premier studio for pixel-perfect editing',
  website: 'https://newsite.com',
});
```

---

#### `studios.remove(slug)`

Permanently deletes a studio. Only studio owners can perform this action.

**HTTP Route:** `DELETE /studios/:slug`

**Parameters:**

| Name   | Type     | Required | Description                |
| ------ | -------- | -------- | -------------------------- |
| `slug` | `string` | Yes      | The studio slug to delete. |

**Returns:** `Promise<void>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404) or `FORBIDDEN` (403).

```typescript
await client.studios.remove('old-studio');
```

---

#### `studios.getMembers(slug)`

Retrieves the list of members for a given studio.

**HTTP Route:** `GET /studios/:slug/members`

**Parameters:**

| Name   | Type     | Required | Description              |
| ------ | -------- | -------- | ------------------------ |
| `slug` | `string` | Yes      | The unique studio slug.  |

**Returns:** `Promise<Record<string, unknown>[]>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404).

```typescript
const members = await client.studios.getMembers('pixel-editors');
members.forEach(m => console.log(m.username, m.role));
```

---

#### `studios.join(slug)`

Joins a studio as a member.

**HTTP Route:** `POST /studios/:slug/join`

**Parameters:**

| Name   | Type     | Required | Description              |
| ------ | -------- | -------- | ------------------------ |
| `slug` | `string` | Yes      | The studio slug to join. |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404) or `CONFLICT` (409) if already a member.

```typescript
const membership = await client.studios.join('pixel-editors');
console.log('Joined studio as', membership.role);
```

---

#### `studios.leave(slug)`

Leaves a studio that the authenticated user has previously joined.

**HTTP Route:** `POST /studios/:slug/leave`

**Parameters:**

| Name   | Type     | Required | Description               |
| ------ | -------- | -------- | ------------------------- |
| `slug` | `string` | Yes      | The studio slug to leave. |

**Returns:** `Promise<void>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404) or `VALIDATION_ERROR` (400) if not a member.

```typescript
await client.studios.leave('pixel-editors');
```

---

#### `studios.rate(slug, rating, review?)`

Submits a rating and optional text review for a studio.

**HTTP Route:** `POST /studios/:slug/rate`

**Parameters:**

| Name     | Type     | Required | Description                              |
| -------- | -------- | -------- | ---------------------------------------- |
| `slug`   | `string` | Yes      | The studio slug to rate.                 |
| `rating` | `number` | Yes      | Numeric rating (typically 1-5).          |
| `review` | `string` | No       | Optional text review.                    |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404) or `VALIDATION_ERROR` (400) for invalid rating values.

```typescript
const result = await client.studios.rate('pixel-editors', 5, 'Amazing studio!');
```

---

#### `studios.getInvites()`

Retrieves pending studio invites for the authenticated user.

**HTTP Route:** `GET /studios/invites`

**Parameters:** None

**Returns:** `Promise<Record<string, unknown>[]>`

**Throws:** `ApiError` -- notably `UNAUTHORIZED` (401).

```typescript
const invites = await client.studios.getInvites();
invites.forEach(invite => {
  console.log(`Invited to: ${invite.studioName}`);
});
```

---

### Disputes

Service client for dispute resolution operations. Access via `client.disputes`.

---

#### `disputes.list(filters?)`

Lists disputes with optional filtering and pagination.

**HTTP Route:** `GET /disputes`

**Parameters:**

| Name      | Type                 | Required | Description                     |
| --------- | -------------------- | -------- | ------------------------------- |
| `filters` | `DisputeListFilters` | No       | Filter and pagination options.  |

`DisputeListFilters` fields:

| Name     | Type     | Required | Description                                              |
| -------- | -------- | -------- | -------------------------------------------------------- |
| `status` | `string` | No       | Filter by status (`'open'`, `'resolved'`, `'rejected'`). |
| `page`   | `number` | No       | Page number (1-indexed).                                 |
| `limit`  | `number` | No       | Items per page.                                          |

**Returns:** `Promise<PaginatedResponse<Record<string, unknown>>>`

**Throws:** `ApiError`

```typescript
const result = await client.disputes.list({ status: 'open', page: 1, limit: 10 });
console.log(result.data);
```

---

#### `disputes.getById(id)`

Retrieves a single dispute by its unique identifier.

**HTTP Route:** `GET /disputes/:id`

**Parameters:**

| Name | Type     | Required | Description           |
| ---- | -------- | -------- | --------------------- |
| `id` | `string` | Yes      | The unique dispute ID. |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404).

```typescript
const dispute = await client.disputes.getById('disp_abc123');
console.log(dispute.reason, dispute.status);
```

---

#### `disputes.create(data)`

Creates a new dispute against a clip.

**HTTP Route:** `POST /disputes`

**Parameters:**

| Name   | Type                | Required | Description                 |
| ------ | ------------------- | -------- | --------------------------- |
| `data` | `CreateDisputeData` | Yes      | Dispute creation payload.   |

See [CreateDisputeData](#createdisputedata) for field details.

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `VALIDATION_ERROR` (400) or `NOT_FOUND` (404) if the clip does not exist.

```typescript
const dispute = await client.disputes.create({
  clipId: 'clip_xyz789',
  reason: 'copyright',
  description: 'This clip contains copyrighted music',
  evidence: ['https://example.com/proof.png'],
});
console.log(`Dispute ${dispute.id} created`);
```

---

#### `disputes.getMine()`

Retrieves all disputes filed by the authenticated user.

**HTTP Route:** `GET /disputes/mine`

**Parameters:** None

**Returns:** `Promise<Record<string, unknown>[]>`

**Throws:** `ApiError` -- notably `UNAUTHORIZED` (401).

```typescript
const myDisputes = await client.disputes.getMine();
myDisputes.forEach(d => console.log(d.reason, d.status));
```

---

#### `disputes.resolve(id, action, notes?)`

Resolves a dispute by accepting or rejecting it. Typically performed by administrators.

**HTTP Route:** `POST /disputes/:id/resolve`

**Parameters:**

| Name     | Type     | Required | Description                                          |
| -------- | -------- | -------- | ---------------------------------------------------- |
| `id`     | `string` | Yes      | The unique dispute ID.                               |
| `action` | `string` | Yes      | Resolution action: `'accept'` or `'reject'`.         |
| `notes`  | `string` | No       | Optional notes explaining the resolution decision.   |

**Returns:** `Promise<Record<string, unknown>>`

**Throws:** `ApiError` -- notably `NOT_FOUND` (404), `VALIDATION_ERROR` (400), or `FORBIDDEN` (403).

```typescript
// Accept a dispute
const resolved = await client.disputes.resolve(
  'disp_abc123', 'accept', 'Valid copyright claim'
);

// Reject a dispute
const rejected = await client.disputes.resolve(
  'disp_abc123', 'reject', 'Insufficient evidence'
);
```

---

## Types

### PaginatedResponse\<T\>

Generic wrapper for paginated API responses.

```typescript
interface PaginatedResponse<T> {
  data: T[];        // Items for the current page
  total: number;    // Total matching items across all pages
  page: number;     // Current page number (1-indexed)
  limit: number;    // Items per page
  totalPages: number; // Total pages available
}
```

---

### CampaignListFilters

```typescript
interface CampaignListFilters {
  status?: string;  // Filter by status ('draft', 'active', 'paused', 'completed')
  page?: number;    // Page number (1-indexed)
  limit?: number;   // Items per page
}
```

---

### CreateCampaignData

```typescript
interface CreateCampaignData {
  title: string;            // Campaign title (required)
  description: string;      // Campaign description (required)
  gameId?: string;          // Associated game ID
  budget?: number;          // Budget in platform currency
  maxParticipants?: number; // Max allowed participants
  startDate?: string;       // Start date (ISO 8601)
  endDate?: string;         // End date (ISO 8601)
  requirements?: string;    // Submission requirements/guidelines
  tags?: string[];          // Categorization tags
}
```

---

### UpdateCampaignData

```typescript
interface UpdateCampaignData {
  title?: string;           // Updated title
  description?: string;     // Updated description
  budget?: number;          // Updated budget
  maxParticipants?: number; // Updated max participants
  startDate?: string;       // Updated start date (ISO 8601)
  endDate?: string;         // Updated end date (ISO 8601)
  requirements?: string;    // Updated requirements
  tags?: string[];          // Updated tags
}
```

---

### ClipListFilters

```typescript
interface ClipListFilters {
  campaignId?: string; // Filter by campaign
  editorId?: string;   // Filter by editor/submitter
  status?: string;     // Filter by status ('pending', 'approved', 'rejected')
  page?: number;       // Page number (1-indexed)
  limit?: number;      // Items per page
}
```

---

### SubmitClipData

```typescript
interface SubmitClipData {
  campaignId: string;      // Target campaign ID (required)
  title: string;           // Clip title (required)
  description?: string;    // Clip description
  videoUrl: string;        // Video file/embed URL (required)
  thumbnailUrl?: string;   // Thumbnail image URL
  duration?: number;       // Duration in seconds
  platform?: string;       // Source platform ('twitch', 'youtube', etc.)
}
```

---

### UpdateUserData

```typescript
interface UpdateUserData {
  displayName?: string; // Updated display name
  email?: string;       // Updated email address
  avatarUrl?: string;   // Updated avatar image URL
}
```

---

### UpdateProfileData

```typescript
interface UpdateProfileData {
  bio?: string;                        // Short biography
  socialLinks?: Record<string, string>; // Social platform URLs
  skills?: string[];                   // Skills/specializations
  timezone?: string;                   // Timezone identifier (e.g., 'America/New_York')
  language?: string;                   // Preferred language code (e.g., 'en')
}
```

---

### NotificationListParams

```typescript
interface NotificationListParams {
  page?: number;       // Page number (1-indexed)
  limit?: number;      // Items per page
  unreadOnly?: boolean; // Filter to unread only
  type?: string;       // Filter by notification type
}
```

---

### TransactionListParams

```typescript
interface TransactionListParams {
  page?: number;      // Page number (1-indexed)
  limit?: number;     // Items per page
  type?: string;      // Filter by type ('earning', 'payout', 'bonus')
  startDate?: string; // Start date filter (ISO 8601)
  endDate?: string;   // End date filter (ISO 8601)
}
```

---

### RequestPayoutData

```typescript
interface RequestPayoutData {
  amount: number;                 // Payout amount in platform currency (required)
  method: string;                 // Payout method: 'paypal', 'bank_transfer', 'crypto' (required)
  details: Record<string, string>; // Method-specific details (required)
}
```

---

### StudioListFilters

```typescript
interface StudioListFilters {
  page?: number;   // Page number (1-indexed)
  limit?: number;  // Items per page
  search?: string; // Search query (name/description)
  sortBy?: string; // Sort field ('rating', 'members', 'created')
}
```

---

### CreateStudioData

```typescript
interface CreateStudioData {
  name: string;                         // Studio name (required)
  slug: string;                         // URL-safe slug (required, must be unique)
  description?: string;                 // Studio description
  avatarUrl?: string;                   // Avatar image URL
  website?: string;                     // Studio website URL
  socialLinks?: Record<string, string>; // Social platform URLs
}
```

---

### UpdateStudioData

```typescript
interface UpdateStudioData {
  name?: string;                        // Updated name
  description?: string;                 // Updated description
  avatarUrl?: string;                   // Updated avatar URL
  website?: string;                     // Updated website URL
  socialLinks?: Record<string, string>; // Updated social links
}
```

---

### DisputeListFilters

```typescript
interface DisputeListFilters {
  status?: string; // Filter by status ('open', 'resolved', 'rejected')
  page?: number;   // Page number (1-indexed)
  limit?: number;  // Items per page
}
```

---

### CreateDisputeData

```typescript
interface CreateDisputeData {
  clipId: string;      // ID of the clip being disputed (required)
  reason: string;      // Reason category: 'copyright', 'quality', 'inappropriate' (required)
  description: string; // Detailed description (required)
  evidence?: string[]; // URLs to supporting evidence
}
```
