export class MenuItemAssociation {
  constructor(
    public id: number,
    public menuId: number,
    public itemId: number,
    public createdAt: Date
  ) {}

  static create(id: number, menuId: number, itemId: number, createdAt: Date): MenuItemAssociation {
    return new MenuItemAssociation(id, menuId, itemId, createdAt);
  }
}