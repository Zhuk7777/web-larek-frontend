export interface IAppModel {
  catalog: ICardList;
  basket: IBasket;
  preview: ICard | null;
  order: IOrder | null;
}

export interface ICardList {
  total: number;
  items: ICard[];
}

export interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: Category;
  price: number
}

export type Category = "софт-скил" | "хард-скил" | "кнопка" | "дополнителное" | "другое";

export interface IBasket {
  item: ICardList;
  price: string;
}

export interface IOrder {
  paymentMethod: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export interface IOrderStatus {
  id: string;
  total: string;
  error: string;
}

export interface IFormValidity {
  isValid: boolean;
  errors: FormErrors;
}

type FormErrors = Record<keyof IOrder, string>;

export interface IModal {
  container: HTMLElement;
  closeButton: HTMLButtonElement;
}

export interface IPage {
  catalog: HTMLElement[];
  basketCounter: number; 
  basket: HTMLElement;
}

interface IViewConstructor<T, S> {
  new (settings: S): IView<T>;
}

interface IView<T> { 
  container: HTMLElement;
  toggleClass(element: HTMLElement, className: string, force?: boolean): void;
  setText(element: HTMLElement, value: unknown): void;
  hideElement(element: HTMLElement): void;
  showElement(element: HTMLElement): void;
  setImage(element: HTMLElement, src: string, alt?: string): void;
  render(data?: T): HTMLElement;
}