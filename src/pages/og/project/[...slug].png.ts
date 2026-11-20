import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { pageOg } from '../../../lib/og';

export const getStaticPaths = (async () => {
	const projects = await getCollection('project');
	return projects.map((p) => ({ params: { slug: p.id }, props: { title: p.data.title, description: p.data.short_description } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => pageOg(props.title, props.description);
