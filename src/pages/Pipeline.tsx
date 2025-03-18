
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

// Sample data
const pipelineStages = [
  { id: "new", name: "New Leads", color: "bg-blue-100" },
  { id: "contacted", name: "Contacted", color: "bg-yellow-100" },
  { id: "qualified", name: "Qualified", color: "bg-purple-100" },
  { id: "proposal", name: "Proposal", color: "bg-indigo-100" },
  { id: "negotiation", name: "Negotiation", color: "bg-orange-100" },
  { id: "closed", name: "Closed Won", color: "bg-green-100" }
];

const pipelineData = [
  { id: 1, name: "John Smith", company: "Acme Inc.", value: "$12,500", stage: "new", assignee: "AS" },
  { id: 2, name: "Emily Johnson", company: "TechCorp", value: "$25,000", stage: "new", assignee: "RH" },
  { id: 3, name: "Michael Brown", company: "Globex", value: "$8,300", stage: "contacted", assignee: "AS" },
  { id: 4, name: "Sarah Williams", company: "Sterling Co.", value: "$18,750", stage: "contacted", assignee: "LM" },
  { id: 5, name: "David Miller", company: "Initech", value: "$32,000", stage: "qualified", assignee: "RH" },
  { id: 6, name: "Jessica Wilson", company: "Massive Dynamics", value: "$45,200", stage: "proposal", assignee: "LM" },
  { id: 7, name: "Robert Taylor", company: "Wayne Enterprises", value: "$15,700", stage: "negotiation", assignee: "AS" },
  { id: 8, name: "Jennifer Garcia", company: "Stark Industries", value: "$78,900", stage: "closed", assignee: "RH" },
];

const Pipeline = () => {
  const [leads, setLeads] = useState(pipelineData);
  const [isAddOpportunityOpen, setIsAddOpportunityOpen] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    name: "",
    company: "",
    value: "",
    stage: "new",
    assignee: "AS"
  });
  const { toast } = useToast();
  
  // Simple drag and drop implementation
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const handleDragStart = (leadId: number) => {
    setDraggedItem(leadId);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, stage: string) => {
    e.preventDefault();
    if (draggedItem !== null) {
      setLeads(leads.map(lead => 
        lead.id === draggedItem ? { ...lead, stage } : lead
      ));
      setDraggedItem(null);
    }
  };

  const handleAddOpportunity = () => {
    // Validate form
    if (!newOpportunity.name || !newOpportunity.company || !newOpportunity.value) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Format value if it doesn't start with $
    const formattedValue = newOpportunity.value.startsWith('$') 
      ? newOpportunity.value 
      : `$${newOpportunity.value}`;

    // Create new opportunity
    const newLeadWithId = {
      id: leads.length + 1,
      ...newOpportunity,
      value: formattedValue
    };
    
    // Add to leads
    setLeads([...leads, newLeadWithId]);
    
    // Reset form and close dialog
    setNewOpportunity({
      name: "",
      company: "",
      value: "",
      stage: "new",
      assignee: "AS"
    });
    setIsAddOpportunityOpen(false);
    
    toast({
      title: "Opportunity Added",
      description: `${newOpportunity.name} from ${newOpportunity.company} has been added successfully`
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewOpportunity(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Pipeline</h1>
          <div className="flex gap-2">
            <Button variant="outline">Filter</Button>
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
                    <Label htmlFor="value">Deal Value *</Label>
                    <Input 
                      id="value" 
                      name="value" 
                      placeholder="$0.00"
                      value={newOpportunity.value} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stage">Stage</Label>
                    <select 
                      id="stage" 
                      name="stage" 
                      className="w-full p-2 border rounded-md"
                      value={newOpportunity.stage}
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
                      <option value="AS">Alex Smith</option>
                      <option value="RH">Rachel Harris</option>
                      <option value="LM">Lisa Miller</option>
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
                  {leads.filter(lead => lead.stage === stage.id).length}
                </Badge>
              </div>
              
              <div className="bg-gray-50 rounded-b-md p-2 min-h-[500px]">
                {leads
                  .filter(lead => lead.stage === stage.id)
                  .map(lead => (
                    <Card 
                      key={lead.id} 
                      className="mb-2 cursor-move"
                      draggable
                      onDragStart={() => handleDragStart(lead.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{lead.name}</h4>
                            <div className="text-sm text-gray-500">{lead.company}</div>
                            <div className="text-sm font-medium mt-1">{lead.value}</div>
                          </div>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{lead.assignee}</AvatarFallback>
                          </Avatar>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Pipeline;
