
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { getAllLeads, Lead, addLead, updateLead } from "@/services/api";

// Pipeline stages
const pipelineStages = [
  { id: "New", name: "New Leads", color: "bg-blue-100" },
  { id: "Contacted", name: "Contacted", color: "bg-yellow-100" },
  { id: "Qualified", name: "Qualified", color: "bg-purple-100" },
  { id: "Proposal", name: "Proposal", color: "bg-indigo-100" },
  { id: "Negotiation", name: "Negotiation", color: "bg-orange-100" },
  { id: "Closed", name: "Closed Won", color: "bg-green-100" }
];

// Assignees
const assignees = [
  { id: "AS", name: "Alex Smith" },
  { id: "RH", name: "Rachel Harris" },
  { id: "LM", name: "Lisa Miller" }
];

const Pipeline = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isAddOpportunityOpen, setIsAddOpportunityOpen] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState<Partial<Lead>>({
    name: "",
    company: "",
    budget: 100000,
    status: "New",
    assignee: "AS"
  });
  const { toast } = useToast();
  
  // Simple drag and drop implementation
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  useEffect(() => {
    // Fetch leads
    const fetchLeads = async () => {
      try {
        const fetchedLeads = await getAllLeads();
        setLeads(fetchedLeads);
      } catch (error) {
        console.error("Error fetching leads:", error);
        toast({
          title: "Error",
          description: "Could not fetch leads data",
          variant: "destructive"
        });
      }
    };
    
    fetchLeads();
  }, [toast]);

  const handleDragStart = (leadId: number) => {
    setDraggedItem(leadId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, stage: string) => {
    e.preventDefault();
    if (draggedItem !== null) {
      const lead = leads.find(l => l.id === draggedItem);
      if (lead) {
        // Update the lead status
        const updatedLead = { ...lead, status: stage };
        updateLead(updatedLead);
        
        // Update local state
        setLeads(leads.map(l => 
          l.id === draggedItem ? { ...l, status: stage } : l
        ));
        
        toast({
          title: "Lead Updated",
          description: `${lead.name} moved to ${stage}`
        });
      }
      setDraggedItem(null);
    }
  };

  const handleAddOpportunity = async () => {
    // Validate form
    if (!newOpportunity.name || !newOpportunity.company || !newOpportunity.budget) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generate an email if not provided
      const email = newOpportunity.email || 
        `${newOpportunity.name?.toLowerCase().replace(/\s+/g, '.')}@${newOpportunity.company?.toLowerCase().replace(/\s+/g, '')}.com`;
      
      // Add the new lead/opportunity
      await addLead({
        name: newOpportunity.name,
        email,
        budget: Number(newOpportunity.budget),
        status: newOpportunity.status,
        company: newOpportunity.company,
        source: "Manual Entry",
        assignee: newOpportunity.assignee
      });
      
      // Refresh leads
      const refreshedLeads = await getAllLeads();
      setLeads(refreshedLeads);
      
      // Reset form and close dialog
      setNewOpportunity({
        name: "",
        company: "",
        budget: 100000,
        status: "New",
        assignee: "AS"
      });
      setIsAddOpportunityOpen(false);
      
      toast({
        title: "Opportunity Added",
        description: `${newOpportunity.name} from ${newOpportunity.company} has been added successfully`
      });
    } catch (error) {
      console.error("Error adding opportunity:", error);
      toast({
        title: "Error",
        description: "Could not add opportunity",
        variant: "destructive"
      });
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOpportunity(prev => ({ ...prev, [name]: value }));
  };
  
  // Get initials for avatar
  const getInitials = (assigneeId: string | undefined) => {
    return assigneeId || "?";
  };
  
  // Get assignee name
  const getAssigneeName = (assigneeId: string | undefined) => {
    if (!assigneeId) return "Unassigned";
    const assignee = assignees.find(a => a.id === assigneeId);
    return assignee?.name || "Unknown";
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Pipeline</h1>
          <div className="flex gap-2">
            <Dialog open={isAddOpportunityOpen} onOpenChange={setIsAddOpportunityOpen}>
              <DialogTrigger asChild>
                <Button>Add Opportunity</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Opportunity</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Contact Name *</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={newOpportunity.name} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name *</Label>
                    <Input 
                      id="company" 
                      name="company" 
                      value={newOpportunity.company} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      value={newOpportunity.email || ""} 
                      onChange={handleInputChange} 
                      placeholder="Auto-generated if left blank"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Deal Value *</Label>
                    <Input 
                      id="budget" 
                      name="budget" 
                      type="number"
                      placeholder="$0.00"
                      value={newOpportunity.budget} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Stage</Label>
                    <select 
                      id="status" 
                      name="status" 
                      className="w-full p-2 border rounded-md"
                      value={newOpportunity.status}
                      onChange={handleInputChange}
                    >
                      {pipelineStages.map(stage => (
                        <option key={stage.id} value={stage.id}>{stage.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assignee">Assigned To</Label>
                    <select 
                      id="assignee" 
                      name="assignee" 
                      className="w-full p-2 border rounded-md"
                      value={newOpportunity.assignee}
                      onChange={handleInputChange}
                    >
                      {assignees.map(assignee => (
                        <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleAddOpportunity}>Add Opportunity</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 overflow-x-auto">
          {pipelineStages.map(stage => (
            <div 
              key={stage.id} 
              className="min-w-[250px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <div className={`${stage.color} p-2 rounded-t-md flex justify-between items-center`}>
                <h3 className="font-medium">{stage.name}</h3>
                <Badge variant="outline">
                  {leads.filter(lead => (lead.status || "New") === stage.id).length}
                </Badge>
              </div>
              
              <div className="bg-gray-50 rounded-b-md p-2 min-h-[500px]">
                {leads
                  .filter(lead => (lead.status || "New") === stage.id)
                  .map(lead => (
                    <Card 
                      key={lead.id} 
                      className="mb-2 cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(lead.id!)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{lead.name}</h4>
                            <div className="text-sm text-gray-500">{lead.company || "Unknown Company"}</div>
                            <div className="text-sm font-medium mt-1">${lead.budget?.toLocaleString()}</div>
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{getInitials(lead.assignee)}</AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
                {leads.filter(lead => (lead.status || "New") === stage.id).length === 0 && (
                  <div className="text-center text-gray-500 py-4 text-sm">
                    No leads in this stage
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Pipeline;
