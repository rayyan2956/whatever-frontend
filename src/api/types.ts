import type { components } from "./generated/schema";

// Short names for the API types generated from the backend's OpenAPI spec.
// Never write API types by hand: run `npm run api:generate` after the API changes.
type Schemas = components["schemas"];

export type User = Schemas["UserResponse"];
export type AdminUser = Schemas["AdminUserResponse"];
export type AuthSession = Schemas["AuthSessionResponse"];
export type Session = Schemas["SessionResponse"];
export type UploadUrl = Schemas["UploadUrlResponse"];
export type UploadPurpose = Schemas["CreateUploadDto"]["purpose"];
export type Setting = Schemas["SettingResponse"];
export type AppVersions = Schemas["AppVersionsResponse"];
export type ActivityLog = Schemas["ActivityLogResponse"];
export type UserRole = Schemas["UserRole"];

// Paginated lists: { items, total, page, pageSize }.
export type AdminUserPage = Schemas["AdminUserPageResponse"];
export type ActivityLogPage = Schemas["ActivityLogPageResponse"];
