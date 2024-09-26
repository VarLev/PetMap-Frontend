import { IWalkAdvrtShortDto } from "./IWalkAdvrtShortDto";

export interface IPagedAdvrtDto {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  data: IWalkAdvrtShortDto[];
}