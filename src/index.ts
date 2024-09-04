import './scss/styles.scss';

import { ShopApi } from './components/shopApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { BasketView } from './components/basketView';
import { ModalView } from './components/modalView';
import { AppModel } from './components/appModel';
import { OrderView } from './components/orderView';
import { Page } from './components/pageView';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ICard, IOrderForm, IOrder, FormErrors } from './types';
import { CatalogCardView } from './components/catalogCardView';
import { basketCardView } from './components/basketCardView';
import { PreviewCardView } from './components/previewCardView';
import { successView } from './components/successView';

const events = new EventEmitter();
const api = new ShopApi(API_URL, CDN_URL);
const appModel = new AppModel({}, events);

const catalogcCardTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCardTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketCardTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(document.body, events);
const modal = new ModalView(
	ensureElement<HTMLElement>('#modal-container'),
	events
);
const basket = new BasketView(cloneTemplate(basketTemplate), events);
const contactsForm = new OrderView(cloneTemplate(contactsTemplate), events);
const paymentForm = new OrderView(cloneTemplate(orderTemplate), events);

api.getCards().then(appModel.setCatalog.bind(appModel)).catch(console.error);

events.on('catalog:changed', (catalog: ICard[]) => {
	page.catalog = catalog.map((item) => {
		const card = new CatalogCardView(cloneTemplate(catalogcCardTemplate), () =>
			events.emit('card:select', item)
		);
		return card.render({
			title: item.title,
			image: item.image,
			price: item.price,
			category: item.category,
		});
	});
});

events.on('card:addToBasket', (item: ICard) => {
	appModel.addCardToBasket(item.id);
	page.counter = appModel.getBasket().length;
	modal.close();
});

events.on('card:removeFromBasket', (item: ICard) => {
	appModel.removeCardFromBasket(item.id);
	page.counter = appModel.getBasket().length;
});

events.on('card:select', (item: ICard) => {
	appModel.setPreview(item);
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

events.on('preview:changed', (item: ICard) => {
	const card = new PreviewCardView(cloneTemplate(previewCardTemplate), () =>
		events.emit('card:addToBasket', item)
	);
	modal.render({
		content: card.render({
			title: item.title,
			description: item.description,
			image: item.image,
			category: item.category,
			price: item.price,
			status: appModel.basket.includes(item.id),
		}),
	});
});

events.on('basket:open', () => {
	const items = appModel.getBasket().map((item, index) => {
		const basketItem = new basketCardView(
			cloneTemplate(basketCardTemplate),
			() => events.emit('card:removeFromBasket', item)
		);

		return basketItem.render({
			index: index + 1,
			title: item.title,
			price: item.price,
		});
	});
	modal.render({
		content: basket.render({
			items,
			price: appModel.getBasketTotal(),
		}),
	});
});

events.on('order:open', () => {
	modal.render({
		content: paymentForm.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('payment:set', (data: { paymentMethod: string }) => {
	if (data.paymentMethod === 'cash') {
		data.paymentMethod = 'offline';
	}
	data.paymentMethod = 'online';
	appModel.setOrderField('payment', data.paymentMethod);
});

events.on('order:submit', () => {
	modal.render({
		content: contactsForm.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('order:clear', () => {
	appModel.clearBasket();
	appModel.clearOrder();
	page.counter = appModel.getBasket().length;
});

events.on('contacts:submit', () => {
	const items = appModel.getBasket();
	const itemsId = items.map((i) => i.id);
	appModel.order.items = itemsId;
	api
		.createOrder({
			...appModel.order,
			total: appModel.getBasketTotal(),
		})
		.then((result) => {
			appModel.clearBasket();
			events.emit('order:clear');
			const success = new successView(cloneTemplate(successTemplate), () => {
				modal.close();
			});

			modal.render({
				content: success.render({
					description: !result.error
						? `Списано ${result.total} синапсов`
						: result.error,
				}),
			});
		})
		.catch(console.error);
});

events.on(
	/(^order|^contacts)\..*:change/,
	(data: { field: keyof IOrderForm; value: string }) => {
		appModel.setOrderField(data.field, data.value);
	}
);

events.on('paymentformErrors:change', (errors: FormErrors) => {
	const { address, payment } = errors;
	paymentForm.valid = !address && !payment;
	paymentForm.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

events.on('contactsformErrors:change', (errors: IOrderForm) => {
	const { email, phone } = errors;
	contactsForm.valid = !email && !phone;
	contactsForm.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});
