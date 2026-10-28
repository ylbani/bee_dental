import { z } from "zod";

// -----------------------------------------------------------------------------
// PATIENT SCHEMAS
// -----------------------------------------------------------------------------
export const PatientCreateSchema = z.object({
  firstName: z.string().min(2, "El nombre es obligatorio"),
  lastName: z.string().min(2, "El apellido es obligatorio"),
  idDocument: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  phone: z.string().min(8, "El número de teléfono es obligatorio"),
  secondaryPhone: z.string().optional().nullable(),
  email: z.string().email("Correo electrónico inválido").optional().nullable().or(z.literal("")),
  address: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  guardianName: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export type PatientCreateInput = z.infer<typeof PatientCreateSchema>;

// -----------------------------------------------------------------------------
// APPOINTMENT SCHEMAS
// -----------------------------------------------------------------------------
export const AppointmentCreateSchema = z.object({
  patientId: z.string().uuid("ID de paciente inválido").optional(),
  // For new patients coming via web/WhatsApp
  patientName: z.string().optional(),
  patientPhone: z.string().optional(),
  patientEmail: z.string().email().optional().or(z.literal("")),
  professionalId: z.string().optional().nullable(),
  roomId: z.string().optional().nullable(),
  serviceId: z.string().optional().nullable(),
  startDateTime: z.string().datetime("Formato de fecha ISO inválido"),
  durationMinutes: z.number().int().min(10).max(240).default(30),
  notes: z.string().optional().nullable(),
  channel: z.enum(["WEB", "WHATSAPP", "PHONE", "IN_PERSON"]).default("WEB"),
});

export type AppointmentCreateInput = z.infer<typeof AppointmentCreateSchema>;

// -----------------------------------------------------------------------------
// SERVICE SCHEMAS
// -----------------------------------------------------------------------------
export const DentalServiceSchema = z.object({
  code: z.string().min(2, "El código es obligatorio"),
  name: z.string().min(3, "El nombre del servicio es obligatorio"),
  description: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  basePrice: z.number().positive("El precio base debe ser mayor a 0"),
  durationMinutes: z.number().int().min(5).default(30),
  requiresAppt: z.boolean().default(true),
  isActive: z.boolean().default(true),
});

export type DentalServiceInput = z.infer<typeof DentalServiceSchema>;

// -----------------------------------------------------------------------------
// ODONTOGRAM FINDING SCHEMAS
// -----------------------------------------------------------------------------
export const ToothFindingSchema = z.object({
  toothNumber: z.number().int().min(11).max(85), // FDI system
  conditionType: z.enum([
    "CARIES",
    "RESTORATION",
    "ENDODONTIC",
    "CROWN",
    "IMPLANT",
    "ABSENT",
    "FRACTURE",
    "SEALANT",
    "HEALTHY",
  ]),
  surfaces: z.array(
    z.enum(["OCCLUSAL", "MESIAL", "DISTAL", "VESTIBULAR", "PALATAL_LINGUAL"])
  ).default([]),
  status: z.enum(["DIAGNOSED", "PLANNED", "IN_PROGRESS", "COMPLETED"]).default("DIAGNOSED"),
  notes: z.string().optional().nullable(),
});

export type ToothFindingInput = z.infer<typeof ToothFindingSchema>;

// -----------------------------------------------------------------------------
// INVOICE SCHEMAS
// -----------------------------------------------------------------------------
export const InvoiceItemSchema = z.object({
  serviceId: z.string().optional().nullable(),
  description: z.string().min(2, "Descripción requerida"),
  quantity: z.number().int().min(1).default(1),
  unitPrice: z.number().min(0),
});

export const InvoiceCreateSchema = z.object({
  patientId: z.string().uuid(),
  items: z.array(InvoiceItemSchema).min(1, "Debe incluir al menos un servicio"),
  discount: z.number().min(0).default(0),
  taxRate: z.number().min(0).default(0),
  insuranceCovered: z.number().min(0).default(0),
  notes: z.string().optional().nullable(),
});

export type InvoiceCreateInput = z.infer<typeof InvoiceCreateSchema>;

