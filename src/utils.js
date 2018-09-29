import fetch from 'node-fetch'

export const isStringWithLength = val =>
	typeof val === 'string' && val.length > 0

export const removeUndefined = obj => {
	Object.keys(obj).forEach(key => {
		if (obj[key] === undefined) {
			delete obj[key]
		}
	})
	return obj
}

export const createQuery = obj =>
	Object.entries(removeUndefined(obj)).reduce(
		(str, [key, val], i) => `${str}${i > 0 ? '&' : ''}${key}=${val}`,
		'?',
	)

export const createFetchQuery = config => (query = {}) =>
	fetch(
		`https://api.tumblr.com/v2/blog/${
			config.username
		}.tumblr.com/posts${createQuery({
			api_key: config.key,
			...query,
		})}`,
	)

export const logEmptyLine = () => console.log('')

export const objToFile = obj =>
	Object.entries(removeUndefined(obj)).reduce(
		(str, [key, val]) => `${str}_${key}-${val}`,
		'',
	)

export const createFilename = (obj, all) =>
	`./output/output-${all ? 'all' : 'limited'}${objToFile(obj)}_${Math.floor(
		new Date() / 1000,
	)}.json`

export const getPageCount = (offset, totalPosts) =>
	totalPosts ? `${offset / 20 + 1}/${Math.ceil(totalPosts / 20)}` : '1'

export const isObject = x =>
	Object.prototype.toString.call(x) === '[object Object]'

export const inspect = obj =>
	Object.keys(obj).reduce((acc, key) => {
		const val = obj[key]
		if (isObject(val)) {
			acc[key] = inspect(val)
		} else if (Array.isArray(val)) {
			if (isObject(val[0])) {
				acc[key] = `array of objects: ${JSON.stringify(
					inspect(val[0]),
				)}`
			} else {
				acc[key] = `array of ${typeof val[0]}s`
			}
		} else if (typeof val === 'object') {
			acc[key] = val
		} else {
			acc[key] = typeof val
		}
		return acc
	}, {})
