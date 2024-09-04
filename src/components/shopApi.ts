import { Api } from './base/api';
import { ICard, IOrderResult, IOrder, ICardList } from '../types';

export class ShopApi extends Api {
	readonly cdn: string;

	constructor(baseUrl: string, cdn: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getCards(): Promise<ICard[]> {
		return this.get('/product/').then((data: ICardList) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getCard(id: string): Promise<ICard> {
		return this.get(`/product/${id}`).then((data) => data as ICard);
	}

	createOrder(order: IOrder): Promise<IOrderResult> {
		return this.post('/order', order).then((data) => data as IOrderResult);
	}
}
