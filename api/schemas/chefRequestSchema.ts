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

const itemSchema = z.object({
  supplier: nameSchema,
  purchaseDate: datePickerSchema,
  cost: z.number()
        .nonnegative()
        .max(10000),
});

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
  purchases: z.array(itemSchema),
  additionalComments: z.string()
                      .trim()
                      .max(300)
                      .optional(),
  submit: z.boolean()
          .optional()
}).strict();

export default chefRequestSchema;
