export interface MenuItemInterface {
  title: string;
  path?: string;
  click?: (e: MouseEvent) => void;
  show: () => boolean;
}
