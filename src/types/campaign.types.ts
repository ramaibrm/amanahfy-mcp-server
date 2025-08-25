/**
 * @fileoverview Campaign-related type definitions
 * @description Types for the Amanahfy campaign API responses and internal data structures
 */

export interface CurrencyInfo {
	id: number;
	title: string;
	currency: string;
	active: boolean;
}

export interface OrganizationSettings {
	defaultCurrencyId: number;
	defaultCurrency: CurrencyInfo;
}

export interface Organization {
	image: string;
	description: string;
	slug: string;
	name: string;
	organizationSettings: OrganizationSettings;
}

export interface CampaignData {
	id: number;
	title: string;
	startDate: string;
	endDate: string;
	uid: string;
	fundraisingGoal: number;
	campaignImage: string;
	detailPageDonateFlow: boolean;
	detailPageFundraisingFlow: boolean;
	detailPageFundraisers: boolean;
	detailPageLeaderboard: boolean;
	fundraiserPageFundraisingFlow: boolean;
	fundraiserPageLeaderboard: boolean;
	donationPageFundraisingFlow: boolean;
	donationPageLeaderboard: boolean;
	allowCheckoutNotes: boolean;
	allowCheckoutNotesExpress: boolean;
	checkoutNotesCustomLabel: string;
	supportMessageCustomLabel: string;
	status: string;
	enableEndDate: boolean;
	pricepointsStyle: string;
	organization: Organization;
	relatedCrowdfundings: unknown[];
	image: string;
	description: string;
	organizationSlug: string;
	organizationName: string;
	totalDonors: number;
	raisedAmount: number;
	raisedOfflineAmount: number;
	currency: string;
	timeFromLastDonation: string;
	supporters: number;
	lastDonationDate: string;
	fundraisers: number;
	containsDailyPrices: boolean;
	containsWeeklyPrices: boolean;
	containsJummahPrices: boolean;
	containsMonthlyPrices: boolean;
	campaignFrequenciesOrder: unknown[];
}

export interface CampaignApiResponse {
	code: number;
	message: string;
	data: CampaignData;
	requestId: string;
}

export interface CampaignServiceOptions {
	// Note: timeout and retries not currently supported by fetchApi
	// These are kept for future enhancement
	timeout?: number;
	retries?: number;
}
