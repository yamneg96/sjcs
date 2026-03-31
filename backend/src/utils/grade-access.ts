/**
 * Grade Access Logic:
 * 9  → [9]
 * 10 → [10, 9]
 * 11 → [11, 10, 9]
 * 12 → [12, 11, 10, 9]
 */
export function getAccessibleGrades(grade: number): number[] {
  const grades: number[] = [];
  for (let g = grade; g >= 9; g--) {
    grades.push(g);
  }
  return grades;
}
