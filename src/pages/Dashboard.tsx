
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Layout } from "@/components/Layout";

const data = [
  { name: "Jan", leads: 400, converted: 240 },
  { name: "Feb", leads: 300, converted: 139 },
  { name: "Mar", leads: 200, converted: 80 },
  { name: "Apr", leads: 278, converted: 150 },
  { name: "May", leads: 189, converted: 80 },
  { name: "Jun", leads: 239, converted: 110 },
  { name: "Jul", leads: 349, converted: 180 },
];

const statsCards = [
  { title: "Total Leads", value: "3,246", trend: "+12.5%" },
  { title: "Conversion Rate", value: "42.3%", trend: "+3.2%" },
  { title: "Avg. Response Time", value: "2.4h", trend: "-18%" },
  { title: "Lead Quality Score", value: "7.8/10", trend: "+0.6" },
];

const Dashboard = () => {
  return (
    <Layout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{card.title}</CardTitle>
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
        
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Lead Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" name="Total Leads" fill="#8884d8" />
                <Bar dataKey="converted" name="Converted" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
