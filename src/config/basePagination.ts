export class BasePagination {
  private _page: number = 0;
  private _limit: number = 0;

  constructor(page?: number, limit?: number) {
    if (page !== undefined) {
      this.Page = page;
    }

    if (limit !== undefined) {
      this.Limit = limit;
    }
  }

  set Page(page: number) {
    this._page = page;
  }

  get Page(): number {
    return this._page < 1 ? (this._page = 1) : this._page;
  }

  set Limit(limit: number) {
    this._limit = limit;
  }

  get Limit(): number {
    return this._limit < 1
      ? (this._limit = 1)
      : this._limit > 100
      ? (this._limit = 100)
      : this._limit;
  }

  CalculateOffset(): number {
    return (this.Page - 1) * this.Limit;
  }
}
