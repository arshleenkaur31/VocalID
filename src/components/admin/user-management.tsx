"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserPlus, Settings, Trash2, Shield, AlertTriangle } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  status: "active" | "inactive" | "suspended"
  voiceProfiles: number
  lastLogin: string
  joinedDate: string
  totalAuthentications: number
  successRate: number
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockUsers: User[] = Array.from({ length: 20 }, (_, i) => ({
        id: `user_${i + 1}`,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: Math.random() > 0.1 ? "active" : Math.random() > 0.5 ? "inactive" : "suspended",
        voiceProfiles: Math.floor(Math.random() * 3) + 1,
        lastLogin: new Date(Date.now() - Math.random() * 30 * 24 * 3600000).toISOString(),
        joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 3600000).toISOString(),
        totalAuthentications: Math.floor(Math.random() * 500) + 10,
        successRate: 85 + Math.random() * 15,
      }))
      setUsers(mockUsers)
    } catch (error) {
      console.error("Failed to load users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="font-open-sans">Active</Badge>
      case "inactive":
        return (
          <Badge variant="secondary" className="font-open-sans">
            Inactive
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="destructive" className="font-open-sans">
            Suspended
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="font-open-sans">
            Unknown
          </Badge>
        )
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-open-sans">Loading users...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-montserrat font-bold">User Management</CardTitle>
              <CardDescription className="font-open-sans">Manage user accounts and monitor activity</CardDescription>
            </div>
            <Button className="font-open-sans font-medium">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm font-open-sans"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-montserrat font-bold">User</TableHead>
                <TableHead className="font-montserrat font-bold">Status</TableHead>
                <TableHead className="font-montserrat font-bold">Profiles</TableHead>
                <TableHead className="font-montserrat font-bold">Success Rate</TableHead>
                <TableHead className="font-montserrat font-bold">Last Login</TableHead>
                <TableHead className="font-montserrat font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-open-sans font-medium">{user.name}</p>
                      <p className="text-sm font-open-sans text-muted-foreground">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="font-open-sans">{user.voiceProfiles}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-open-sans">{user.successRate.toFixed(1)}%</span>
                      {user.successRate < 90 && <AlertTriangle className="h-4 w-4 text-accent" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-open-sans text-sm">{new Date(user.lastLogin).toLocaleDateString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" className="font-open-sans bg-transparent">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="font-open-sans bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat font-bold">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black font-montserrat text-primary">
              {users.filter((u) => u.status === "active").length}
            </div>
            <p className="text-sm font-open-sans text-muted-foreground">
              {((users.filter((u) => u.status === "active").length / users.length) * 100).toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat font-bold">Suspended Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black font-montserrat text-destructive">
              {users.filter((u) => u.status === "suspended").length}
            </div>
            <p className="text-sm font-open-sans text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-montserrat font-bold">Total Voice Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black font-montserrat">
              {users.reduce((sum, user) => sum + user.voiceProfiles, 0)}
            </div>
            <p className="text-sm font-open-sans text-muted-foreground">Across all users</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
