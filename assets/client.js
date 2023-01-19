require('dotenv').config();
const { Shopify, ApiVersion } = require('@shopify/shopify-api');
Shopify.Context.API_VERSION = ApiVersion.October22;

const client = new Shopify.Clients.Rest(process.env.SHOP , process.env.ADMIN_API_KEY);

module.exports = client;
