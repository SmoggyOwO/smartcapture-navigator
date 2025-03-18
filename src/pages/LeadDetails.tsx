
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Mail, Phone, Save, User, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { getLeadScore } from "@/services/api";

// Mock data for a single lead
const getMockLeadData = (id: string) => {
  return {
    id: parseInt(id),
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corporation",
    source: "Website",
    score: 85,
    status: "New",
    notes: "Initial contact made via website contact form. Expressed interest in our premium plan.",
    lastContact: "2023-09-15",
    budget: 75000, // Added budget field
    activities: [
      { date: "2023-09-15", type: "Email", description: "Sent welcome email" },
      { date: "2023-09-18", type: "Call", description: "Discussed product features" },
      { date: "2023-09-22", type: "Meeting", description: "Product demo scheduled" }
    ]
  };
};

const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [lead, setLead] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [aiScore, setAiScore] = useState<string | null>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  
  useEffect(() => {
    if (id) {
      // In a real app, this would be an API call
      const leadData = getMockLeadData(id);
      setLead(leadData);
      setFormData(leadData);
    }
  }, [id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    // In a real app, this would be an API call to update the lead
    setLead(formData);
    setIsEditing(false);
    toast({
      title: "Lead Updated",
      description: "Lead information has been successfully updated"
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-100 text-blue-800";
      case "Contacted": return "bg-yellow-100 text-yellow-800";
      case "Qualified": return "bg-green-100 text-green-800";
      case "Disqualified": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  const getAIScoreColor = (score: string) => {
    switch (score) {
      case "Hot": return "text-red-600";
      case "Warm": return "text-orange-600";
      case "Cold": return "text-blue-600";
      default: return "text-gray-600";
    }
  };
  
  const fetchAIScore = async () => {
    if (!lead) return;
    
    setIsLoadingScore(true);
    try {
      const response = await getLeadScore(lead.email);
      if (response.lead_score) {
        setAiScore(response.lead_score);
        toast({
          title: "AI Score Retrieved",
          description: `Lead classified as: ${response.lead_score}`
        });
      } else {
        toast({
          title: "Score Not Available",
          description: response.message || "Could not retrieve AI score",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fetching AI score:", error);
      toast({
        title: "Error",
        description: "Could not connect to AI scoring service. Make sure your backend is running.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingScore(false);
    }
  };
  
  if (!lead) {
    return (
      <Layout>
        <div className="p-6">Loading lead details...</div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/leads")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{lead.name}</h1>
          <Badge variant="outline" className={getStatusColor(lead.status)}>
            {lead.status}
          </Badge>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column - Lead information */}
          <div className="flex-1 space-y-6">
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Lead Information</CardTitle>
                    <Button 
                      variant={isEditing ? "default" : "outline"} 
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    >
                      {isEditing ? (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      ) : (
                        "Edit"
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      // Edit form
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input 
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Company</label>
                            <Input 
                              name="company"
                              value={formData.company}
                              onChange={handleInputChange} 
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input 
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Phone</label>
                            <Input 
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange} 
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Source</label>
                            <Input 
                              name="source"
                              value={formData.source}
                              onChange={handleInputChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select 
                              name="status"
                              value={formData.status}
                              onChange={(e) => handleInputChange(e as any)} 
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Qualified">Qualified</option>
                              <option value="Disqualified">Disqualified</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Budget ($)</label>
                            <Input 
                              name="budget"
                              type="number"
                              value={formData.budget}
                              onChange={handleInputChange} 
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                              <div className="text-sm text-gray-500">Name</div>
                              <div className="font-medium">{lead.name}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Mail className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                              <div className="text-sm text-gray-500">Email</div>
                              <div className="font-medium">{lead.email}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Phone className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                              <div className="text-sm text-gray-500">Phone</div>
                              <div className="font-medium">{lead.phone}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                              <div className="text-sm text-gray-500">Last Contact</div>
                              <div className="font-medium">{lead.lastContact}</div>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                          <div>
                            <div className="text-sm text-gray-500">Company</div>
                            <div className="font-medium">{lead.company}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-500">Source</div>
                            <div className="font-medium">{lead.source}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-500">Lead Score</div>
                            <div className="font-medium">{lead.score}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-500">Budget</div>
                            <div className="font-medium">${lead.budget?.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {lead.activities.map((activity: any, index: number) => (
                        <div key={index} className="flex">
                          <div className="mr-4 relative">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            {index < lead.activities.length - 1 && (
                              <div className="absolute top-3 left-1.5 w-0.5 h-full -ml-px bg-gray-200" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium">{activity.type}</h4>
                              <span className="text-sm text-gray-500">{activity.date}</span>
                            </div>
                            <p className="text-gray-600 mt-1">{activity.description}</p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="mt-4">
                        <Button variant="outline" className="w-full">Add Activity</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Notes</CardTitle>
                    <Button variant="outline">Add Note</Button>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      className="min-h-[150px]"
                      placeholder="Enter notes about this lead"
                      value={lead.notes}
                      readOnly
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column - Actions & Quick view */}
          <div className="w-full md:w-80 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Log Call
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={fetchAIScore}
                  disabled={isLoadingScore}
                >
                  <Zap className="mr-2 h-4 w-4" />
                  {isLoadingScore ? "Fetching AI Score..." : "Get AI Score"}
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lead Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center flex-col">
                  <div className="w-24 h-24 rounded-full border-8 border-blue-500 flex items-center justify-center">
                    <span className="text-3xl font-bold">{lead.score}</span>
                  </div>
                  
                  {aiScore && (
                    <div className="mt-4 text-center">
                      <h3 className="font-semibold">AI Classification:</h3>
                      <p className={`text-xl font-bold ${getAIScoreColor(aiScore)}`}>
                        {aiScore}
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">Lead quality assessment based on interaction and profile data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LeadDetails;
