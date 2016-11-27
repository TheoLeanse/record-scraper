require('isomorphic-fetch');
const $ = require('cheerio');

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
			'.linebig', // artist and title
			'.linesmall a', // label
			'.linesmall p', // description
			'a'
		]
	},
	{
		name: 'honest jons',
		url: 'http://honestjons.com/shop/latest_100_arrivals',
		primarySelector: '.item',
		secondarySelectors: [
			'h2', // artist
			'h3', // title
			'h4', // label
			'p', // description
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
			'a.archive-product-link' // problem: there are lots of links and so the sele. do I need this secondary selectors property to be an object so I can explicitly label them as artist, title, label, link and so on...?
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
]

stores.forEach(store => {
	store.dig = digStore.bind(store)
})

function digStore (page) {
	const url = this.url;
	const selectors = this.secondarySelectors;
	const records = [];
	$(this.primarySelector, page).each((i, el) => {
		record = selectors.map(selector => {
			// links are different
			if (selector === 'a' || selector === 'a.archive-product-link') return $(selector, el).attr('href');
			return $(selector, el).first().text().trim().replace(/\n/g, '');
		});
		records.push(record.filter(Boolean)); // filtering Boolean means we can't assume a particular order in the results (i.e. empty descriptions)
	});
	return records.filter(noEmptyArrays);
};

function work (store) {
	return fetch(store.url)
		.then(res => res.text())
		.then(store.dig);
}

Promise.all(stores.map(work))
	.then(console.log);

// TODO: de-dupe and remove empty

function noEmptyArrays (entry) {
	return entry.length;
}
