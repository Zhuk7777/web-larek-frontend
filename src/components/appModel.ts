import { IAppModel, ICard, IOrder, FormErrors, IOrderForm } from '../types';
import { Model } from './base/model';

export class AppModel extends Model<IAppModel> {
	basket: string[] = [];
	catalog: ICard[] = [];
	order: IOrder = {
		items: [],
		address: '',
		email: '',
		phone: '',
		payment: '',
		total: 0,
	};
	formErrors: FormErrors = {};
	preview: string | null;

	addCardToBasket(cardId: string) {
		if (this.basket.includes(cardId)) return;
		this.basket.push(cardId);
	}

	removeCardFromBasket(itemId: string) {
		if (this.basket.includes(itemId)) {
			const index = this.basket.indexOf(itemId);
			this.basket.splice(index, 1);
			this.emit('basket:open');
		}
		return;
	}

	getBasket(): ICard[] {
		return this.catalog.filter((item) => this.basket.includes(item.id));
	}

	getBasketTotal() {
		return this.basket.reduce(
			(a, c) => a + this.catalog.find((it) => it.id === c).price,
			0
		);
	}

	setCatalog(items: ICard[]) {
		this.catalog = [...items];
		this.emit('catalog:changed', this.catalog);
	}

	setPreview(item: ICard) {
		this.preview = item.id;
		this.emit('preview:changed', item);
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		if (this.validateOrder(field)) {
			this.events.emit('order:ready', this.order);
		}

		if (this.validateContacts(field)) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	private validateOrder(field: keyof IOrder) {
		const errors: FormErrors = {};
		if (field !== 'email' && field !== 'phone') {
			if (!this.order.address) errors.address = 'Необходимо указать адрес';
			else if (!this.order.payment)
				errors.address = 'Необходимо выбрать способ оплаты';
			this.formErrors = errors;
			this.events.emit('paymentFormErrors:change', this.formErrors);
			return Object.keys(errors).length === 0;
		}
	}

	private validateContacts(field: keyof IOrder) {
		const errors: FormErrors = {};
		if (field !== 'address' && field !== 'payment') {
			if (!this.order.email) errors.email = 'Необходимо указать email';
			if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
			this.formErrors = errors;
			this.events.emit('contactsFormErrors:change', this.formErrors);
			return Object.keys(errors).length === 0;
		}
	}

	clearBasket() {
		this.basket = [];
	}

	clearOrder() {
		this.order = {
			address: '',
			email: '',
			phone: '',
			payment: '',
			total: 0,
			items: [],
		};
	}
}
