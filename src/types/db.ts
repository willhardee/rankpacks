export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: { Row: { user_id: string; display_name: string | null; avatar_url: string | null; notif_prefs: Json | null; created_at: string } };
      packs: { Row: { id: string; owner_id: string; title: string; category: string; visibility: string; status: string; created_at: string } };
      pack_items: { Row: { id: string; pack_id: string; name: string; image_url: string | null; buy_url: string | null; notes: string | null; created_at: string } };
      rankings: { Row: { pack_id: string; user_id: string; ordered_item_ids: Json; updated_at: string; submitted_at: string | null } };
      comments: { Row: { id: string; pack_id: string; user_id: string; body: string; created_at: string; deleted_at: string | null } };
      events: { Row: { id: string; user_id: string | null; session_id: string | null; name: string; data: Json; created_at: string } };
    };
  };
};
