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
	`./output/output-${all ? 'all' : 'limited'}${objToFile(obj)}.json`
