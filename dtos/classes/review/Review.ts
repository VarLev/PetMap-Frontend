export class ReviewDTO {
  id: string;
  userId?: string;
  userName?: string;
  pointId?: string;
  rating: number;
  comment: string;
  createdDate: Date;

  constructor(
    id: string,
    rating: number,
    comment: string,
    createdDate: Date,
    userId?: string,
    userName?: string,
    pointId?: string
  ) {
    this.id = id;
    this.rating = rating;
    this.comment = comment;
    this.createdDate = createdDate;
    this.userId = userId;
    this.userName = userName;
    this.pointId = pointId;
  }

  // Метод для конвертации даты в строку (ISO формат)
  public getFormattedDate(): string {
    return this.createdDate.toISOString();
  }

  // Пример метода для отображения полного имени пользователя с датой
  public getReviewSummary?(): string {
    return `${this.userName || 'Anonymous'} оставил(а) отзыв с рейтингом ${this.rating} на ${this.getFormattedDate()}`;
  }
}