import inquirer from 'inquirer'
import ora from 'ora'
import { writeFile } from 'fs'

import { createFilename, logEmptyLine } from './utils'

export default function fetchData(fetchQuery) {
	inquirer
		.prompt([
			{
				type: 'confirm',
				name: 'fetchAllPosts',
				message: 'Fetch all posts?',
			},
			{
				type: 'confirm',
				name: 'fetchAllTypes',
				message: 'Fetch all post types?',
			},
			{
				type: 'list',
				name: 'type',
				message: 'Type:',
				choices: [
					'photo',
					'answer',
					'text',
					'quote',
					'link',
					'chat',
					'video',
					'audio',
				],
				when: ({ fetchAllTypes }) => !fetchAllTypes,
			},
			{
				type: 'confirm',
				name: 'fetchAllTags',
				message: 'Fetch all tags?',
			},
			{
				type: 'text',
				name: 'tag',
				message: 'Tag:',
				when: ({ fetchAllTags }) => !fetchAllTags,
			},
		])
		.then(async ({ fetchAllPosts, type, tag }) => {
			logEmptyLine()

			const filename = createFilename({ type, tag }, fetchAllPosts)
			const fetchPage = offset =>
				fetchQuery({
					type,
					tag,
					offset,
				})

			let totalPosts = 50
			let offset = 0
			const postsPerPage = 20
			const posts = []

			do {
				const response = await fetchPage(offset)
				const json = await response.json()

				totalPosts = json.response.total_posts || 0

				if (json.response.posts) {
					posts.push(...json.response.posts)
				}

				offset = offset + postsPerPage
			} while (fetchAllPosts && offset < totalPosts)

			logEmptyLine()

			console.log(posts)
		})
}
