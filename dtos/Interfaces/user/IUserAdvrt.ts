import { WalkRequestStatus } from "@/dtos/enum/WalkRequestStatus";

export interface IUserAdvrt {
  id: string;
  name: string;
  thumbnailUrl: string;
  status: WalkRequestStatus;
}

