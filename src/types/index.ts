export interface IAppModel {
	catalog: ICard[];
	basket: IBasket;
	preview: ICard | null;
	order: IOrder | null;
}

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
}

export interface IModal {
	content: HTMLElement;
}

export interface ISuccess {
	description: string;
}

export interface ICard {
	id: string;
	image: string;
	title: string;
	description: string;
	category: CategoryKey;
	price: number | null;
}

export interface ICardList {
	total: number;
	items: ICard[];
}

export type CategoryKey =
	| 'софт-скил'
	| 'хард-скил'
	| 'кнопка'
	| 'дополнительное'
	| 'другое';

export type CategoryValue = 'soft' | 'other' | 'additional' | 'button' | 'hard';

export const Category: Record<CategoryKey, CategoryValue> = {
	['софт-скил']: 'soft',
	['другое']: 'other',
	['дополнительное']: 'additional',
	['кнопка']: 'button',
	['хард-скил']: 'hard',
};

export interface IBasket {
	items: HTMLElement[];
	price: number;
}

export interface IOrderForm {
	address: string;
	email: string;
	phone: string;
	payment: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
	total: number;
}

export interface IOrderResult extends IOrder {
	id: string;
	error?: string;
}

export interface IFormValidity {
	valid: boolean;
	errors: string[];
}

export type FormErrors = Partial<Record<keyof IOrderForm, string>>;
