import { startOfDay, endOfDay, addDays, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { RangeType } from 'rsuite/esm/DateRangePicker';

export const dateRanges: RangeType[] = [
  {
    label: 'today',
    value: [startOfDay(new Date()), endOfDay(new Date())]
  },
  {
    label: 'last7Days',
    value: [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())]
  },
  {
    label: 'This Month',
    value: [startOfMonth(addDays(new Date(), -1)), endOfMonth(addDays(new Date(), -1))]
  },
  {
    label: 'All',
    value: [startOfDay(new Date('1970-01-01')), endOfDay(new Date())]
  }
];
