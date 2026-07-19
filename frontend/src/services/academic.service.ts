import api from "./axios";
import type { ApiResponse } from "@/types/api.types";

export interface IAcademicYear {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  status: "Active" | "Closed";
}

export const academicService = {
  list: () => api.get<ApiResponse<IAcademicYear[]>>("/academic-years"),
  getCurrent: () => api.get<ApiResponse<IAcademicYear | null>>("/academic-years/current"),
};
