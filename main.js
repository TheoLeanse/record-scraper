require('isomorphic-fetch');
const $ = require('cheerio');
const isEqual = require('lodash.isequal');

const stores = [
	{
		name: 'rubadub',
		url: 'http://www.rubadub.co.uk/records',
		primarySelector: '.product-name',
		secondarySelectors: [
			'.artist-name',
			'.record-name',
			'.record-label',
			'a'
		]
	},
	{
		name: 'boomkat',
		url: 'https://boomkat.com',
		primarySelector: '.product_item',
		secondarySelectors: [
			'.release__artist',
			'.release__title',
			'.release__label',
			'.release__genre',
			'.product-item-review',
			'a'
		]
	},
	{
		name: 'hardwax',
		url: 'https://hardwax.com/?paginate_by=50',
		primarySelector: '.listing',
		secondarySelectors: [
			'.linebig',
			'.linesmall a',
			'.linesmall p',
			'a'
		]
	},
	{
		name: 'honest jons',
		url: 'http://honestjons.com/shop/latest_100_arrivals',
		primarySelector: '.item',
		secondarySelectors: [
			'h2',
			'h3',
			'h4',
			'p',
			'a'
		]
	},
	{
		name: 'phonica',
		url: 'http://www.phonicarecords.com/',
		primarySelector: '.product-place-holder',
		secondarySelectors: [
			'.archive-artist',
			'.archive-title',
			'.archive-label',
			'a.archive-product-link'
		]
	},
	{
		name: 'test pressing',
		url: 'http://testpressing.org',
		primarySelector: '.app-post',
		secondarySelectors: [
			'.post-title',
			'a'
		]
	}
];

stores.forEach(store => store.dig = dig.bind(store));

function dig (page) {
	const url = this.url;
	const selectors = this.secondarySelectors;
	const records = [];

	$(this.primarySelector, page).each((i, el) => {
		record = selectors.map(selector => {
			if (selector === 'a' || selector === 'a.archive-product-link') return $(selector, el).attr('href');
			return $(selector, el).first().text().trim().replace(/\n/g, '');
		});
		records.push(record.filter(Boolean));
	});

	return records
		.filter(x => x.length > 1)
		.sort()
		.reduce((a, b) => {
			if (!isEqual(a[a.length - 1], b)) a.push(b)
			return a;
		}, []);
}

function work (store) {
	return fetch(store.url)
		.then(res => res.text())
		.then(store.dig);
}

module.exports = () => Promise.all(stores.map(work));

Promise.all(stores.map(work))
	.then(console.log);
