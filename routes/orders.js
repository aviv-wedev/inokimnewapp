require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/create', async (req, res) => {
	//fast response for shopify
	res.status(200).send();

	try {
		const response = await submitOrder(req.body);
		console.log(response.data);
		if (response?.data?.bgateOrderNo == '0') {
			res.status(500).send();
		} else {
			res.status(200).send();
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

async function submitOrder(order) {
	const lineItems = [];
	let index = 1;
	for (const item of order.line_items) {
		let itemPrice;
		if (item.discount_allocations?.length > 0) {
			let totalDiscount = 0;
			for (const discount of item.discount_allocations) {
				totalDiscount += parseFloat(discount.amount);
			}
			const newPrice = parseFloat(item.price) - totalDiscount;
			itemPrice = newPrice;
		} else {
			itemPrice = parseFloat(item.price);
		}

		let lineItemToPush = {
			lineId: index,
			sku: item.sku,
			qty: item.quantity,
			price: itemPrice,
		};

		lineItems.push(lineItemToPush);
		index += 1;
	}

	const body = {
		orderID: order.id,
		name: order.billing_address.name,
		address: order.billing_address.address1,
		City: order.billing_address.city,
		zip: order.billing_address.zip,
		state: order.billing_address.province_code,
		phone: order.billing_address.phone,
		items: lineItems,
	};

	console.log(body);

	return await axios.post(
		`https://cloud.bgate-erp.com/BgateAdmin118/WebServiceScriptrun.asp?wsscriptno=1&WebService=y&username=Shopify&userpassword=${process.env.BGATE_PW}&ImportFromBody=y`,
		body
	);
}
module.exports = router;
