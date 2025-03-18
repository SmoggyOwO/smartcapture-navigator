
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Plus, List, Grid } from "lucide-react";

// Sample data
const leadsData = [
  { id: 1, name: "John Smith", email: "john@example.com", source: "Website", score: 85, status: "New" },
  { id: 2, name: "Emily Johnson", email: "emily@example.com", source: "Referral", score: 92, status: "Contacted" },
  { id: 3, name: "Michael Brown", email: "michael@example.com", source: "LinkedIn", score: 78, status: "Qualified" },
  { id: 4, name: "Sarah Williams", email: "sarah@example.com", source: "Email Campaign", score: 65, status: "New" },
  { id: 5, name: "David Miller", email: "david@example.com", source: "Trade Show", score: 73, status: "Disqualified" },
  { id: 6, name: "Jessica Wilson", email: "jessica@example.com", source: "Website", score: 81, status: "Contacted" },
  { id: 7, name: "Robert Taylor", email: "robert@example.com", source: "Advertisement", score: 69, status: "New" },
  { id: 8, name: "Jennifer Garcia", email: "jennifer@example.com", source: "Webinar", score: 88, status: "Qualified" },
];

const Leads = () => {
  const [viewMode, setViewMode] = useState<"table" | "card">("table");

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

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Leads</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Lead
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="search" 
              placeholder="Search leads..." 
              className="pl-8 w-full md:max-w-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
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

        {viewMode === "table" ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadsData.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>
                      <span className={getScoreColor(lead.score)}>{lead.score}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leadsData.map((lead) => (
              <Card key={lead.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{lead.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">{lead.email}</div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">Source: {lead.source}</div>
                      <Badge variant="outline" className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm">Score:</div>
                      <div className={`font-medium ${getScoreColor(lead.score)}`}>{lead.score}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Leads;
