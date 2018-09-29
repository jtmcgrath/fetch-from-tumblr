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

export const createGetUrl = config => (query = {}) =>
	`https://api.tumblr.com/v2/blog/${
		config.username
	}.tumblr.com/posts${createQuery({
		api_key: config.key,
		...query,
	})}`
