import { IPointUserShortDTO } from "./IPointUserShortDTO";

export interface IPagetPointUserDTO {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  data: IPointUserShortDTO[];
}