
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  Mail, 
  Phone, 
  Save, 
  User, 
  Zap, 
  Plus, 
  MessageSquarePlus 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  getLeadScore, 
  getLeadById, 
  updateLead, 
  addActivity, 
  addNote,
  Lead,
  Activity
} from "@/services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const LeadDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Lead>({} as Lead);
  const [aiScore, setAiScore] = useState<string | null>(null);
  const [isLoadingScore, setIsLoadingScore] = useState(false);
  
  // New state for activity dialog
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    date: new Date().toISOString().split('T')[0],
    type: "Email",
    description: ""
  });
  
  // New state for note dialog
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  
  useEffect(() => {
    if (id) {
      // Get lead by ID from our API
      const leadData = getLeadById(Number(id));
      if (leadData) {
        setLead(leadData);
        setFormData(leadData);
      } else {
        toast({
          title: "Lead Not Found",
          description: "The requested lead could not be found",
          variant: "destructive"
        });
        navigate("/leads");
      }
    }
  }, [id, navigate, toast]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    // Save to our API
    const result = updateLead(formData);
    
    if (result.success) {
      setLead(formData);
      setIsEditing(false);
      toast({
        title: "Lead Updated",
        description: "Lead information has been successfully updated"
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Could not update lead",
        variant: "destructive"
      });
    }
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
  
  const handleAddActivity = () => {
    if (!id || !newActivity.description) {
      toast({
        title: "Missing Information",
        description: "Please provide a description",
        variant: "destructive"
      });
      return;
    }
    
    const result = addActivity(Number(id), newActivity as Activity);
    
    if (result.success) {
      // Refresh lead data
      const updatedLead = getLeadById(Number(id));
      if (updatedLead) {
        setLead(updatedLead);
      }
      
      // Reset form and close dialog
      setNewActivity({
        date: new Date().toISOString().split('T')[0],
        type: "Email",
        description: ""
      });
      setIsAddActivityOpen(false);
      
      toast({
        title: "Activity Added",
        description: "The activity has been added successfully"
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Could not add activity",
        variant: "destructive"
      });
    }
  };
  
  const handleAddNote = () => {
    if (!id || !newNote) {
      toast({
        title: "Missing Information",
        description: "Please enter a note",
        variant: "destructive"
      });
      return;
    }
    
    const result = addNote(Number(id), newNote);
    
    if (result.success) {
      // Refresh lead data
      const updatedLead = getLeadById(Number(id));
      if (updatedLead) {
        setLead(updatedLead);
      }
      
      // Reset form and close dialog
      setNewNote("");
      setIsAddNoteOpen(false);
      
      toast({
        title: "Note Added",
        description: "The note has been added successfully"
      });
    } else {
      toast({
        title: "Error",
        description: result.error || "Could not add note",
        variant: "destructive"
      });
    }
  };
  
  const handleSendEmail = () => {
    if (!lead?.email) return;
    
    // Open Gmail compose window
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(lead.email)}`;
    window.open(gmailUrl, '_blank');
    
    // Add an activity
    if (id) {
      addActivity(Number(id), {
        date: new Date().toISOString().split('T')[0],
        type: "Email",
        description: "Email sent via Gmail"
      });
      
      // Refresh lead data
      const updatedLead = getLeadById(Number(id));
      if (updatedLead) {
        setLead(updatedLead);
      }
    }
  };
  
  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({ ...prev, [name]: value }));
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
          <Badge variant="outline" className={getStatusColor(lead.status || "New")}>
            {lead.status || "New"}
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
                              value={formData.company || ""}
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
                              value={formData.phone || ""}
                              onChange={handleInputChange} 
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Source</label>
                            <Input 
                              name="source"
                              value={formData.source || ""}
                              onChange={handleInputChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Status</label>
                            <select 
                              name="status"
                              value={formData.status || "New"}
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
                              <div className="font-medium">{lead.phone || "Not provided"}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                            <div>
                              <div className="text-sm text-gray-500">Last Contact</div>
                              <div className="font-medium">{lead.lastContact || "No contact"}</div>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                          <div>
                            <div className="text-sm text-gray-500">Company</div>
                            <div className="font-medium">{lead.company || "Not provided"}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-500">Source</div>
                            <div className="font-medium">{lead.source || "Not specified"}</div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-gray-500">Lead Score</div>
                            <div className="font-medium">{lead.score || "Not scored"}</div>
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
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Activity History</CardTitle>
                    <Dialog open={isAddActivityOpen} onOpenChange={setIsAddActivityOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <Plus className="mr-2 h-4 w-4" />
                          Add Activity
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Activity</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <select 
                              id="type" 
                              name="type" 
                              className="w-full p-2 border rounded-md"
                              value={newActivity.type}
                              onChange={handleActivityChange}
                            >
                              <option value="Email">Email</option>
                              <option value="Call">Phone Call</option>
                              <option value="Meeting">Meeting</option>
                              <option value="Note">Note</option>
                              <option value="Task">Task</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input 
                              id="date" 
                              name="date" 
                              type="date"
                              value={newActivity.date}
                              onChange={handleActivityChange} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                              id="description" 
                              name="description" 
                              value={newActivity.description}
                              onChange={handleActivityChange as any} 
                            />
                          </div>
                          <div className="flex justify-end pt-4">
                            <Button onClick={handleAddActivity}>
                              Add Activity
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {lead.activities && lead.activities.length > 0 ? (
                        lead.activities.map((activity, index) => (
                          <div key={activity.id || index} className="flex">
                            <div className="mr-4 relative">
                              <div className="w-3 h-3 rounded-full bg-blue-500" />
                              {index < (lead.activities?.length || 0) - 1 && (
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
                        ))
                      ) : (
                        <p className="text-gray-500 text-center py-4">No activities recorded yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Notes</CardTitle>
                    <Dialog open={isAddNoteOpen} onOpenChange={setIsAddNoteOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <MessageSquarePlus className="mr-2 h-4 w-4" />
                          Add Note
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Note</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <Textarea 
                            className="min-h-[150px]"
                            placeholder="Enter your note here..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                          />
                          <div className="flex justify-end pt-4">
                            <Button onClick={handleAddNote}>
                              Add Note
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    <Textarea 
                      className="min-h-[150px]"
                      placeholder="No notes yet for this lead"
                      value={lead.notes || ""}
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
                <Button className="w-full" onClick={handleSendEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsAddActivityOpen(true)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Log Call
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setNewActivity({
                      ...newActivity,
                      type: "Meeting",
                      description: "Meeting scheduled with " + lead.name
                    });
                    setIsAddActivityOpen(true);
                  }}
                >
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
                    <span className="text-3xl font-bold">{lead.score || "N/A"}</span>
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
