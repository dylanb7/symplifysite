export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admins: {
        Row: {
          created_at: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          user_id?: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      blue_dye_logs: {
        Row: {
          detail_link: number;
          id: number;
          is_blue: boolean;
          test_link: number;
          user_id: string;
        };
        Insert: {
          detail_link: number;
          id?: number;
          is_blue: boolean;
          test_link: number;
          user_id: string;
        };
        Update: {
          detail_link?: number;
          id?: number;
          is_blue?: boolean;
          test_link?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blue_dye_logs_test_link_fkey";
            columns: ["test_link"];
            referencedRelation: "blue_dye_test";
            referencedColumns: ["stamp"];
          },
          {
            foreignKeyName: "blue_dye_logs_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      blue_dye_resp: {
        Row: {
          blueBowelMovementsKey: number | null;
          firstBlueKey: number | null;
          lastBlueKey: number | null;
          mealDurationKey: number | null;
          normalBowelMovementsKey: number | null;
          pseud: string;
          stamp: number;
        };
        Insert: {
          blueBowelMovementsKey?: number | null;
          firstBlueKey?: number | null;
          lastBlueKey?: number | null;
          mealDurationKey?: number | null;
          normalBowelMovementsKey?: number | null;
          pseud: string;
          stamp?: number;
        };
        Update: {
          blueBowelMovementsKey?: number | null;
          firstBlueKey?: number | null;
          lastBlueKey?: number | null;
          mealDurationKey?: number | null;
          normalBowelMovementsKey?: number | null;
          pseud?: string;
          stamp?: number;
        };
        Relationships: [];
      };
      blue_dye_test: {
        Row: {
          finished_eating: number | null;
          id: number;
          stamp: number;
          user_id: string | null;
        };
        Insert: {
          finished_eating?: number | null;
          id?: number;
          stamp: number;
          user_id?: string | null;
        };
        Update: {
          finished_eating?: number | null;
          id?: number;
          stamp?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "blue_dye_test_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      codes: {
        Row: {
          created_at: string | null;
          value: string;
        };
        Insert: {
          created_at?: string | null;
          value: string;
        };
        Update: {
          created_at?: string | null;
          value?: string;
        };
        Relationships: [];
      };
      detail: {
        Row: {
          desc: string | null;
          id: number;
          pseud: string;
          stamp: number;
          type: string | null;
        };
        Insert: {
          desc?: string | null;
          id?: number;
          pseud: string;
          stamp?: number;
          type?: string | null;
        };
        Update: {
          desc?: string | null;
          id?: number;
          pseud?: string;
          stamp?: number;
          type?: string | null;
        };
        Relationships: [];
      };
      detail_user: {
        Row: {
          desc: string | null;
          id: number;
          stamp: number;
          type: string | null;
          user_id: string;
        };
        Insert: {
          desc?: string | null;
          id?: number;
          stamp?: number;
          type?: string | null;
          user_id: string;
        };
        Update: {
          desc?: string | null;
          id?: number;
          stamp?: number;
          type?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "detail_user_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      pseud_responses: {
        Row: {
          all_selected: string | null;
          detail_link: number | null;
          numeric_response: number | null;
          pseud: string;
          qid: string;
          response: string | null;
          selected: number | null;
          stamp: number;
          type: string;
        };
        Insert: {
          all_selected?: string | null;
          detail_link?: number | null;
          numeric_response?: number | null;
          pseud: string;
          qid: string;
          response?: string | null;
          selected?: number | null;
          stamp?: number;
          type: string;
        };
        Update: {
          all_selected?: string | null;
          detail_link?: number | null;
          numeric_response?: number | null;
          pseud?: string;
          qid?: string;
          response?: string | null;
          selected?: number | null;
          stamp?: number;
          type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pseud_responses_detail_link_fkey";
            columns: ["detail_link"];
            referencedRelation: "detail";
            referencedColumns: ["stamp"];
          }
        ];
      };
      user_bluedye: {
        Row: {
          blueBowelMovementsKey: number;
          firstBlueKey: number;
          lastBlueKey: number;
          mealDurationKey: number;
          normalBowelMovementsKey: number;
          stamp: number;
          user_id: string;
        };
        Insert: {
          blueBowelMovementsKey: number;
          firstBlueKey: number;
          lastBlueKey: number;
          mealDurationKey: number;
          normalBowelMovementsKey: number;
          stamp?: number;
          user_id: string;
        };
        Update: {
          blueBowelMovementsKey?: number;
          firstBlueKey?: number;
          lastBlueKey?: number;
          mealDurationKey?: number;
          normalBowelMovementsKey?: number;
          stamp?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_bluedye_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      user_responses: {
        Row: {
          all_selected: string | null;
          detail_link: number | null;
          numeric_response: number | null;
          qid: string;
          response: string | null;
          selected: number | null;
          stamp: number;
          type: string;
          user_id: string;
        };
        Insert: {
          all_selected?: string | null;
          detail_link?: number | null;
          numeric_response?: number | null;
          qid: string;
          response?: string | null;
          selected?: number | null;
          stamp?: number;
          type: string;
          user_id: string;
        };
        Update: {
          all_selected?: string | null;
          detail_link?: number | null;
          numeric_response?: number | null;
          qid?: string;
          response?: string | null;
          selected?: number | null;
          stamp?: number;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_responses_detail_link_fkey";
            columns: ["detail_link"];
            referencedRelation: "detail_user";
            referencedColumns: ["stamp"];
          },
          {
            foreignKeyName: "user_responses_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
