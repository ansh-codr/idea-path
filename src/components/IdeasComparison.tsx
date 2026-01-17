/**
 * Ideas Comparison Component
 * ==========================
 * Displays top 3 business ideas with detailed comparison:
 * - Budget range
 * - Risk level & factors
 * - Competitors
 * - Revenue projections based on customer count
 */

import { motion } from "framer-motion";
import { 
  DollarSign, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Target,
  Shield,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Competitor {
  name: string;
  type: string;
  threat: string;
}

interface RevenueProjection {
  customersNeeded: number;
  avgRevenuePerCustomer: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  breakEvenMonths: number;
  assumptions: string;
}

interface IdeaDetail {
  title: string;
  description: string;
  whyItFits: string;
  localAdaptation?: string;
  budgetRange?: { min: number; max: number; currency: string };
  riskLevel?: "low" | "medium" | "high";
  riskFactors?: string[];
  competitors?: Competitor[];
  revenueProjection?: RevenueProjection;
}

interface CustomerScenario {
  customers: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

interface IdeasComparisonProps {
  ideas: IdeaDetail[];
  customerScenarios?: CustomerScenario[];
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getThreatColor = (threat: string) => {
  switch (threat) {
    case "low":
      return "text-green-600";
    case "medium":
      return "text-yellow-600";
    case "high":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};

const IdeasComparison = ({ ideas, customerScenarios }: IdeasComparisonProps) => {
  if (!ideas || ideas.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mb-4">
            Top 3 Business Ideas <span className="italic text-sage">Compared</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each idea analyzed for budget, risk, competition, and revenue potential
          </p>
        </motion.div>

        {/* Ideas Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {ideas.slice(0, 3).map((idea, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Card className={`h-full ${index === 0 ? 'ring-2 ring-sage shadow-lg' : ''}`}>
                <CardHeader className="pb-3">
                  {index === 0 && (
                    <Badge className="w-fit mb-2 bg-sage text-white">
                      Recommended
                    </Badge>
                  )}
                  <CardTitle className="text-lg font-serif">
                    {idea.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {idea.description}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Budget Range */}
                  {idea.budgetRange && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-sage mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Budget Range</p>
                        <p className="text-sm text-muted-foreground">
                          ${idea.budgetRange.min.toLocaleString()} - ${idea.budgetRange.max.toLocaleString()} {idea.budgetRange.currency}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Risk Level */}
                  {idea.riskLevel && (
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-sage mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Risk Level</p>
                        <Badge variant="outline" className={`mt-1 ${getRiskColor(idea.riskLevel)}`}>
                          {idea.riskLevel.charAt(0).toUpperCase() + idea.riskLevel.slice(1)} Risk
                        </Badge>
                        {idea.riskFactors && idea.riskFactors.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {idea.riskFactors.slice(0, 2).map((factor, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex items-start gap-1">
                                <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Competitors */}
                  {idea.competitors && idea.competitors.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Target className="w-5 h-5 text-sage mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Competitors</p>
                        <ul className="mt-1 space-y-1">
                          {idea.competitors.slice(0, 3).map((comp, i) => (
                            <li key={i} className="text-xs flex items-center gap-2">
                              <span className="text-foreground">{comp.name}</span>
                              <span className={`text-xs ${getThreatColor(comp.threat)}`}>
                                ({comp.threat} threat)
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Revenue Projection */}
                  {idea.revenueProjection && (
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-sage mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Revenue Projection</p>
                        <div className="mt-1 p-2 bg-secondary/50 rounded-lg">
                          <p className="text-xs text-muted-foreground">
                            With <span className="font-medium text-foreground">{idea.revenueProjection.customersNeeded}</span> customers:
                          </p>
                          <p className="text-lg font-semibold text-sage">
                            ${idea.revenueProjection.yearlyRevenue.toLocaleString()}/year
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ~${idea.revenueProjection.monthlyRevenue.toLocaleString()}/month
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Break-even: ~{idea.revenueProjection.breakEvenMonths} months
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Why It Fits */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground italic">
                      "{idea.whyItFits}"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Customer Scenarios Table */}
        {customerScenarios && customerScenarios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 max-w-3xl mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-sage" />
                  Revenue by Customer Count
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-3 font-medium">Customers</th>
                        <th className="text-right py-2 px-3 font-medium">Monthly Revenue</th>
                        <th className="text-right py-2 px-3 font-medium">Yearly Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerScenarios.map((scenario, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2 px-3">
                            <span className="font-medium">{scenario.customers}</span> customers
                          </td>
                          <td className="py-2 px-3 text-right text-muted-foreground">
                            ${scenario.monthlyRevenue.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-right font-medium text-sage">
                            ${scenario.yearlyRevenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  * Estimates based on average revenue per customer. Actual results may vary.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default IdeasComparison;
