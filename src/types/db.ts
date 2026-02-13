export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type TableDef<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
};

export type Database = {
  public: {
    Tables: {
      profiles: TableDef<
        {
          user_id: string;
          display_name: string | null;
          avatar_url: string | null;
          notif_prefs: Json | null;
          created_at: string;
        },
        {
          user_id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          notif_prefs?: Json | null;
          created_at?: string;
        },
        {
          display_name?: string | null;
          avatar_url?: string | null;
          notif_prefs?: Json | null;
        }
      >;
      packs: TableDef<
        {
          id: string;
          owner_id: string | null;
          title: string;
          category: string;
          visibility: 'public' | 'link-only';
          status: string;
          creator_name: string | null;
          created_at: string;
        },
        {
          id?: string;
          owner_id?: string | null;
          title: string;
          category: string;
          visibility: 'public' | 'link-only';
          status?: string;
          creator_name?: string | null;
          created_at?: string;
        },
        {
          owner_id?: string | null;
          title?: string;
          category?: string;
          visibility?: 'public' | 'link-only';
          status?: string;
          creator_name?: string | null;
        }
      >;
      pack_items: TableDef<
        {
          id: string;
          pack_id: string;
          name: string;
          image_url: string | null;
          buy_url: string | null;
          notes: string | null;
          position: number | null;
          created_at: string;
        },
        {
          id?: string;
          pack_id: string;
          name: string;
          image_url?: string | null;
          buy_url?: string | null;
          notes?: string | null;
          position?: number | null;
          created_at?: string;
        },
        {
          name?: string;
          image_url?: string | null;
          buy_url?: string | null;
          notes?: string | null;
          position?: number | null;
        }
      >;
      ranking_submissions: TableDef<
        {
          id: string;
          pack_id: string;
          user_id: string | null;
          display_name: string;
          ordered_item_ids: Json;
          submitted_at: string;
        },
        {
          id?: string;
          pack_id: string;
          user_id?: string | null;
          display_name?: string;
          ordered_item_ids: Json;
          submitted_at?: string;
        },
        {
          user_id?: string | null;
          display_name?: string;
          ordered_item_ids?: Json;
        }
      >;
      rankings: TableDef<
        {
          pack_id: string;
          user_id: string;
          ordered_item_ids: Json;
          updated_at: string;
          submitted_at: string | null;
        },
        {
          pack_id: string;
          user_id: string;
          ordered_item_ids: Json;
          updated_at?: string;
          submitted_at?: string | null;
        },
        {
          ordered_item_ids?: Json;
          updated_at?: string;
          submitted_at?: string | null;
        }
      >;
      comments: TableDef<
        {
          id: string;
          pack_id: string;
          user_id: string;
          body: string;
          created_at: string;
          deleted_at: string | null;
        },
        {
          id?: string;
          pack_id: string;
          user_id: string;
          body: string;
          created_at?: string;
          deleted_at?: string | null;
        },
        {
          body?: string;
          deleted_at?: string | null;
        }
      >;
      events: TableDef<
        {
          id: string;
          user_id: string | null;
          session_id: string | null;
          name: string;
          data: Json;
          created_at: string;
        },
        {
          id?: string;
          user_id?: string | null;
          session_id?: string | null;
          name: string;
          data?: Json;
          created_at?: string;
        },
        {
          name?: string;
          data?: Json;
        }
      >;
    };
  };
};
