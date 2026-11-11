import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
	const posts = (await getCollection('blog')).map((post) => ({
		title: post.data.title,
		description: post.data.description,
		pubDate: post.data.pubDate,
		link: `/blog/${post.id}/`,
	}));

	const projects = (await getCollection('project')).map((project) => ({
		title: project.data.title,
		description: project.data.short_description,
		pubDate: project.data.startedDate,
		link: `/project/${project.id}/`,
	}));

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: [...posts, ...projects].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()),
	});
}
