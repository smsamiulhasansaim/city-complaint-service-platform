import { z } from "zod";

export const serviceRequestSchema = z.object({
  serviceId: z.string().uuid("Choose a service"),
  details: z
    .string()
    .max(2000, "Details are too long")
    .optional()
    .or(z.literal("")),
});

export type ServiceRequestFormValues = z.infer<typeof serviceRequestSchema>;