export type BookingStatus =
  | "pending"
  | "confirmed"
  | "assigned"
  | "dispatched"
  | "transit"
  | "delivered"
  | "completed"
  | "cancelled";

export type RentalDuration = "daily" | "weekly" | "monthly";

export type UserRole = "customer" | "admin";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          phone: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
          role?: UserRole;
        };
        Relationships: [];
      };
      vehicles: {
        Row: {
          id: string;
          name: string;
          name_ar: string | null;
          image: string | null;
          capacity: string | null;
          category: string | null;
          description: string | null;
          description_ar: string | null;
          price_note: string | null;
          status: "available" | "booked" | "maintenance";
          created_at: string;
        };
        Insert: {
          name: string;
          name_ar?: string | null;
          image?: string | null;
          capacity?: string | null;
          category?: string | null;
          description?: string | null;
          description_ar?: string | null;
          price_note?: string | null;
          status?: "available" | "booked" | "maintenance";
        };
        Update: Partial<Database["public"]["Tables"]["vehicles"]["Insert"]>;
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          booking_number: string;
          customer_id: string | null;
          vehicle_id: string | null;
          full_name: string;
          company_name: string | null;
          phone: string;
          whatsapp: string | null;
          email: string;
          project_site_address: string | null;
          delivery_address: string | null;
          start_date: string;
          start_time: string | null;
          equipment_type: string | null;
          project_type: string | null;
          required_capacity: string | null;
          required_dimensions: string | null;
          rental_duration: RentalDuration | null;
          notes: string | null;
          status: BookingStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          booking_number: string;
          customer_id?: string | null;
          vehicle_id?: string | null;
          full_name: string;
          company_name?: string | null;
          phone: string;
          whatsapp?: string | null;
          email: string;
          project_site_address?: string | null;
          delivery_address?: string | null;
          start_date: string;
          start_time?: string | null;
          equipment_type?: string | null;
          project_type?: string | null;
          required_capacity?: string | null;
          required_dimensions?: string | null;
          rental_duration?: RentalDuration | null;
          notes?: string | null;
          status?: BookingStatus;
        };
        Update: Partial<{
          status: BookingStatus;
          vehicle_id: string | null;
        }>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          company: string | null;
          rating: number;
          content: string;
          content_ar: string | null;
          is_published: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          company?: string | null;
          rating: number;
          content: string;
          content_ar?: string | null;
          is_published?: boolean;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
        Relationships: [];
      };
      faqs: {
        Row: {
          id: string;
          question: string;
          question_ar: string | null;
          answer: string;
          answer_ar: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          question: string;
          question_ar?: string | null;
          answer: string;
          answer_ar?: string | null;
          sort_order?: number;
        };
        Update: Partial<Database["public"]["Tables"]["faqs"]["Insert"]>;
        Relationships: [];
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          name: string;
          email: string;
          phone?: string | null;
          message: string;
        };
        Update: {
          is_read?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_booking_status: {
        Args: { p_booking_number: string };
        Returns: {
          booking_number: string;
          status: BookingStatus;
          equipment_type: string | null;
          start_date: string;
          created_at: string;
        }[];
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
