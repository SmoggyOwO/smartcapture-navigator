
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllLeads, getLeadsBySource, getConversionRateData, Lead } from "@/services/api";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Analytics = () => {
  const [timePeriod, setTimePeriod] = useState("30");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sourceData, setSourceData] = useState<{name: string, value: number}[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch all leads
        const fetchedLeads = await getAllLeads();
        setLeads(fetchedLeads);
        
        // Get source data for pie chart
        const sources = getLeadsBySource();
        setSourceData(sources);
        
        // Get conversion rate data
        const conversionData = getConversionRateData();
        setPerformanceData(conversionData);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate statistics based on time period
  const calculateStats = () => {
    const days = parseInt(timePeriod);
    const now = new Date();
    const cutoff = new Date(now.setDate(now.getDate() - days));
    
    // Filter leads based on last contact date within the period
    const filteredLeads = leads.filter(lead => {
      if (!lead.lastContact) return false;
      const contactDate = new Date(lead.lastContact);
      return contactDate >= cutoff;
    });
    
    const totalLeads = filteredLeads.length;
    const qualifiedLeads = filteredLeads.filter(lead => lead.status === "Qualified").length;
    const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads * 100) : 0;
    
    // Calculate average response time (mocked as we don't have real response time data)
    const responseTime = 1.8; // mocked for now
    
    // Calculate average lead score
    const totalScore = filteredLeads.reduce((sum, lead) => sum + (lead.score || 0), 0);
    const avgScore = totalLeads > 0 ? totalScore / totalLeads : 0;
    
    return {
      totalLeads,
      conversionRate: conversionRate.toFixed(1),
      responseTime: responseTime.toFixed(1),
      avgScore: avgScore.toFixed(0)
    };
  };
  
  const stats = calculateStats();
  
  // Generate lead score distribution data
  const generateLeadScoreData = () => {
    const scoreRanges = [
      { score: "0-20", count: 0 },
      { score: "21-40", count: 0 },
      { score: "41-60", count: 0 },
      { score: "61-80", count: 0 },
      { score: "81-100", count: 0 }
    ];
    
    leads.forEach(lead => {
      const score = lead.score || 0;
      if (score <= 20) scoreRanges[0].count++;
      else if (score <= 40) scoreRanges[1].count++;
      else if (score <= 60) scoreRanges[2].count++;
      else if (score <= 80) scoreRanges[3].count++;
      else scoreRanges[4].count++;
    });
    
    return scoreRanges;
  };
  
  // Generate sales pipeline data
  const generateSalesPipelineData = () => {
    const stages = [
      { name: "New Leads", value: 0 },
      { name: "Contacted", value: 0 },
      { name: "Qualified", value: 0 },
      { name: "Proposal", value: 0 },
      { name: "Negotiation", value: 0 },
      { name: "Closed Won", value: 0 }
    ];
    
    leads.forEach(lead => {
      const status = lead.status || "New";
      switch (status) {
        case "New": stages[0].value++; break;
        case "Contacted": stages[1].value++; break;
        case "Qualified": stages[2].value++; break;
        case "Proposal": stages[3].value++; break;
        case "Negotiation": stages[4].value++; break;
        case "Closed": stages[5].value++; break;
      }
    });
    
    return stages;
  };
  
  const leadScoreData = generateLeadScoreData();
  const salesPipelineData = generateSalesPipelineData();

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <div className="flex items-center gap-2">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLeads}</div>
              <div className="text-sm text-green-500">+12.5% from last period</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate}%</div>
              <div className="text-sm text-green-500">+3.2% from last period</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Avg. Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.responseTime}h</div>
              <div className="text-sm text-green-500">-0.4h from last period</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Avg. Lead Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgScore}/100</div>
              <div className="text-sm text-green-500">+5 from last period</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="performance">
          <TabsList className="mb-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="sources">Lead Sources</TabsTrigger>
            <TabsTrigger value="pipeline">Sales Pipeline</TabsTrigger>
            <TabsTrigger value="scores">Lead Scores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Lead Generation & Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">Loading data...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={performanceData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="leads" name="Total Leads" fill="#8884d8" />
                        <Bar dataKey="conversions" name="Conversions" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">Loading data...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sourceData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {sourceData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}`, 'Leads']} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Conversion Rate Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">Loading data...</div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={performanceData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip formatter={(value) => {
                            if (typeof value === 'number') {
                              return [`${value.toFixed(1)}%`, 'Conversion Rate'];
                            }
                            return [`${value}%`, 'Conversion Rate'];
                          }} />
                          <Line type="monotone" dataKey="rate" name="Conversion Rate %" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="pipeline">
            <Card>
              <CardHeader>
                <CardTitle>Sales Pipeline Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">Loading data...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={salesPipelineData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Bar dataKey="value" name="Leads Count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="scores">
            <Card>
              <CardHeader>
                <CardTitle>Lead Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">Loading data...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={leadScoreData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="score" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" name="Leads Count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Analytics;
