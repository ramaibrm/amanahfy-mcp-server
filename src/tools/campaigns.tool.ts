import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import { CampaignToolArgs } from './campaigns.types.js';
import { formatErrorForMcpTool } from '../utils/error.util.js';
import { z } from 'zod';

import campaignsController from '../controllers/campaigns.controller.js';

/**
 * Zod schema for the campaign lookup tool arguments
 */
const GetCampaignDetailsToolSchema = z.object({
	campaignSlug: z
		.string()
		.min(1)
		.describe('Campaign slug identifier (e.g., "gaza-100k-in-72hrs")'),
	...CampaignToolArgs.shape, // Merge options schema
});

/**
 * TypeScript type inferred from the combined tool arguments schema
 */
type GetCampaignDetailsToolArgsType = z.infer<typeof GetCampaignDetailsToolSchema>;

/**
 * @function handleGetCampaignDetails
 * @description MCP Tool handler to retrieve details for a donation campaign by slug.
 *              It calls the campaignsController to fetch the data and formats the response for the MCP.
 *
 * @param {Record<string, unknown>} args - Arguments provided to the tool.
 * @returns {Promise<{ content: Array<{ type: 'text', text: string }> }>} Formatted response for the MCP.
 * @throws {McpError} Formatted error if the controller or service layer encounters an issue.
 */
async function handleGetCampaignDetails(args: Record<string, unknown>) {
	const methodLogger = Logger.forContext(
		'tools/campaigns.tool.ts',
		'handleGetCampaignDetails',
	);
	methodLogger.debug(
		`Getting campaign details for slug: ${args.campaignSlug}`,
		args,
	);

	try {
		// Validate arguments with Zod
		const validatedArgs: GetCampaignDetailsToolArgsType = GetCampaignDetailsToolSchema.parse(args);

		// Call the controller with validated arguments
		const result = await campaignsController.getCampaignBySlug({
			campaignSlug: validatedArgs.campaignSlug,
			timeout: validatedArgs.timeout,
			retries: validatedArgs.retries,
		});

		methodLogger.debug('Got response from controller', result);

		// Format the response for the MCP tool
		return {
			content: [
				{
					type: 'text' as const,
					text: result.content,
				},
			],
		};
	} catch (error) {
		methodLogger.error(
			`Error getting campaign details for: ${args.campaignSlug}`,
			error,
		);
		return formatErrorForMcpTool(error);
	}
}

/**
 * @function registerTools
 * @description Registers the campaign lookup tool ('campaign_get_details') with the MCP server.
 *
 * @param {McpServer} server - The MCP server instance.
 */
function registerTools(server: McpServer) {
	const methodLogger = Logger.forContext(
		'tools/campaigns.tool.ts',
		'registerTools',
	);
	methodLogger.debug('Registering campaign tools...');

	server.tool(
		'campaign_get_details',
		`Retrieves detailed information about a donation campaign from Amanahfy by campaign slug. Returns comprehensive campaign data including fundraising progress, organization details, timeline, and campaign features. Use this tool to get current information about active fundraising campaigns. Example slug: "gaza-100k-in-72hrs". Configure timeout and retries for reliability.`,
		GetCampaignDetailsToolSchema.shape,
		handleGetCampaignDetails,
	);

	methodLogger.debug('Successfully registered campaign_get_details tool.');
}

export default { registerTools };
