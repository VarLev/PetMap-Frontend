import { IPointDangerDTO } from "../IPointDangerDTO";

export interface IPagedPointDangerDTO {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  data: IPointDangerDTO[];
}