
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, DollarSign, LineChart as LineChartIcon, Users } from "lucide-react";
import { getAllLeads, getLeadsBySource, getConversionRateData, Lead, Activity } from "@/services/api";
import { useNavigate } from "react-router-dom";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sourceData, setSourceData] = useState<{name: string, value: number}[]>([]);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate stats
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(lead => lead.status === "Qualified").length;
  const conversionRate = totalLeads > 0 ? (qualifiedLeads / totalLeads * 100).toFixed(1) : "0.0";
  const avgBudget = leads.length > 0 
    ? (leads.reduce((sum, lead) => sum + (lead.budget || 0), 0) / leads.length).toFixed(0) 
    : "0";
  
  // Generate recent leads
  const recentLeads = [...leads]
    .sort((a, b) => {
      const dateA = a.lastContact ? new Date(a.lastContact).getTime() : 0;
      const dateB = b.lastContact ? new Date(b.lastContact).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);
  
  // Generate upcoming tasks by extracting from activities
  const allActivities: Activity[] = [];
  leads.forEach(lead => {
    if (lead.activities) {
      lead.activities.forEach(activity => {
        allActivities.push({
          ...activity,
          leadName: lead.name,
          leadId: lead.id
        } as any);
      });
    }
  });
  
  const upcomingTasks = allActivities
    .filter(activity => {
      // Only include future or recent activities
      const activityDate = new Date(activity.date);
      const now = new Date();
      const diffTime = activityDate.getTime() - now.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      return diffDays >= -1 && diffDays <= 14; // Include yesterday's activities and up to 2 weeks in the future
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  const statsCards = [
    { 
      title: "Total Leads", 
      value: totalLeads.toString(), 
      trend: "+12.5%", 
      icon: <Users className="h-5 w-5 text-blue-600" />
    },
    { 
      title: "Conversion Rate", 
      value: `${conversionRate}%`, 
      trend: "+3.2%", 
      icon: <LineChartIcon className="h-5 w-5 text-green-600" />
    },
    { 
      title: "Avg. Response Time", 
      value: "2.4h", 
      trend: "-18%", 
      icon: <CalendarDays className="h-5 w-5 text-purple-600" />
    },
    { 
      title: "Avg. Deal Size", 
      value: `$${Number(avgBudget).toLocaleString()}`, 
      trend: "+5.3%", 
      icon: <DollarSign className="h-5 w-5 text-yellow-600" />
    },
  ];

  // Handle lead click
  const handleLeadClick = (leadId: number) => {
    navigate(`/leads/${leadId}`);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card, index) => (
            <Card key={index} className="hover:shadow-md transition-all">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-bold">{card.value}</div>
                  <div className={`text-sm ${card.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {card.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Lead Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="monthly">
                <TabsList className="mb-3">
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="monthly">
                  {isLoading ? (
                    <div className="h-300 flex items-center justify-center">Loading data...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="leads" name="Total Leads" fill="#8884d8" />
                        <Bar dataKey="conversions" name="Converted" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </TabsContent>
                <TabsContent value="weekly">
                  {isLoading ? (
                    <div className="h-300 flex items-center justify-center">Loading data...</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={performanceData.slice(-7)}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="leads" name="Total Leads" fill="#8884d8" />
                        <Bar dataKey="conversions" name="Converted" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-300 flex items-center justify-center">Loading data...</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
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
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map((task, index) => {
                    let displayDate = task.date;
                    // Format date as "Today", "Tomorrow" or actual date
                    const taskDate = new Date(task.date);
                    const today = new Date();
                    const tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1);
                    
                    if (taskDate.toDateString() === today.toDateString()) {
                      displayDate = "Today";
                    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
                      displayDate = "Tomorrow";
                    } else {
                      displayDate = taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }
                    
                    return (
                      <div 
                        key={index} 
                        className="flex justify-between items-center pb-2 border-b last:border-0 cursor-pointer hover:bg-gray-50"
                        onClick={() => task.leadId && handleLeadClick(task.leadId)}
                      >
                        <div>
                          <div className="font-medium">{`${task.type}: ${(task as any).leadName || ""}`}</div>
                          <div className="text-sm text-gray-500">{task.description}</div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {displayDate}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500">No upcoming tasks</div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeads.length > 0 ? (
                  recentLeads.map((lead) => {
                    // Format date
                    let displayDate = lead.lastContact || "";
                    if (lead.lastContact) {
                      const contactDate = new Date(lead.lastContact);
                      displayDate = contactDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }
                    
                    return (
                      <div 
                        key={lead.id} 
                        className="flex justify-between items-center pb-2 border-b last:border-0 cursor-pointer hover:bg-gray-50"
                        onClick={() => lead.id && handleLeadClick(lead.id)}
                      >
                        <div>
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-gray-500">{lead.company || "Unknown Company"}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{displayDate}</div>
                          <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">{lead.status || "New"}</div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-gray-500">No recent leads</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
