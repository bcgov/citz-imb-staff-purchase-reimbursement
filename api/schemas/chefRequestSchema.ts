import { z } from 'zod';

const fileSchema = z.object({
  storage: z.literal('chefs'),
  url: z.string(),
  size: z.number().int().nonnegative(),
  data: z.object({
    id: z.string()
  }),
  originalName: z.string().endsWith('.pdf')
});

const nameSchema =  z.string()
                    .min(2)
                    .max(64)
                    .regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)
                    .trim();

const datePickerSchema =  z.string()
                          .regex(/^\d{4}-\d{2}-\d{2}T00:00:00-07:00$/);

const chefRequestSchema = z.object({
  lateEntry:  z.boolean()
              .optional(),
  idir: z.string()
        .length(32),
  firstName: nameSchema,
  lastName: nameSchema,
  employeeId: z.number()
              .int()
              .nonnegative()
              .safe(),
  itemsPurchased: z.array(
    z.string()
    .min(2)
    .max(64)
    .trim()
  ),
  totalCost:  z.number()
              .nonnegative()
              .max(10000),
  purchaseDate: datePickerSchema,
  attachReceipts: z.array(
    fileSchema
  ),
  approvalDate: datePickerSchema,
  attachApproval: z.array(
    fileSchema
  ),
  supplierName: nameSchema.optional(),
  supplierPhoneNumber:  z.string()
                        .trim()
                        .regex(/^\(\d{3}\) \d{3}-\d{4}$/)
                        .optional(),
  supplierEmail:  z.string()
                  .trim()
                  .email()
                  .optional(),
  additionalComments: z.string()
                      .trim()
                      .max(300)
                      .optional(),
  submit: z.boolean()
          .optional()
});

export default chefRequestSchema;
