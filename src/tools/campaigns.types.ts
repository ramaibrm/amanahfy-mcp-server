import { z } from 'zod';

/**
 * @fileoverview Campaign tool argument types and schemas
 * @description Zod schemas for validating campaign tool arguments
 */

/**
 * Schema for campaign tool arguments
 */
export const CampaignToolArgs = z.object({
	timeout: z
		.number()
		.int()
		.min(1000)
		.max(30000)
		.optional()
		.describe('Request timeout in milliseconds (1000-30000)'),
	retries: z
		.number()
		.int()
		.min(0)
		.max(5)
		.optional()
		.describe('Number of retry attempts (0-5)'),
});

/**
 * TypeScript type inferred from the schema
 */
export type CampaignToolArgsType = z.infer<typeof CampaignToolArgs>;
