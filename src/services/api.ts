
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
  source?: string;
  status?: string;
  score?: number;
  notes?: string;
  lastContact?: string;
  company?: string;
  activities?: Activity[];
}

export interface Activity {
  id?: number;
  leadId?: number;
  date: string;
  type: string;
  description: string;
}

export interface Note {
  id?: number;
  leadId: number;
  content: string;
  createdAt: string;
}

// Global leads data store that will be shared across components
let cachedLeads: Lead[] = [];

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
    
    const result = await response.json();
    
    // Update the cache with the new lead if successful
    if (!result.error) {
      const newLead: Lead = {
        ...lead,
        id: lead.id || Date.now(),
        score: Math.floor(Math.random() * 30) + 70,
        status: lead.status || "New",
        source: lead.source || "Website",
        lastContact: new Date().toISOString().split('T')[0],
        activities: []
      };
      
      cachedLeads = [newLead, ...cachedLeads];
    }
    
    return result;
  } catch (error) {
    console.error("Error adding lead:", error);
    // Still update local cache even if backend fails
    const newLead: Lead = {
      ...lead,
      id: lead.id || Date.now(),
      score: Math.floor(Math.random() * 30) + 70,
      status: lead.status || "New",
      source: lead.source || "Website",
      lastContact: new Date().toISOString().split('T')[0],
      activities: []
    };
    
    cachedLeads = [newLead, ...cachedLeads];
    return { message: "Lead added to local cache" };
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
    const backendLeads = data.leads.map((lead: any[]) => ({
      id: lead[0],
      name: lead[1],
      email: lead[2],
      budget: lead[3],
      score: Math.floor(Math.random() * 30) + 70,
      status: "New",
      source: "Website",
      lastContact: new Date().toISOString().split('T')[0],
      activities: []
    }));
    
    // Merge with cached leads
    const existingEmails = new Set(backendLeads.map((lead: Lead) => lead.email));
    const localLeadsNotInBackend = cachedLeads.filter(lead => !existingEmails.has(lead.email));
    
    cachedLeads = [...backendLeads, ...localLeadsNotInBackend];
    return cachedLeads;
  } catch (error) {
    console.error("Error fetching all leads:", error);
    
    // If we already have cached leads, return those
    if (cachedLeads.length === 0) {
      // Initialize with demo data
      initializeDemoData();
    }
    
    return cachedLeads;
  }
}

/**
 * Add a note to a lead
 */
export function addNote(leadId: number, content: string) {
  const lead = cachedLeads.find(l => l.id === leadId);
  if (lead) {
    if (!lead.notes) {
      lead.notes = content;
    } else {
      lead.notes += "\n\n" + content;
    }
    
    // Update the lead's last contact date
    lead.lastContact = new Date().toISOString().split('T')[0];
    
    return { success: true };
  }
  return { error: "Lead not found" };
}

/**
 * Add activity to a lead
 */
export function addActivity(leadId: number, activity: Activity) {
  const lead = cachedLeads.find(l => l.id === leadId);
  if (lead) {
    if (!lead.activities) {
      lead.activities = [];
    }
    
    lead.activities.unshift({
      ...activity,
      id: Date.now(),
      leadId
    });
    
    // Update the lead's last contact date
    lead.lastContact = new Date().toISOString().split('T')[0];
    
    return { success: true };
  }
  return { error: "Lead not found" };
}

/**
 * Update a lead
 */
export function updateLead(updatedLead: Lead) {
  const index = cachedLeads.findIndex(l => l.id === updatedLead.id);
  if (index !== -1) {
    cachedLeads[index] = { ...cachedLeads[index], ...updatedLead };
    return { success: true };
  }
  return { error: "Lead not found" };
}

/**
 * Filter leads by search term
 */
export function filterLeads(searchTerm: string) {
  if (!searchTerm) return cachedLeads;
  
  const term = searchTerm.toLowerCase();
  return cachedLeads.filter(lead => 
    lead.name?.toLowerCase().includes(term) ||
    lead.email?.toLowerCase().includes(term) ||
    lead.company?.toLowerCase().includes(term) ||
    lead.source?.toLowerCase().includes(term) ||
    lead.status?.toLowerCase().includes(term)
  );
}

/**
 * Get a lead by ID
 */
export function getLeadById(id: number) {
  return cachedLeads.find(lead => lead.id === id);
}

/**
 * Get leads by status
 */
export function getLeadsByStatus(status: string) {
  return cachedLeads.filter(lead => lead.status === status);
}

/**
 * Get leads by source for analytics
 */
export function getLeadsBySource() {
  const sourceMap: Record<string, number> = {};
  
  cachedLeads.forEach(lead => {
    const source = lead.source || "Other";
    sourceMap[source] = (sourceMap[source] || 0) + 1;
  });
  
  return Object.entries(sourceMap).map(([name, value]) => ({ name, value }));
}

/**
 * Get conversion rates data
 */
export function getConversionRateData() {
  // Get the last 7 months
  const months = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = month.toLocaleString('default', { month: 'short' });
    months.push(monthName);
  }
  
  // Generate random but consistent data
  return months.map(month => {
    const leads = Math.floor(Math.random() * 200) + 100;
    const conversions = Math.floor(leads * (Math.random() * 0.4 + 0.2));
    return {
      month,
      leads,
      conversions,
      rate: (conversions / leads) * 100
    };
  });
}

/**
 * Initialize demo data if none exists
 */
function initializeDemoData() {
  if (cachedLeads.length === 0) {
    cachedLeads = [
      { id: 1, name: "John Smith", email: "john@example.com", budget: 150000, source: "Website", score: 85, status: "New", company: "Acme Corp", lastContact: "2023-09-15", notes: "Initial contact made via website.", activities: [
        { id: 101, leadId: 1, date: "2023-09-15", type: "Email", description: "Sent welcome email" },
        { id: 102, leadId: 1, date: "2023-09-18", type: "Call", description: "Discussed product features" }
      ] },
      { id: 2, name: "Emily Johnson", email: "emily@example.com", budget: 250000, source: "Referral", score: 92, status: "Contacted", company: "TechCorp", lastContact: "2023-09-10", activities: [
        { id: 201, leadId: 2, date: "2023-09-10", type: "Meeting", description: "Initial consultation" }
      ] },
      { id: 3, name: "Michael Brown", email: "michael@example.com", budget: 120000, source: "LinkedIn", score: 78, status: "Qualified", company: "Globex", lastContact: "2023-09-05" },
      { id: 4, name: "Sarah Williams", email: "sarah@example.com", budget: 85000, source: "Email Campaign", score: 65, status: "New", company: "Initech", lastContact: "2023-09-20" },
      { id: 5, name: "David Miller", email: "david@example.com", budget: 190000, source: "Trade Show", score: 73, status: "Disqualified", company: "Wayne Enterprises", lastContact: "2023-08-30" },
      { id: 6, name: "Jessica Wilson", email: "jessica@example.com", budget: 175000, source: "Website", score: 81, status: "Contacted", company: "Stark Industries", lastContact: "2023-09-12" },
      { id: 7, name: "Robert Taylor", email: "robert@example.com", budget: 95000, source: "Advertisement", score: 69, status: "New", company: "Umbrella Corp", lastContact: "2023-09-18" },
      { id: 8, name: "Jennifer Garcia", email: "jennifer@example.com", budget: 230000, source: "Webinar", score: 88, status: "Qualified", company: "Massive Dynamics", lastContact: "2023-09-03" },
    ];
  }
}

// Initialize data
initializeDemoData();

// Export the cache for direct access in components if needed
export { cachedLeads };
