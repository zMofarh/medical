import fs from 'fs';
import { offersHeroData, seasonalOffersData, flashDealsData, howToRedeemSteps, offersNotifyData } from './src/mocks/offersData.js';
import { aboutHero, aboutStory, aboutMission, aboutValues, aboutTimeline, aboutTeam, aboutAwards } from './src/mocks/aboutData.js';
import { contactHero, contactMethods, contactFormConfig, contactMapConfig, contactCtaBanner, contactFaqTeaser } from './src/mocks/contactData.js';
import { searchHeroData, popularSearchesData, quickLinksData, searchCTAData, searchResultsConfig } from './src/mocks/searchPageData.js';
// DNA mock doesn't have the questions exported in a separate file, so we'll just seed a dummy question.

const BASE_URL = 'http://127.0.0.1:8000/api';

async function seed() {
  console.log("Seeding new CMS data...");

  // We need to login first to get the token (admin@clinic.com / ad1212)
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: 'admin@clinic.com', password: 'ad1212' })
  });
  
  const tokenData = await loginRes.json();
  const token = tokenData.access_token;
  const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // 1. About
  await fetch(`${BASE_URL}/cms-about/`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      hero: aboutHero,
      story: aboutStory,
      mission: aboutMission,
      values: aboutValues,
      timeline: aboutTimeline,
      team: aboutTeam,
      awards: aboutAwards
    })
  });
  console.log("Seeded About");

  // 2. Contact
  await fetch(`${BASE_URL}/cms-contact/`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      hero: contactHero,
      methods: contactMethods,
      form_config: contactFormConfig,
      map_config: contactMapConfig,
      cta_banner: contactCtaBanner,
      faq_teaser: contactFaqTeaser
    })
  });
  console.log("Seeded Contact");

  // 3. Search
  await fetch(`${BASE_URL}/cms-search/`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      hero: searchHeroData,
      popular_searches: popularSearchesData,
      quick_links: quickLinksData,
      cta: searchCTAData,
      results_config: searchResultsConfig
    })
  });
  console.log("Seeded Search");

  // 4. Offers Page Config
  await fetch(`${BASE_URL}/offers/page`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({
      hero: offersHeroData,
      how_to_redeem: howToRedeemSteps,
      notify: offersNotifyData
    })
  });
  console.log("Seeded Offers Config");

  // 4.5 Offers List
  for (const offer of seasonalOffersData) {
    await fetch(`${BASE_URL}/offers/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...offer, offer_id: offer.id, type: 'seasonal' })
    });
  }
  for (const deal of flashDealsData) {
    await fetch(`${BASE_URL}/offers/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...deal, offer_id: deal.id, type: 'flash' })
    });
  }
  console.log("Seeded Offers");

  // 5. DNA Simulator (Dummy)
  await fetch(`${BASE_URL}/dna-config/questions`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      question_id: "q1",
      category: "cardiac",
      question_text: "هل يوجد تاريخ عائلي لأمراض القلب؟",
      options: [{ id: "yes", text: "نعم", score: 10 }, { id: "no", text: "لا", score: 0 }],
      order_index: "1"
    })
  });
  console.log("Seeded DNA Question");

  console.log("Seeding complete!");
}

seed().catch(console.error);
