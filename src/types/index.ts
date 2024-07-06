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

interface IPage {
  catalog: HTMLElement[];
  basketCounter: number; 
}

interface IModal {
  content: HTMLElement;
}