import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { pageOg } from '../../../lib/og';

export const getStaticPaths = (async () => {
	const posts = await getCollection('blog');
	return posts.map((post) => ({ params: { slug: post.id }, props: { title: post.data.title, description: post.data.description } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => pageOg(props.title, props.description);
