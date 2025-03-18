
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/ProtectedRoute";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addLead, getAllLeads } from "@/services/api";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [backendMessage, setBackendMessage] = useState("");
  const [leads, setLeads] = useState<any[]>([]);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Call login method from auth context
    const success = login(loginEmail, loginPassword);
    
    if (success) {
      toast({
        title: "Success",
        description: "You have been logged in successfully"
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Invalid email or password",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simple validation
    if (!registerName || !registerEmail || !registerPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    if (registerPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Call register method from auth context
    const success = register(registerName, registerEmail, registerPassword);
    
    if (success) {
      toast({
        title: "Success",
        description: "Your account has been created successfully"
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Failed to create account",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  // Test the Python backend connection
  const testBackendConnection = async () => {
    setBackendStatus("loading");
    setBackendMessage("");
    
    try {
      // Test adding a lead
      const newLead = {
        name: registerName || "Test User",
        email: registerEmail || `test${Date.now()}@example.com`,
        budget: 50000
      };
      
      const result = await addLead(newLead);
      
      if (result.error) {
        setBackendStatus("error");
        setBackendMessage(result.error);
      } else {
        // If lead was added successfully, fetch all leads
        const allLeads = await getAllLeads();
        setLeads(allLeads);
        setBackendStatus("success");
        setBackendMessage("Backend connection successful!");
      }
    } catch (error) {
      setBackendStatus("error");
      setBackendMessage("Error connecting to backend. Make sure your FastAPI server is running.");
      console.error("Backend connection error:", error);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">CRM System</CardTitle>
          <CardDescription>Sign in to access your account</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Forgot?</a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Full Name</label>
                  <Input 
                    id="name" 
                    placeholder="John Smith" 
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="register-email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="register-email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="register-password" className="text-sm font-medium">Password</label>
                  <Input 
                    id="register-password" 
                    type="password" 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">Must be at least 6 characters</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="px-6 pb-6">
          <p className="text-center text-sm text-gray-500 mt-4">
            Demo credentials: <span className="font-semibold">admin@example.com / password</span>
          </p>
          
          <div className="mt-6 border-t pt-4">
            <p className="text-sm font-medium mb-2">Test Backend Connection</p>
            <Button 
              onClick={testBackendConnection} 
              variant="outline" 
              className="w-full"
              disabled={backendStatus === "loading"}
            >
              {backendStatus === "loading" ? "Testing connection..." : "Test Python Backend"}
            </Button>
            
            {backendStatus !== "idle" && (
              <div className={`mt-3 p-3 rounded text-sm ${
                backendStatus === "success" ? "bg-green-100 text-green-800" : 
                backendStatus === "error" ? "bg-red-100 text-red-800" : ""
              }`}>
                <p>{backendMessage}</p>
                
                {backendStatus === "success" && leads.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium">Found {leads.length} leads in database:</p>
                    <ul className="mt-1 list-disc pl-5">
                      {leads.slice(0, 3).map((lead, index) => (
                        <li key={index}>{lead.name} ({lead.email})</li>
                      ))}
                      {leads.length > 3 && <li>...and {leads.length - 3} more</li>}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
