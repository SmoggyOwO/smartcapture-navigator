
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, PieChart, Pie, Cell } from "recharts";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, DollarSign, LineChart as LineChartIcon, Users } from "lucide-react";

const monthlyData = [
  { name: "Jan", leads: 400, converted: 240 },
  { name: "Feb", leads: 300, converted: 139 },
  { name: "Mar", leads: 200, converted: 80 },
  { name: "Apr", leads: 278, converted: 150 },
  { name: "May", leads: 189, converted: 80 },
  { name: "Jun", leads: 239, converted: 110 },
  { name: "Jul", leads: 349, converted: 180 },
];

const weeklyData = [
  { name: "Mon", leads: 45, converted: 22 },
  { name: "Tue", leads: 52, converted: 28 },
  { name: "Wed", leads: 38, converted: 15 },
  { name: "Thu", leads: 60, converted: 32 },
  { name: "Fri", leads: 42, converted: 18 },
  { name: "Sat", leads: 28, converted: 12 },
  { name: "Sun", leads: 20, converted: 8 },
];

const sourceData = [
  { name: "Website", value: 40 },
  { name: "Referral", value: 30 },
  { name: "Social Media", value: 20 },
  { name: "Email", value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const upcomingTasks = [
  { id: 1, title: "Follow up with John Smith", date: "Today, 2:00 PM" },
  { id: 2, title: "Send proposal to TechCorp", date: "Tomorrow, 10:00 AM" },
  { id: 3, title: "Call Michael Brown", date: "Jul 22, 11:30 AM" },
  { id: 4, title: "Meeting with Acme Inc.", date: "Jul 24, 3:00 PM" },
];

const recentLeads = [
  { id: 1, name: "Alex Johnson", company: "Future Tech", date: "Jul 20", status: "New" },
  { id: 2, name: "Maria Rodriguez", company: "Insight Solutions", date: "Jul 19", status: "Contacted" },
  { id: 3, name: "James Wilson", company: "Global Systems", date: "Jul 18", status: "Qualified" },
];

const statsCards = [
  { 
    title: "Total Leads", 
    value: "3,246", 
    trend: "+12.5%", 
    icon: <Users className="h-5 w-5 text-blue-600" />
  },
  { 
    title: "Conversion Rate", 
    value: "42.3%", 
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
    title: "Revenue Pipeline", 
    value: "$1.2M", 
    trend: "+15.6%", 
    icon: <DollarSign className="h-5 w-5 text-yellow-600" />
  },
];

const Dashboard = () => {
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
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="leads" name="Total Leads" fill="#8884d8" />
                      <Bar dataKey="converted" name="Converted" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
                <TabsContent value="weekly">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="leads" name="Total Leads" fill="#8884d8" />
                      <Bar dataKey="converted" name="Converted" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources</CardTitle>
            </CardHeader>
            <CardContent>
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
                {upcomingTasks.map(task => (
                  <div key={task.id} className="flex justify-between items-center pb-2 border-b last:border-0">
                    <div>
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.date}</div>
                    </div>
                    <div>
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLeads.map(lead => (
                  <div key={lead.id} className="flex justify-between items-center pb-2 border-b last:border-0">
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.company}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{lead.date}</div>
                      <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">{lead.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
