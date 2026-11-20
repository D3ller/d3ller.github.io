import type { APIRoute } from 'astro';
import { homeOg } from '../lib/og';

export const GET: APIRoute = () => homeOg();
