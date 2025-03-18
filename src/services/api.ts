
/**
 * API client for interacting with the Python FastAPI backend
 */

// Base URL for API requests - update this to match your backend
const API_BASE_URL = "http://localhost:8000";

// Lead type definition
export interface Lead {
  id?: number;
  name: string;
  email: string;
  budget: number;
}

/**
 * Add a new lead
 */
export async function addLead(lead: Lead) {
  try {
    const response = await fetch(`${API_BASE_URL}/add_lead/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(lead),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding lead:", error);
    throw error;
  }
}

/**
 * Get AI score for a lead
 */
export async function getLeadScore(email: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/score_lead/${encodeURIComponent(email)}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching lead score:", error);
    throw error;
  }
}

/**
 * Get all leads
 */
export async function getAllLeads() {
  try {
    const response = await fetch(`${API_BASE_URL}/all_leads/`);
    const data = await response.json();
    return data.leads.map((lead: any[]) => ({
      id: lead[0],
      name: lead[1],
      email: lead[2],
      budget: lead[3]
    }));
  } catch (error) {
    console.error("Error fetching all leads:", error);
    throw error;
  }
}
