export const getWednesdays = (startDate: string, endDate: string) => {
  const wednesdays = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  currentDate.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const dayOfWeek = currentDate.getDay();
  const daysToNextWednesday = (3 - dayOfWeek + 7) % 7;
  currentDate.setDate(currentDate.getDate() + daysToNextWednesday);

  while (currentDate <= end) {
    wednesdays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
  }
  return wednesdays;
};
