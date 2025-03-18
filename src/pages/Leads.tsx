
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, List, Grid, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { addLead, getAllLeads } from "@/services/api";

// Sample data
const leadsData = [
  { id: 1, name: "John Smith", email: "john@example.com", source: "Website", score: 85, status: "New", budget: 150000 },
  { id: 2, name: "Emily Johnson", email: "emily@example.com", source: "Referral", score: 92, status: "Contacted", budget: 250000 },
  { id: 3, name: "Michael Brown", email: "michael@example.com", source: "LinkedIn", score: 78, status: "Qualified", budget: 120000 },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", source: "Email Campaign", score: 65, status: "New", budget: 85000 },
  { id: 5, name: "David Miller", email: "david@example.com", source: "Trade Show", score: 73, status: "Disqualified", budget: 190000 },
  { id: 6, name: "Jessica Wilson", email: "jessica@example.com", source: "Website", score: 81, status: "Contacted", budget: 175000 },
  { id: 7, name: "Robert Taylor", email: "robert@example.com", source: "Advertisement", score: 69, status: "New", budget: 95000 },
  { id: 8, name: "Jennifer Garcia", email: "jennifer@example.com", source: "Webinar", score: 88, status: "Qualified", budget: 230000 },
];

const Leads = () => {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [leads, setLeads] = useState(leadsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBackend, setIsFetchingBackend] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    source: "Website",
    status: "New",
    budget: 100000
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Try to fetch leads from the backend if it's available
    const fetchLeadsFromBackend = async () => {
      setIsFetchingBackend(true);
      try {
        const backendLeads = await getAllLeads();
        if (backendLeads && backendLeads.length > 0) {
          // Merge with our frontend data, avoiding duplicates based on email
          const emailsInBackend = backendLeads.map((lead: any) => lead.email);
          const frontendLeadsNotInBackend = leadsData.filter(lead => 
            !emailsInBackend.includes(lead.email)
          );
          
          // Combine both sets of leads
          setLeads([...backendLeads, ...frontendLeadsNotInBackend]);
          
          toast({
            title: "Connected to Backend",
            description: `Successfully fetched ${backendLeads.length} leads from database`
          });
        }
      } catch (error) {
        console.log("Could not fetch leads from backend:", error);
        // Silently fall back to frontend data
      } finally {
        setIsFetchingBackend(false);
      }
    };
    
    fetchLeadsFromBackend();
  }, [toast]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "Contacted": return "bg-yellow-100 text-yellow-800";
      case "Qualified": return "bg-green-100 text-green-800";
      case "Disqualified": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (e.target.value === "") {
      setLeads(leadsData);
      return;
    }
    
    const filtered = leadsData.filter(lead => 
      lead.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      lead.email.toLowerCase().includes(e.target.value.toLowerCase()) ||
      lead.source.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setLeads(filtered);
  };
  
  const handleLeadClick = (leadId: number) => {
    navigate(`/leads/${leadId}`);
  };
  
  const handleAddLead = async () => {
    // Validate inputs
    if (!newLead.name || !newLead.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Try to add lead to backend first
      const backendResult = await addLead({
        name: newLead.name,
        email: newLead.email,
        budget: Number(newLead.budget)
      });
      
      if (backendResult.error) {
        toast({
          title: "Backend Warning",
          description: backendResult.error
        });
      } else {
        toast({
          title: "Lead Added to Backend",
          description: "Successfully added lead to the database"
        });
      }
    } catch (error) {
      console.error("Error adding lead to backend:", error);
      // Continue with frontend-only logic if backend fails
    }
    
    // Create new lead with mock values for demo
    const newLeadWithId = {
      id: leads.length + 1,
      ...newLead,
      score: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
      budget: Number(newLead.budget)
    };
    
    // Add to leads
    setLeads([newLeadWithId, ...leads]);
    
    // Reset form and close dialog
    setNewLead({
      name: "",
      email: "",
      source: "Website",
      status: "New",
      budget: 100000
    });
    setIsAddLeadOpen(false);
    setIsLoading(false);
    
    toast({
      title: "Lead Added",
      description: `${newLead.name} has been added successfully`
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLead(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Leads</h1>
          <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={newLead.name} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    value={newLead.email} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget ($)</Label>
                  <Input 
                    id="budget" 
                    name="budget" 
                    type="number" 
                    value={newLead.budget} 
                    onChange={handleInputChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Lead Source</Label>
                  <select 
                    id="source" 
                    name="source" 
                    className="w-full p-2 border rounded-md"
                    value={newLead.source}
                    onChange={handleInputChange}
                  >
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Email Campaign">Email Campaign</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="Advertisement">Advertisement</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select 
                    id="status" 
                    name="status" 
                    className="w-full p-2 border rounded-md"
                    value={newLead.status}
                    onChange={handleInputChange}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Disqualified">Disqualified</option>
                  </select>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleAddLead} disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Lead"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="search" 
              placeholder="Search leads..." 
              className="pl-8 w-full md:max-w-sm"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <div className="border rounded-md">
              <Button 
                variant={viewMode === "table" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "card" ? "default" : "ghost"} 
                size="sm"
                onClick={() => setViewMode("card")}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {isFetchingBackend && (
          <div className="py-2 px-4 bg-blue-50 text-blue-800 rounded-md text-sm">
            Connecting to backend service...
          </div>
        )}

        {viewMode === "table" ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow 
                    key={lead.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleLeadClick(lead.id)}
                  >
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>${lead.budget?.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className={getScoreColor(lead.score)}>{lead.score}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <Card 
                key={lead.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleLeadClick(lead.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{lead.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">{lead.email}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">Source: {lead.source}</div>
                      <Badge variant="outline" className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">Score:</div>
                      <div className={`font-medium ${getScoreColor(lead.score)}`}>{lead.score}</div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div className="font-medium">${lead.budget?.toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Leads;
