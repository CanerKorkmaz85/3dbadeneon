export const TEAM_CAMPAIGN = {
  enabled: true,
  code: "GOL20",
  startsAt: "2026-11-04T00:00:00+03:00",
  endsAt: "2026-11-09T00:00:00+03:00",
  discount: 0.2,
  whatsapp: "905327079923",
};

export function isTeamCampaignActive(now = Date.now()) {
  return TEAM_CAMPAIGN.enabled && now >= Date.parse(TEAM_CAMPAIGN.startsAt) && now < Date.parse(TEAM_CAMPAIGN.endsAt);
}

export function campaignPrice(price: number) {
  return Math.round(price * (1 - TEAM_CAMPAIGN.discount) * 100) / 100;
}
