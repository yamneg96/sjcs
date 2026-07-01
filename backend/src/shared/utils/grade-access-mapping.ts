export const studentGradeAccessMap = (grade: number): number[] => {
  switch (grade) {
    case 9:
      return [9];
    case 10:
      return [10, 9];
    case 11:
      return [11, 10, 9];
    case 12:
      return [12, 11, 10, 9];
    default:
      return [grade];
  }
};
