import { Logger } from '../utils/logger.util.js';
import { fetchApi } from '../utils/transport.util.js';
import { createApiError, createUnexpectedError } from '../utils/error.util.js';
import type { CampaignApiResponse, CampaignServiceOptions } from '../types/campaign.types.js';

/**
 * @namespace AmanahfyService
 * @description Service layer for interacting with the Amanahfy campaign API
 */

const logger = Logger.forContext('services/amanahfy.service.ts');

/**
 * Base URL for the Amanahfy API
 */
const AMANAHFY_API_BASE = process.env.AMANAHFY_API_BASE || 'https://api.amanahfy.com/api';

/**
 * @function getCampaignBySlug
 * @description Fetches campaign details from the Amanahfy API using campaign slug
 * @param {string} campaignSlug - The campaign slug identifier
 * @param {CampaignServiceOptions} [options] - Optional service configuration
 * @returns {Promise<CampaignApiResponse>} Promise resolving to campaign data
 * @throws {McpError} If the API request fails or returns an error
 */
async function getCampaignBySlug(
	campaignSlug: string,
	options: CampaignServiceOptions = {},
): Promise<CampaignApiResponse> {
	const methodLogger = logger.forMethod('getCampaignBySlug');
	methodLogger.debug(`Fetching campaign details for slug: ${campaignSlug}`, { campaignSlug, options });

	if (!campaignSlug || typeof campaignSlug !== 'string' || campaignSlug.trim() === '') {
		throw createApiError(
			'Campaign slug is required and must be a non-empty string',
			400,
		);
	}

	const url = `${AMANAHFY_API_BASE}/campaign/public/detail/${encodeURIComponent(campaignSlug.trim())}`;
	
	try {
		methodLogger.debug(`Making request to: ${url}`);
		
		// Note: fetchApi doesn't support timeout/retries directly, so we use it as-is
		const apiResponse = await fetchApi<CampaignApiResponse>(url, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'User-Agent': 'Campaign-Agent-MCP-Server/1.0',
			},
		});

		methodLogger.debug('Raw API response received', { 
			contentLength: JSON.stringify(apiResponse).length,
		});

		// Validate response structure
		if (!apiResponse || typeof apiResponse !== 'object') {
			throw createApiError(
				'Invalid response format from Amanahfy API - expected JSON object',
				502,
			);
		}

		// Check API response code
		if (apiResponse.code !== 200) {
			throw createApiError(
				`Amanahfy API returned error: ${apiResponse.message || 'Unknown error'}`,
				apiResponse.code === 404 ? 404 : 502,
				{ code: apiResponse.code, message: apiResponse.message },
			);
		}

		// Validate that we have campaign data
		if (!apiResponse.data) {
			throw createApiError(
				'No campaign data returned from API',
				502,
			);
		}

		methodLogger.debug('Successfully fetched campaign data', {
			campaignId: apiResponse.data.id,
			campaignTitle: apiResponse.data.title,
			organizationName: apiResponse.data.organizationName,
		});

		return apiResponse;

	} catch (error) {
		methodLogger.error(`Failed to fetch campaign ${campaignSlug}`, error);
		
		// Handle network/HTTP errors
		if (error && typeof error === 'object' && 'code' in error) {
			const httpError = error as { code: string; message: string; status?: number };
			throw createApiError(
				`Failed to fetch campaign data: ${httpError.message}`,
				httpError.status || 503,
				httpError,
			);
		}

		// Handle other errors
		throw createUnexpectedError(
			`Unexpected error fetching campaign: ${error instanceof Error ? error.message : String(error)}`,
			error,
		);
	}
}

export default {
	getCampaignBySlug,
};
