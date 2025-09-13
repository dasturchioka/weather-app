export const convertTemperature = (
  temp: number, 
  from: 'celsius' | 'fahrenheit', 
  to: 'celsius' | 'fahrenheit'
): number => {
  if (from === to) return temp;
  if (from === 'celsius' && to === 'fahrenheit') {
    return (temp * 9/5) + 32;
  }
  return (temp - 32) * 5/9;
};