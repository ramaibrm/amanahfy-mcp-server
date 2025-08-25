import { formatSeparator } from '../utils/formatter.util.js';
import type { CampaignData } from '../types/campaign.types.js';

/**
 * @function formatCampaignDetails
 * @description Formats campaign data into a readable Markdown format
 * @param {CampaignData} campaignData - The campaign data from the API
 * @returns {string} Formatted Markdown string
 */
export function formatCampaignDetails(campaignData: CampaignData): string {
	const {
		title,
		description,
		fundraisingGoal,
		raisedAmount,
		currency,
		totalDonors,
		supporters,
		fundraisers,
		startDate,
		endDate,
		status,
		organizationName,
		timeFromLastDonation,
		campaignImage,
		organization,
	} = campaignData;

	// Calculate progress percentage
	const progressPercentage = fundraisingGoal > 0 
		? Math.round((raisedAmount / fundraisingGoal) * 100) 
		: 0;

	// Format amounts
	const formattedGoal = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: currency || 'GBP',
	}).format(fundraisingGoal);

	const formattedRaised = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: currency || 'GBP',
	}).format(raisedAmount);

	// Format dates for display
	const formatDisplayDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString('en-GB', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			});
		} catch {
			return dateString;
		}
	};

	const sections = [
		// Campaign Header
		`# ${title}`,
		'',
		
		// Campaign Image (if available)
		...(campaignImage ? [`![Campaign Image](${campaignImage})`, ''] : []),
		
		// Fundraising Progress
		'## 📊 Fundraising Progress',
		'',
		`**Goal:** ${formattedGoal}`,
		`**Raised:** ${formattedRaised} (${progressPercentage}%)`,
		`**Progress Bar:** ${'█'.repeat(Math.floor(progressPercentage / 5))}${'░'.repeat(20 - Math.floor(progressPercentage / 5))} ${progressPercentage}%`,
		'',
		
		// Campaign Stats
		'## 📈 Campaign Statistics',
		'',
		`- **Total Donors:** ${totalDonors.toLocaleString()}`,
		`- **Supporters:** ${supporters.toLocaleString()}`,
		`- **Fundraisers:** ${fundraisers.toLocaleString()}`,
		`- **Last Donation:** ${timeFromLastDonation}`,
		`- **Status:** ${status.charAt(0).toUpperCase() + status.slice(1)}`,
		'',
		
		// Campaign Timeline
		'## 📅 Campaign Timeline',
		'',
		`- **Start Date:** ${formatDisplayDate(startDate)}`,
		`- **End Date:** ${formatDisplayDate(endDate)}`,
		'',
		
		// Organization Info
		'## 🏢 Organization',
		'',
		`**${organizationName}**`,
		'',
		...(organization.image ? [`![Organization Logo](${organization.image})`, ''] : []),
		organization.description,
		'',
		`- **Organization Slug:** ${organization.slug}`,
		`- **Default Currency:** ${organization.organizationSettings.defaultCurrency.title} (${organization.organizationSettings.defaultCurrency.currency})`,
		'',
		
		// Campaign Description
		'## 📝 Campaign Description',
		'',
		description || 'No description available.',
		'',
		
		// Campaign Features
		'## ⚙️ Campaign Features',
		'',
		`- **Has Fundraisers Page:** ${campaignData.detailPageFundraisers ? '✅' : '❌'}`,
		`- **Has Leaderboard:** ${campaignData.detailPageLeaderboard ? '✅' : '❌'}`,
		`- **Has Checkout Notes:** ${campaignData.allowCheckoutNotes ? '✅' : '❌'}`,
		'',
		
		// Pricing Options
		'## 💰 Pricing Information',
		'',
		`- **Daily Prices:** ${campaignData.containsDailyPrices ? '✅' : '❌'}`,
		`- **Weekly Prices:** ${campaignData.containsWeeklyPrices ? '✅' : '❌'}`,
		`- **Jummah Prices:** ${campaignData.containsJummahPrices ? '✅' : '❌'}`,
		`- **Monthly Prices:** ${campaignData.containsMonthlyPrices ? '✅' : '❌'}`,
		`- **Price Points Style:** ${campaignData.pricepointsStyle}`,
		'',
		
		// Technical Details
		'## 🔧 Technical Details',
		'',
		`- **Campaign ID:** ${campaignData.id}`,
		`- **Campaign UID:** ${campaignData.uid}`,
		`- **Organization Slug:** ${campaignData.organizationSlug}`,
		'',
		
		// Footer
		formatSeparator(),
		'',
		'*Data provided by Amanahfy API*',
	];

	return sections.join('\n');
}
