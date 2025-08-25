import { Command } from 'commander';
import { Logger } from '../utils/logger.util.js';
import campaignsController from '../controllers/campaigns.controller.js';
import { handleCliError } from '../utils/error.util.js';

const logger = Logger.forContext('cli/campaigns.cli.ts');

/**
 * Register campaign-related CLI commands
 *
 * @param program The commander program instance
 */
function register(program: Command) {
	const registerLogger = logger.forMethod('register');
	registerLogger.debug('Registering campaign CLI commands...');

	program
		.command('get-campaign-details')
		.description('Get detailed information about a donation campaign by slug')
		.argument('<campaignSlug>', 'Campaign slug identifier (e.g., "gaza-100k-in-72hrs")')
		.option(
			'--timeout <milliseconds>',
			'Request timeout in milliseconds (1000-30000)',
			(value) => {
				const timeout = parseInt(value, 10);
				if (isNaN(timeout) || timeout < 1000 || timeout > 30000) {
					throw new Error('Timeout must be between 1000 and 30000 milliseconds');
				}
				return timeout;
			},
		)
		.option(
			'--retries <number>',
			'Number of retry attempts (0-5)',
			(value) => {
				const retries = parseInt(value, 10);
				if (isNaN(retries) || retries < 0 || retries > 5) {
					throw new Error('Retries must be between 0 and 5');
				}
				return retries;
			},
		)
		.action(async (campaignSlug: string, options: { timeout?: number; retries?: number }) => {
			const actionLogger = logger.forMethod('getCampaignDetailsAction');
			actionLogger.debug('Executing get-campaign-details command', {
				campaignSlug,
				options,
			});

			try {
				console.log(`🔍 Looking up campaign: ${campaignSlug}`);
				
				if (options.timeout) {
					console.log(`⏱️  Using timeout: ${options.timeout}ms`);
				}
				
				if (options.retries !== undefined) {
					console.log(`🔄 Using retries: ${options.retries}`);
				}

				const result = await campaignsController.getCampaignBySlug({
					campaignSlug,
					timeout: options.timeout,
					retries: options.retries,
				});

				console.log('\n📊 Campaign Details:\n');
				console.log(result.content);

			} catch (error) {
				actionLogger.error('Error in get-campaign-details command', error);
				handleCliError(error);
			}
		});

	registerLogger.debug('Campaign CLI commands registered successfully');
}

export default { register };
