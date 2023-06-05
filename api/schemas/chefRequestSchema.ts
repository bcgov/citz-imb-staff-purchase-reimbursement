import { z } from 'zod';

const nameSchema =  z.string()
                    .min(2)
                    .max(64)
                    .regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)
                    .trim();


const datePickerSchema =  z.string()
                          .regex(/^\d{4}-\d{2}-\d{2}T00:00:00-07:00$/);

/**
 * @constant
 * @description The schema that matches an incoming purchase item.
 */
const itemSchema = z.object({
  supplier: nameSchema,
  purchaseDate: datePickerSchema,
  cost: z.number()
        .nonnegative()
        .max(10000),
});

/**
 * @constant
 * @description The schema that all CHEFS incoming requests should conform to.
 */
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
