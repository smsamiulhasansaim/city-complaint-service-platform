import { z } from "zod";

export const complaintWizardSchema = z.object({
  categoryId: z.string().uuid("Choose a category"),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title is too long"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description is too long"),
  ward: z.string().max(50, "Ward is too long").optional().or(z.literal("")),
  address: z
    .string()
    .max(255, "Address is too long")
    .optional()
    .or(z.literal("")),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  images: z
    .array(z.string().url("Image must be a valid URL"))
    .max(10, "Up to 10 images")
    .optional(),
});

export type ComplaintWizardValues = z.infer<typeof complaintWizardSchema>;

export const addComplaintUpdateSchema = z.object({
  note: z.string().min(1, "A note is required").max(1000, "Note is too long"),
});

export type AddComplaintUpdateValues = z.infer<typeof addComplaintUpdateSchema>;

export const reviewSchema = z.object({
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  comment: z
    .string()
    .min(1, "A comment is required")
    .max(1000, "Comment is too long"),
});

export type ReviewValues = z.infer<typeof reviewSchema>;