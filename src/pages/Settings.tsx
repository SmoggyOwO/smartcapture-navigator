
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <Tabs defaultValue="account">
          <TabsList className="mb-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="ai">AI Configuration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your account settings and personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Admin User" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="admin@example.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name</Label>
                  <Input id="company" defaultValue="ACME Corporation" />
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Add or remove team members and manage their roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button>Add Team Member</Button>
                  </div>
                  
                  <div className="rounded-md border">
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium">John Doe</div>
                        <div className="text-sm text-gray-500">john@example.com</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium">Admin</div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium">Jane Smith</div>
                        <div className="text-sm text-gray-500">jane@example.com</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium">Sales Rep</div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    <Separator />
                    <div className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium">Robert Johnson</div>
                        <div className="text-sm text-gray-500">robert@example.com</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium">Marketing</div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>
                  Connect third-party services to enhance your lead management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <div className="font-medium">CRM System</div>
                      <div className="text-sm text-gray-500">Connect to your existing CRM</div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <div className="font-medium">Email Marketing</div>
                      <div className="text-sm text-gray-500">Integrate with email platforms</div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <div className="font-medium">Website Analytics</div>
                      <div className="text-sm text-gray-500">Track website visitor behavior</div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <div className="font-medium">Social Media</div>
                      <div className="text-sm text-gray-500">Monitor social engagement</div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
                <CardDescription>
                  Customize AI model behavior and scoring parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Lead Scoring</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="demographic-weight">Demographic Data Weight</Label>
                        <Input id="demographic-weight" type="number" defaultValue="25" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="behavioral-weight">Behavioral Data Weight</Label>
                        <Input id="behavioral-weight" type="number" defaultValue="35" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="engagement-weight">Engagement History Weight</Label>
                        <Input id="engagement-weight" type="number" defaultValue="25" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="purchase-weight">Purchase Likelihood Weight</Label>
                        <Input id="purchase-weight" type="number" defaultValue="15" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="font-medium">AI Settings</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="sentiment-analysis">Sentiment Analysis</Label>
                        <Switch id="sentiment-analysis" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="auto-enrichment">Automatic Lead Enrichment</Label>
                        <Switch id="auto-enrichment" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="smart-assignment">Smart Lead Assignment</Label>
                        <Switch id="smart-assignment" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="next-action">Next-Best-Action Recommendations</Label>
                        <Switch id="next-action" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
