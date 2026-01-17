/**
 * Results Visualization Component
 * ================================
 * Charts and graphs for visualizing AI-generated business insights.
 */

import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, DollarSign, Calendar } from "lucide-react";

interface FeasibilityScore {
  label: string;
  value: number;
  description: string;
}

interface RoadmapStep {
  phase: string;
  title: string;
  description: string;
  timeframe: string;
}

interface RevenueSimulation {
  year1RevenueMin: number;
  year1RevenueMax: number;
  year1ProfitMin: number;
  year1ProfitMax: number;
}

interface ResultsVisualizationProps {
  feasibilityScores: FeasibilityScore[];
  roadmap: RoadmapStep[];
  revenueSimulation?: RevenueSimulation;
  budgetSuitability?: string;
}

// Color palette matching the botanical theme
const COLORS = {
  sage: "#87A878",
  forest: "#2D5A3D",
  cream: "#F5F0E8",
  terracotta: "#C4846C",
  gold: "#D4A853",
  muted: "#6B7280",
};

const CHART_COLORS = [COLORS.sage, COLORS.forest, COLORS.terracotta, COLORS.gold];

const ResultsVisualization = ({
  feasibilityScores,
  roadmap,
  revenueSimulation,
  budgetSuitability,
}: ResultsVisualizationProps) => {
  // Transform feasibility scores for radar chart
  const radarData = feasibilityScores.map((score) => ({
    subject: score.label,
    value: score.value,
    fullMark: 100,
  }));

  // Transform for bar chart
  const barData = feasibilityScores.map((score) => ({
    name: score.label.split(" ")[0], // First word only for compact display
    score: score.value,
    fill: score.value >= 80 ? COLORS.sage : score.value >= 60 ? COLORS.gold : COLORS.terracotta,
  }));

  // Revenue projection data (monthly breakdown estimate)
  const revenueProjection = revenueSimulation
    ? [
        { month: "M1", revenue: 0, profit: 0 },
        { month: "M2", revenue: Math.round(revenueSimulation.year1RevenueMin * 0.02), profit: 0 },
        { month: "M3", revenue: Math.round(revenueSimulation.year1RevenueMin * 0.05), profit: Math.round(revenueSimulation.year1ProfitMin * 0.02) },
        { month: "M4", revenue: Math.round(revenueSimulation.year1RevenueMin * 0.08), profit: Math.round(revenueSimulation.year1ProfitMin * 0.05) },
        { month: "M5", revenue: Math.round(revenueSimulation.year1RevenueMin * 0.12), profit: Math.round(revenueSimulation.year1ProfitMin * 0.08) },
        { month: "M6", revenue: Math.round(revenueSimulation.year1RevenueMax * 0.15), profit: Math.round(revenueSimulation.year1ProfitMin * 0.12) },
        { month: "M7", revenue: Math.round(revenueSimulation.year1RevenueMax * 0.18), profit: Math.round(revenueSimulation.year1ProfitMax * 0.14) },
        { month: "M8", revenue: Math.round(revenueSimulation.year1RevenueMax * 0.22), profit: Math.round(revenueSimulation.year1ProfitMax * 0.18) },
        { month: "M9", revenue: Math.round(revenueSimulation.year1RevenueMax * 0.28), profit: Math.round(revenueSimulation.year1ProfitMax * 0.22) },
        { month: "M10", revenue: Math.round(revenueSimulation.year1RevenueMax * 0.35), profit: Math.round(revenueSimulation.year1ProfitMax * 0.28) },
        { month: "M11", revenue: Math.round(revenueSimulation.year1RevenueMax * 0.45), profit: Math.round(revenueSimulation.year1ProfitMax * 0.38) },
        { month: "M12", revenue: Math.round(revenueSimulation.year1RevenueMax * 0.6), profit: Math.round(revenueSimulation.year1ProfitMax * 0.5) },
      ]
    : [];

  // Roadmap timeline data
  const timelineData = roadmap.map((step, index) => ({
    name: step.phase,
    duration: index + 1,
    title: step.title,
  }));

  // Budget allocation pie chart (estimated)
  const budgetAllocation = [
    { name: "Marketing", value: 30, color: COLORS.sage },
    { name: "Operations", value: 25, color: COLORS.forest },
    { name: "Technology", value: 20, color: COLORS.terracotta },
    { name: "Reserve", value: 15, color: COLORS.gold },
    { name: "Other", value: 10, color: COLORS.muted },
  ];

  // Calculate overall score
  const overallScore = Math.round(
    feasibilityScores.reduce((acc, score) => acc + score.value, 0) / feasibilityScores.length
  );

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="font-serif text-2xl font-semibold text-foreground mb-2">
          Visual Analysis
        </h3>
        <p className="text-muted-foreground text-sm">
          Data-driven insights for your business idea
        </p>
      </motion.div>

      {/* Overall Score Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-sage/10 to-forest/10 border-sage/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Overall Feasibility Score</p>
                <p className="text-4xl font-bold text-forest">{overallScore}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {overallScore >= 80
                    ? "Excellent potential"
                    : overallScore >= 60
                    ? "Good potential with manageable challenges"
                    : "Consider refining your approach"}
                </p>
              </div>
              <div className="w-24 h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { value: overallScore, fill: COLORS.sage },
                        { value: 100 - overallScore, fill: "#e5e7eb" },
                      ]}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      startAngle={90}
                      endAngle={-270}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Radar Chart - Feasibility Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-sage" />
                Feasibility Radar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#6B7280", fontSize: 11 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: "#9CA3AF", fontSize: 10 }}
                    />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke={COLORS.forest}
                      fill={COLORS.sage}
                      fillOpacity={0.5}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bar Chart - Score Comparison */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-sage" />
                Score Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11 }}
                      width={70}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Score"]}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Revenue Projection Chart */}
        {revenueSimulation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-sage" />
                  Revenue Projection (Year 1)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueProjection}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
                        stroke={COLORS.sage}
                        fill={COLORS.sage}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="profit"
                        name="Profit"
                        stroke={COLORS.forest}
                        fill={COLORS.forest}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  * Estimates based on typical growth patterns. Actual results may vary.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Budget Allocation Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sage" />
                Suggested Budget Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetAllocation}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {budgetAllocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${value}%`, "Allocation"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Timeline Visual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Implementation Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center overflow-x-auto pb-4">
              {roadmap.map((step, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center min-w-[120px] relative"
                >
                  {/* Connection line */}
                  {index < roadmap.length - 1 && (
                    <div className="absolute top-4 left-1/2 w-full h-0.5 bg-sage/30" />
                  )}
                  {/* Circle */}
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium z-10"
                    style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                  >
                    {index + 1}
                  </div>
                  {/* Content */}
                  <div className="mt-3 text-center">
                    <p className="text-xs font-medium text-foreground">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.timeframe}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResultsVisualization;
