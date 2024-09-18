import { IJob } from "@/dtos/Interfaces/job/IJob";

export class Job implements IJob {
  id?: number;
  name?: string | null | undefined;
  description?: string | null | undefined;
  benefits?: number | null | undefined;

  constructor(data: Partial<IJob> = {}) { 
    this.id = data.id ;
    this.name = data.name;
    this.description = data.description;
    this.benefits = data.benefits;
  }
}
