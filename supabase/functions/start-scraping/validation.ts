
// Validate the scraping request parameters
export async function validateRequest({ keywords, country, states, fields }) {
  const errors = [];
  
  if (!keywords || typeof keywords !== 'string' || keywords.trim() === '') {
    errors.push("Keywords are required");
  }

  if (!country || typeof country !== 'string' || country.trim() === '') {
    errors.push("Country is required");
  }

  if (!states || !Array.isArray(states) || states.length === 0) {
    errors.push("At least one state is required");
  }

  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    errors.push("At least one data field is required");
  }

  if (errors.length > 0) {
    throw {
      status: 400,
      message: errors.join(", ")
    };
  }
  
  return true;
}
