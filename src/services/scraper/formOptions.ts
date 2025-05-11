
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch all available scraping categories
 */
export async function getScraperCategories() {
  const { data, error } = await supabase
    .from('scraper_categories')
    .select('*')
    .order('label', { ascending: true });

  if (error) {
    console.error('Error fetching scraper categories:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all available countries
 */
export async function getScraperCountries() {
  const { data, error } = await supabase
    .from('scraper_countries')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching countries:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch states for a specific country
 */
export async function getScraperStates(countryId: string) {
  if (!countryId) {
    return [];
  }

  const { data, error } = await supabase
    .from('scraper_states')
    .select('*')
    .eq('country_id', countryId)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching states:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all available data types that can be extracted
 */
export async function getScraperDataTypes() {
  const { data, error } = await supabase
    .from('scraper_data_types')
    .select('*')
    .order('label', { ascending: true });

  if (error) {
    console.error('Error fetching data types:', error);
    return [];
  }

  return data || [];
}

/**
 * Fetch all available rating options
 */
export async function getScraperRatings() {
  const { data, error } = await supabase
    .from('scraper_ratings')
    .select('*')
    .order('value', { ascending: false });

  if (error) {
    console.error('Error fetching ratings:', error);
    return [];
  }

  return data || [];
}
