import { Logger } from '../utils/logger.util.js';
import campaignsService from '../services/campaigns.service.js';
import { formatCampaignDetails } from './campaigns.formatter.js';
import { handleControllerError } from '../utils/error-handler.util.js';
import { ControllerResponse } from '../types/common.types.js';
import { createApiError } from '../utils/error.util.js';
import { buildErrorContext } from '../utils/error-handler.util.js';

/**
 * @namespace CampaignsController
 * @description Controller responsible for handling donation campaign lookup logic.
 *              It orchestrates calls to the Amanahfy service and formats responses.
 */

/**
 * @function getCampaignBySlug
 * @description Fetches details for a specific donation campaign by its slug identifier.
 * @param {Object} args - Arguments containing campaign slug and options
 * @param {string} args.campaignSlug - The campaign slug to look up
 * @param {number} [args.timeout] - Optional request timeout in milliseconds
 * @param {number} [args.retries] - Optional number of retries for failed requests
 * @returns {Promise<ControllerResponse>} A promise that resolves to the standard controller response containing the formatted campaign details in Markdown.
 * @throws {McpError} Throws an McpError (handled by `handleControllerError`) if the service call fails or returns an error.
 */
async function getCampaignBySlug(
	args: {
		campaignSlug: string;
		timeout?: number;
		retries?: number;
	},
): Promise<ControllerResponse> {
	const methodLogger = Logger.forContext(
		'controllers/campaigns.controller.ts',
		'getCampaignBySlug',
	);
	methodLogger.debug(
		`Getting campaign details for slug: ${args.campaignSlug}`,
		args,
	);

	try {
		// Validate required parameters
		if (!args.campaignSlug || typeof args.campaignSlug !== 'string') {
			throw createApiError(
				'Campaign slug is required and must be a string',
				400,
			);
		}

		// Clean and validate the slug
		const cleanSlug = args.campaignSlug.trim();
		if (cleanSlug === '') {
			throw createApiError(
				'Campaign slug cannot be empty',
				400,
			);
		}

		// Apply service options
		const serviceOptions = {
			timeout: args.timeout,
			retries: args.retries,
		};

		methodLogger.debug(
			`Fetching campaign data for slug: ${cleanSlug}`,
			{
				slug: cleanSlug,
				serviceOptions,
			},
		);

		// Call the service to get campaign data
		const apiResponse = await campaignsService.getCampaignBySlug(
			cleanSlug,
			serviceOptions,
		);

		methodLogger.debug('Got response from service', {
			campaignId: apiResponse.data.id,
			campaignTitle: apiResponse.data.title,
			organizationName: apiResponse.data.organizationName,
		});

		// Format the campaign data
		const formattedContent = formatCampaignDetails(apiResponse.data);
		
		return { content: formattedContent };

	} catch (error) {
		throw handleControllerError(
			error,
			buildErrorContext(
				'Campaign',
				'getCampaignBySlug',
				'controllers/campaigns.controller.ts@getCampaignBySlug',
				args.campaignSlug || 'unknown',
				{ args },
			),
		);
	}
}

export default { getCampaignBySlug };
