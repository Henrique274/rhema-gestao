export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      eventos: {
        Row: {
          atualizado_em: string
          criado_em: string
          data: string
          descricao: string | null
          horario: string
          id: string
          local: string
          titulo: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          data: string
          descricao?: string | null
          horario: string
          id?: string
          local: string
          titulo: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          data?: string
          descricao?: string | null
          horario?: string
          id?: string
          local?: string
          titulo?: string
        }
        Relationships: []
      }
      "Igreja RHEMA": {
        Row: {
          id: number
          "members e attendance": string
        }
        Insert: {
          id?: number
          "members e attendance"?: string
        }
        Update: {
          id?: number
          "members e attendance"?: string
        }
        Relationships: []
      }
      membros: {
        Row: {
          atualizado_em: string
          categoria: string | null
          criado_em: string
          data_entrada: string
          data_nascimento: string | null
          email: string | null
          endereco: string | null
          funcao: string | null
          genero: string | null
          id: string
          idade: number | null
          nome: string
          observacoes: string | null
          status: string | null
          telefone: string | null
        }
        Insert: {
          atualizado_em?: string
          categoria?: string | null
          criado_em?: string
          data_entrada: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          funcao?: string | null
          genero?: string | null
          id?: string
          idade?: number | null
          nome: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
        }
        Update: {
          atualizado_em?: string
          categoria?: string | null
          criado_em?: string
          data_entrada?: string
          data_nascimento?: string | null
          email?: string | null
          endereco?: string | null
          funcao?: string | null
          genero?: string | null
          id?: string
          idade?: number | null
          nome?: string
          observacoes?: string | null
          status?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      presencas: {
        Row: {
          atualizado_em: string
          criado_em: string
          culto: string
          data: string
          id: string
          membro_id: string
          presente: boolean
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          culto: string
          data: string
          id?: string
          membro_id: string
          presente?: boolean
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          culto?: string
          data?: string
          id?: string
          membro_id?: string
          presente?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "presencas_membro_id_fkey"
            columns: ["membro_id"]
            isOneToOne: false
            referencedRelation: "membros"
            referencedColumns: ["id"]
          },
        ]
      }
      recursos: {
        Row: {
          atualizado_em: string
          categoria: string
          criado_em: string
          id: string
          localizacao: string | null
          nome: string
          quantidade: number
        }
        Insert: {
          atualizado_em?: string
          categoria: string
          criado_em?: string
          id?: string
          localizacao?: string | null
          nome: string
          quantidade: number
        }
        Update: {
          atualizado_em?: string
          categoria?: string
          criado_em?: string
          id?: string
          localizacao?: string | null
          nome?: string
          quantidade?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
