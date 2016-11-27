require('isomorphic-fetch');
const $ = require('cheerio');

const stores = [
	{
		name: 'rubadub',
		url: 'http://www.rubadub.co.uk/records',
		selector: '.product-name'
	},
	{
		name: 'boomkat',
		url: 'https://boomkat.com',
		selector: '.product_item' // .release__details
	},
	{
		name: 'hardwax',
		url: 'https://hardwax.com/?paginate_by=50',
		selector: '.listing'
	},
	{
		name: 'test pressing',
		url: 'http://testpressing.org',
		selector: '.post-title'
	},
	{
		name: 'honest jons',
		url: 'http://honestjons.com/shop/latest_100_arrivals',
		selector: '.item'
	},
	{
		name: 'phonica',
		url: 'http://www.phonicarecords.com/',
		selector: '.product-place-holder'
	}
]

function dig (selector, page) {
	const records = [];
	$(selector, page).each(function () {
		const record = $(this).text()
			  .trim()
			  .replace(/\r\n/g, '')
			  .replace(/\t/g, ' ')
			  .replace(/\n/g, '');
		records.push(record);
	});
	return records;
}

const work = stores.map(store => {
	return fetch(store.url)
		.then(res => res.text())
		.then(page => dig(store.selector, page))
})

Promise.all(work).then(results => console.log(results))

// client-side? nice page with links?
