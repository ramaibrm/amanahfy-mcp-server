import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Logger } from '../utils/logger.util.js';
import campaignsController from '../controllers/campaigns.controller.js';
import { formatErrorForMcpResource } from '../utils/error.util.js';

const logger = Logger.forContext('resources/campaigns.resource.ts');

/**
 * Register campaign lookup resources with the MCP server
 *
 * @param server The MCP server instance
 */
function registerResources(server: McpServer) {
	const registerLogger = logger.forMethod('registerResources');
	registerLogger.debug('Registering campaign lookup resources...');

	// Register the campaign lookup resource
	server.resource(
		'campaign-lookup',
		'Lookup donation campaign details by slug, returning formatted text result',
		async (uri: URL) => {
			const methodLogger = logger.forMethod('campaignLookupResource');
			try {
				// Extract the campaign slug from the request path (if present)
				// Format of the URI would be campaign://<campaign-slug>
				methodLogger.debug('Campaign lookup resource called', {
					uri: uri.toString(),
				});

				// Get everything after the campaign:// protocol
				const campaignSlug = uri.toString().replace(/^campaign:\/\//, '');

				if (!campaignSlug || campaignSlug.trim() === '') {
					throw new Error('Campaign slug is required in the URI format: campaign://campaign-slug');
				}

				// Call the controller to get the campaign details
				const result = await campaignsController.getCampaignBySlug({
					campaignSlug: campaignSlug.trim(),
					timeout: 10000,
					retries: 2,
				});

				// Return the content as a text resource
				return {
					contents: [
						{
							uri: uri.toString(),
							text: result.content,
							mimeType: 'text/markdown',
							description: `Campaign Details for ${campaignSlug}`,
						},
					],
				};
			} catch (error) {
				methodLogger.error('Resource error', error);
				return formatErrorForMcpResource(error, uri.toString());
			}
		},
	);

	registerLogger.debug('Campaign lookup resources registered successfully');
}

export default { registerResources };
