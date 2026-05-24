export type AuthType = "open" | "code";

export type Event = {
  id: string;
  slug: string;
  name: string;
  message: string | null;
  auth_type: AuthType;
  access_code: string | null;
  allow_download: boolean;
  expires_at: string | null;
  created_at: string;
};

export type Photo = {
  id: string;
  event_id: string;
  storage_path: string;
  uploader_session_id: string | null;
  uploaded_at: string;
  signed_url?: string;
};

export type ExpiryOption = "1d" | "3d" | "7d" | "30d" | "never";
