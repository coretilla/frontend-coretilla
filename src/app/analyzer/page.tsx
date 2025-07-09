"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Upload, Brain, PieChart, BarChart3, Calendar, Filter, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface SpendingData {
  category: string;
  amount: number;
  percentage: number;
  change: number;
  transactions: number;
}

export default function AnalyzerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<SpendingData[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("1M");

  // Mock analysis data
  const mockAnalysisData: SpendingData[] = [
    { category: "Food & Dining", amount: 1250.50, percentage: 32.5, change: 15.2, transactions: 45 },
    { category: "Shopping", amount: 890.25, percentage: 23.1, change: -8.3, transactions: 23 },
    { category: "Transportation", amount: 650.75, percentage: 16.9, change: 5.7, transactions: 18 },
    { category: "Entertainment", amount: 425.00, percentage: 11.0, change: 22.1, transactions: 12 },
    { category: "Bills & Utilities", amount: 380.00, percentage: 9.9, change: -2.1, transactions: 8 },
    { category: "Healthcare", amount: 245.50, percentage: 6.4, change: -15.8, transactions: 6 },
  ];

  const insights = [
    "You spent 40% more on food this month compared to last month",
    "Your transportation costs decreased by 8.3% - great job!",
    "Entertainment spending increased significantly (+22.1%)",
    "You made 45 food transactions this month, averaging $27.79 per transaction",
    "Your highest spending day was Friday with $234.50 in transactions",
  ];

  const colors = [
    "bg-red-500", "bg-blue-500", "bg-green-500", 
    "bg-yellow-500", "bg-purple-500", "bg-pink-500"
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['text/csv', 'application/json', 'text/plain'];
      if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
        toast.error("Please upload a CSV or JSON file");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to analyze");
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisData(mockAnalysisData);
      toast.success("Analysis completed successfully!");
    }, 3000);
  };

  const totalSpent = analysisData?.reduce((sum, item) => sum + item.amount, 0) || 0;
  const filteredData = analysisData?.filter(item => 
    selectedCategory === "all" || item.category === selectedCategory
  ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            <span className="font-sans font-medium">Back to Home</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2 font-sans">AI Spending Analyzer</h1>
            <p className="text-muted-foreground font-sans">
              Upload your transaction data for intelligent spending insights
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-sans flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Transaction Data
            </CardTitle>
            <CardDescription className="font-sans">
              Upload your CSV or JSON transaction file for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-sans font-medium">Select File</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept=".csv,.json"
                      onChange={handleFileUpload}
                      className="font-sans"
                    />
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    disabled={!selectedFile || isAnalyzing}
                    className="bg-primary hover:bg-primary/90 font-sans font-semibold"
                  >
                    {isAnalyzing ? "Analyzing..." : "Analyze"}
                  </Button>
                </div>
              </div>
              
              {selectedFile && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="text-sm font-sans">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </div>
                </div>
              )}

              <div className="text-sm text-muted-foreground font-sans">
                Supported formats: CSV, JSON • Max file size: 10MB
              </div>
            </div>
          </CardContent>
        </Card>

        {analysisData && (
          <>
            {/* Analysis Overview */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-sans flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Spending Analysis
                  </CardTitle>
                  <div className="flex gap-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-32 font-sans">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1W" className="font-sans">1 Week</SelectItem>
                        <SelectItem value="1M" className="font-sans">1 Month</SelectItem>
                        <SelectItem value="3M" className="font-sans">3 Months</SelectItem>
                        <SelectItem value="1Y" className="font-sans">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground font-mono">
                      ${totalSpent.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">Total Spent</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground font-mono">
                      {analysisData.reduce((sum, item) => sum + item.transactions, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">Total Transactions</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-foreground font-mono">
                      ${(totalSpent / analysisData.reduce((sum, item) => sum + item.transactions, 0)).toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground font-sans">Avg per Transaction</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Spending Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" />
                    Category Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Mock Pie Chart */}
                    <div className="h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 text-primary mx-auto mb-2" />
                        <div className="text-sm text-muted-foreground font-sans">
                          Interactive pie chart would appear here
                        </div>
                      </div>
                    </div>

                    {/* Category List */}
                    <div className="space-y-2">
                      {analysisData.map((item, index) => (
                        <div key={item.category} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted">
                          <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`} />
                          <div className="flex-1">
                            <div className="font-medium font-sans">{item.category}</div>
                            <div className="text-sm text-muted-foreground font-sans">
                              {item.transactions} transactions
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-semibold">${item.amount.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground font-sans">
                              {item.percentage}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-sans flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insights.map((insight, index) => (
                      <div key={index} className="p-4 bg-muted rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          <div className="text-sm font-sans">{insight}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis */}
            <Card className="mt-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-sans flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Detailed Analysis
                  </CardTitle>
                  <div className="flex gap-2">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48 font-sans">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-sans">All Categories</SelectItem>
                        {analysisData.map((item) => (
                          <SelectItem key={item.category} value={item.category} className="font-sans">
                            {item.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock Bar Chart */}
                  <div className="h-48 bg-muted rounded-lg flex items-end justify-center gap-4 p-4">
                    {filteredData.map((item, index) => (
                      <div key={index} className="flex flex-col items-center gap-2">
                        <div
                          className={`${colors[index % colors.length]} rounded-t-sm w-12 transition-all duration-300`}
                          style={{ height: `${(item.percentage / 100) * 120}px` }}
                        />
                        <div className="text-xs text-muted-foreground font-sans text-center">
                          {item.category.split(' ')[0]}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Category Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredData.map((item, index) => (
                      <div key={item.category} className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                          <div className="font-medium font-sans">{item.category}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-xl font-bold font-mono">${item.amount.toLocaleString()}</div>
                          <div className="flex items-center gap-1 text-sm">
                            {item.change > 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span className={`font-mono ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                            </span>
                            <span className="text-muted-foreground font-sans">vs last month</span>
                          </div>
                          <div className="text-sm text-muted-foreground font-sans">
                            {item.transactions} transactions
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}