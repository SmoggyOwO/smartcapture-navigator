
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Filter, Plus, List, Grid, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { addLead, getAllLeads, filterLeads, Lead } from "@/services/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Leads = () => {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingBackend, setIsFetchingBackend] = useState(false);
  const [newLead, setNewLead] = useState<Lead>({
    name: "",
    email: "",
    source: "Website",
    status: "New",
    budget: 100000
  });
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    source: "all",
    minBudget: "",
    maxBudget: ""
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Fetch leads from our API
    const fetchLeads = async () => {
      setIsFetchingBackend(true);
      try {
        const fetchedLeads = await getAllLeads();
        setLeads(fetchedLeads);
        setFilteredLeads(fetchedLeads);
        
        toast({
          title: "Leads Loaded",
          description: `Successfully loaded ${fetchedLeads.length} leads`
        });
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast({
          title: "Error",
          description: "Could not fetch leads",
          variant: "destructive"
        });
      } finally {
        setIsFetchingBackend(false);
      }
    };
    
    fetchLeads();
  }, [toast]);

  // Apply filters when search term or filters change
  useEffect(() => {
    let result = leads;
    
    // Apply search term
    if (searchTerm) {
      result = filterLeads(searchTerm);
    }
    
    // Apply status filter
    if (filters.status !== "all") {
      result = result.filter(lead => lead.status === filters.status);
    }
    
    // Apply source filter
    if (filters.source !== "all") {
      result = result.filter(lead => lead.source === filters.source);
    }
    
    // Apply budget range filters
    if (filters.minBudget) {
      result = result.filter(lead => lead.budget >= Number(filters.minBudget));
    }
    
    if (filters.maxBudget) {
      result = result.filter(lead => lead.budget <= Number(filters.maxBudget));
    }
    
    setFilteredLeads(result);
  }, [searchTerm, filters, leads]);

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
      // Add lead to backend
      const backendResult = await addLead({
        name: newLead.name,
        email: newLead.email,
        budget: Number(newLead.budget),
        source: newLead.source,
        status: newLead.status
      });
      
      if (backendResult.error) {
        toast({
          title: "Backend Warning",
          description: backendResult.error
        });
      } else {
        toast({
          title: "Lead Added",
          description: "Successfully added lead to the database"
        });
      }
      
      // Refresh leads
      const refreshedLeads = await getAllLeads();
      setLeads(refreshedLeads);
      
      // Reset form and close dialog
      setNewLead({
        name: "",
        email: "",
        source: "Website",
        status: "New",
        budget: 100000
      });
      setIsAddLeadOpen(false);
      
    } catch (error) {
      console.error("Error adding lead:", error);
      toast({
        title: "Error",
        description: "Could not add lead",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewLead(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  // Get unique status and source values for filters
  const uniqueStatuses = ["all", ...new Set(leads.map(lead => lead.status || "").filter(Boolean))];
  const uniqueSources = ["all", ...new Set(leads.map(lead => lead.source || "").filter(Boolean))];

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
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter Leads</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="status-filter">Status</Label>
                    <Select 
                      value={filters.status} 
                      onValueChange={(value) => handleFilterChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueStatuses.map(status => (
                          <SelectItem key={status} value={status}>
                            {status === "all" ? "All Statuses" : status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="source-filter">Source</Label>
                    <Select 
                      value={filters.source} 
                      onValueChange={(value) => handleFilterChange("source", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueSources.map(source => (
                          <SelectItem key={source} value={source}>
                            {source === "all" ? "All Sources" : source}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Budget Range</Label>
                    <div className="flex gap-2 items-center">
                      <Input 
                        type="number" 
                        placeholder="Min"
                        value={filters.minBudget}
                        onChange={(e) => handleFilterChange("minBudget", e.target.value)}
                      />
                      <span>to</span>
                      <Input 
                        type="number" 
                        placeholder="Max"
                        value={filters.maxBudget}
                        onChange={(e) => handleFilterChange("maxBudget", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setFilters({
                        status: "all",
                        source: "all",
                        minBudget: "",
                        maxBudget: ""
                      })}
                    >
                      Reset
                    </Button>
                    <Button onClick={() => setIsFilterDialogOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
            Fetching leads...
          </div>
        )}
        
        {Object.values(filters).some(val => val !== "all" && val !== "") && (
          <div className="py-2 px-4 bg-blue-50 text-blue-800 rounded-md text-sm flex justify-between items-center">
            <span>Filters applied: {filteredLeads.length} results</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setFilters({
                status: "all",
                source: "all",
                minBudget: "",
                maxBudget: ""
              })}
            >
              Clear Filters
            </Button>
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
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <TableRow 
                      key={lead.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleLeadClick(lead.id!)}
                    >
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.source || "N/A"}</TableCell>
                      <TableCell>${lead.budget?.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className={getScoreColor(lead.score || 0)}>{lead.score || "N/A"}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(lead.status || "New")}>
                          {lead.status || "New"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      {searchTerm ? "No leads match your search criteria" : "No leads found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <Card 
                  key={lead.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleLeadClick(lead.id!)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{lead.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">{lead.email}</div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500">Source: {lead.source || "N/A"}</div>
                        <Badge variant="outline" className={getStatusColor(lead.status || "New")}>
                          {lead.status || "New"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm">Score:</div>
                        <div className={`font-medium ${getScoreColor(lead.score || 0)}`}>
                          {lead.score || "N/A"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <div className="font-medium">${lead.budget?.toLocaleString()}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                {searchTerm ? "No leads match your search criteria" : "No leads found"}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Leads;
