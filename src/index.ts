import './scss/styles.scss';

import { ShopApi } from './components/shopApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { BasketView } from './components/basketView';
import { ModalView } from './components/modalView';
import { AppModel } from './components/appModel';
import { OrderView } from './components/orderView';
import { PageView } from './components/pageView';
import { ensureElement, cloneTemplate } from './utils/utils';
import { ICard, IOrderForm, IOrder, FormErrors } from './types';
import { CatalogCardView } from './components/catalogCardView';
import { BasketCardView } from './components/basketCardView';
import { PreviewCardView } from './components/previewCardView';
import { SuccessView } from './components/successView';
import { ContactsOrderView } from './components/contacsOrderView';

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

const page = new PageView(document.body, events);
const modal = new ModalView(
	ensureElement<HTMLElement>('#modal-container'),
	events
);
const basket = new BasketView(cloneTemplate(basketTemplate), events);
const contactsForm = new ContactsOrderView(
	cloneTemplate(contactsTemplate),
	events
);
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
	modal.close();
});

events.on('card:removeFromBasket', (item: ICard) => {
	appModel.removeCardFromBasket(item.id);
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

function renderBasketItems() {
	return appModel.getBasket().map((item, index) => {
		const basketItem = new BasketCardView(
			cloneTemplate(basketCardTemplate),
			() => events.emit('card:removeFromBasket', item)
		);

		return basketItem.render({
			index: index + 1,
			title: item.title,
			price: item.price,
		});
	});
}

events.on('basket:open', () => {
	const items = renderBasketItems();
	modal.render({
		content: basket.render({
			items,
			price: appModel.getBasketTotal(),
		}),
	});
});

events.on('basket:changed', () => {
	const items = renderBasketItems();
	basket.render({
		items,
		price: appModel.getBasketTotal(),
	});
	page.counter = appModel.getBasket().length;
});

events.on('order:open', () => {
	modal.render({
		content: paymentForm.render({
			address: appModel.order.address,
			payment: appModel.order.payment,
			valid: false,
			errors: [],
		}),
	});
	if (appModel.order.address || appModel.order.payment) {
		appModel.validateOrder('address');
		appModel.validateOrder('payment');
	}
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
			email: appModel.order.email,
			phone: appModel.order.phone,
			valid: false,
			errors: [],
		}),
	});
	if (appModel.order.email || appModel.order.phone) {
		appModel.validateContacts('email');
		appModel.validateContacts('phone');
	}
});

events.on('order:clear', () => {
	appModel.clearBasket();
	appModel.clearOrder();
	page.counter = appModel.getBasket().length;
	paymentForm.removeActiveClass();
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
			const success = new SuccessView(cloneTemplate(successTemplate), () => {
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

events.on('paymentFormErrors:change', (errors: FormErrors) => {
	const { address, payment } = errors;
	paymentForm.valid = !address && !payment;
	paymentForm.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});

events.on('contactsFormErrors:change', (errors: IOrderForm) => {
	const { email, phone } = errors;
	contactsForm.valid = !email && !phone;
	contactsForm.errors = Object.values(errors)
		.filter((i) => !!i)
		.join('; ');
});
