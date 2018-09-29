import inquirer from 'inquirer'
import fetch from 'node-fetch'
import ora from 'ora'
import { writeFile } from 'fs'

import { createFilename, logEmptyLine } from './utils'

export default function fetchData(getUrl) {
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
		.then(({ fetchAllPosts, type, tag }) => {
			logEmptyLine()

			const filename = createFilename({ type, tag }, fetchAllPosts)
			console.log(filename)
		})
}
