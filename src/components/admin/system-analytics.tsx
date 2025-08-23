"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const authenticationData = [
  { name: "Mon", successful: 1200, failed: 80 },
  { name: "Tue", successful: 1350, failed: 95 },
  { name: "Wed", successful: 1180, failed: 70 },
  { name: "Thu", successful: 1420, failed: 110 },
  { name: "Fri", successful: 1650, failed: 85 },
  { name: "Sat", successful: 980, failed: 45 },
  { name: "Sun", successful: 850, failed: 35 },
]

const performanceData = [
  { time: "00:00", responseTime: 1.2, throughput: 450 },
  { time: "04:00", responseTime: 0.9, throughput: 320 },
  { time: "08:00", responseTime: 1.8, throughput: 1200 },
  { time: "12:00", responseTime: 2.1, throughput: 1450 },
  { time: "16:00", responseTime: 1.9, throughput: 1380 },
  { time: "20:00", responseTime: 1.4, throughput: 980 },
]

const securityData = [
  { name: "Successful", value: 94.8, color: "#15803d" },
  { name: "Failed Auth", value: 3.2, color: "#ea580c" },
  { name: "Blocked", value: 2.0, color: "#84cc16" },
]

export function SystemAnalytics() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="authentication" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="authentication" className="font-open-sans">
            Authentication
          </TabsTrigger>
          <TabsTrigger value="performance" className="font-open-sans">
            Performance
          </TabsTrigger>
          <TabsTrigger value="security" className="font-open-sans">
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="authentication" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat font-bold">Authentication Trends</CardTitle>
              <CardDescription className="font-open-sans">
                Daily authentication attempts over the past week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={authenticationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="successful" fill="#15803d" name="Successful" />
                  <Bar dataKey="failed" fill="#ea580c" name="Failed" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Peak Hour</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black font-montserrat">2:00 PM</div>
                <p className="text-sm font-open-sans text-muted-foreground">1,650 authentications</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Average Daily</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black font-montserrat">1,247</div>
                <p className="text-sm font-open-sans text-muted-foreground">Authentications per day</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black font-montserrat text-primary">+12.5%</div>
                <p className="text-sm font-open-sans text-muted-foreground">vs last week</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat font-bold">System Performance</CardTitle>
              <CardDescription className="font-open-sans">Response time and throughput over 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="responseTime"
                    stroke="#15803d"
                    name="Response Time (s)"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="throughput"
                    stroke="#84cc16"
                    name="Throughput (req/min)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Avg Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black font-montserrat">1.2s</div>
                <p className="text-sm font-open-sans text-muted-foreground">Authentication time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Peak Throughput</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black font-montserrat">1,450</div>
                <p className="text-sm font-open-sans text-muted-foreground">Requests per minute</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">CPU Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black font-montserrat">68%</div>
                <p className="text-sm font-open-sans text-muted-foreground">Average load</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black font-montserrat">4.2GB</div>
                <p className="text-sm font-open-sans text-muted-foreground">of 8GB available</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-montserrat font-bold">Security Overview</CardTitle>
              <CardDescription className="font-open-sans">Authentication results distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={securityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {securityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Threat Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black font-montserrat text-primary">Low</div>
                <p className="text-sm font-open-sans text-muted-foreground">Current security status</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">Blocked Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black font-montserrat">247</div>
                <p className="text-sm font-open-sans text-muted-foreground">Last 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-montserrat font-bold">False Positives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black font-montserrat">0.8%</div>
                <p className="text-sm font-open-sans text-muted-foreground">Detection accuracy</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
