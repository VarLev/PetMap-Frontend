export interface IJob {
  id?: number;
  name?: string | null;
  description?: string | null;
  benefits?: number | null;
}

export interface JobDto {
  id: number;
  name: string;
  description: string;
  benefits: number;
  isCompleted: boolean;
}

export interface JobTypeDto {
  jobType: number;
  jobTypeName: string;
  totalBenefits: number;
  isCompleted: boolean;
  jobs: JobDto[];
}