import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const quoteRequestSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  customerPhone: z.string().trim().min(8).max(30),
  customerEmail: z.string().trim().email().max(200),
  registrationPlate: z.string().trim().min(2).max(20),
  vehicleMake: z.string().trim().min(2).max(80),
  vehicleModel: z.string().trim().min(1).max(100),
  vehicleYear: z.string().trim().max(4).optional(),
  mileage: z.number().int().min(0).max(2_000_000),
  fuelType: z.string().trim().max(40).optional(),
  transmission: z.string().trim().max(40).optional(),
  interventionType: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(3000),
  preferredDates: z
    .array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .min(1)
    .max(3),
});

export const createQuoteRequest = createServerFn({ method: "POST" })
  .validator(quoteRequestSchema)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Database types will include quote_requests after the migration is applied.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;

    const { data: row, error } = await db
      .from("quote_requests")
      .insert({
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        customer_email: data.customerEmail.toLowerCase(),
        registration_plate: data.registrationPlate.toUpperCase(),
        vehicle_make: data.vehicleMake,
        vehicle_model: data.vehicleModel,
        vehicle_year: data.vehicleYear || null,
        mileage: data.mileage,
        fuel_type: data.fuelType || null,
        transmission: data.transmission || null,
        intervention_type: data.interventionType,
        description: data.description,
        preferred_dates: data.preferredDates,
      })
      .select("id")
      .single();

    if (error) {
      console.error(error);
      throw new Error("La demande de devis n’a pas pu être enregistrée.");
    }

    const { sendQuoteNotifications } = await import("@/lib/quote-notifications.server");
    const notifications = await sendQuoteNotifications(data);

    return {
      id: row.id as string,
      ...notifications,
    };
  });
