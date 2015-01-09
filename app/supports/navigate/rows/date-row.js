import Row from '../row';

export default Row.extend({
  prompt: "Date",
  type: "date",

  placeholderYear: 'Year',
  placeholderMonth: 'Month',
  placeholderDay: 'Day',
  year: null,
  month: null,
  day: null,
});