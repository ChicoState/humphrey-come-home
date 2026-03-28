# Database Schema

Supabase Postgres schema for Humphrey Come Home.

## Tables

### profiles

User profile info. Created on first login.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid (PK) | References `auth.users(id)`, cascade delete |
| `name` | text | Display name |
| `avatar_url` | text | URL to `avatars` storage bucket |
| `home_location` | text | City/region string |
| `joined_at` | timestamptz | Default `now()` |

### posts

User-submitted lost/found pet reports.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint (PK) | Auto-increment |
| `user_id` | uuid (FK) | References `auth.users(id)`, cascade delete |
| `title` | text | Required |
| `description` | text | |
| `status` | text | `lost`, `found`, or `reunited` |
| `latitude` | double precision | |
| `longitude` | double precision | |
| `image_url` | text | URL to `posts` storage bucket |
| `created_at` | timestamptz | Default `now()` |

### shelters

Animal shelters, populated by scrapers.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint (PK) | Auto-increment |
| `name` | text | Required |
| `website` | text | Unique |
| `phone` | text | |
| `address` | text | |
| `latitude` | double precision | |
| `longitude` | double precision | |
| `created_at` | timestamptz | Default `now()` |
| `last_scraped_at` | timestamptz | |

### animals

Individual animals at shelters, populated by scrapers.

| Column | Type | Notes |
|---|---|---|
| `id` | bigint (PK) | Auto-increment |
| `shelter_id` | bigint (FK) | References `shelters(id)`, cascade delete |
| `name` | text | |
| `species` | text | e.g. dog, cat |
| `breed` | text | |
| `age` | text | e.g. "2 years", "puppy" |
| `gender` | text | |
| `size` | text | small, medium, large |
| `color` | text | |
| `description` | text | |
| `photo_url` | text | |
| `status` | text | Default `available`. Values: available, adopted, found, hold |
| `source_platform` | text | |
| `external_id` | text | |
| `source_url` | text | |
| `created_at` | timestamptz | Default `now()` |

## Row-Level Security

RLS is enabled on all tables with these policies:

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| profiles | Everyone | Own row | Own row | — |
| posts | Everyone | Authenticated (own user_id) | Own posts | Own posts |
| shelters | Everyone | — | — | — |
| animals | Everyone | — | — | — |

## Storage Buckets

| Bucket | Access | Path format |
|---|---|---|
| `avatars` | Public read, authenticated write | `{user_id}/{timestamp}-{filename}` |
| `posts` | Public read, authenticated write | `{user_id}/{timestamp}-{filename}` |
