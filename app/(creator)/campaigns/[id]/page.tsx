"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Sparkles,
  Eye,
  DollarSign,
  Package,
  TrendingUp,
  Link2,
  Edit,
  Play,
  Pause,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Campaign = {
  id: string;
  name: string;
  status: string;
  product: {
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string | null;
  };
  drop: {
    id: string;
    currentOrders: number;
    minOrders: number;
    status: string;
  } | null;
  createdAt: Date;
  copyData?: {
    headline: string;
    description: string;
    ctaText: string;
  };
};

type Order = {
  id: string;
  customerEmail: string;
  customerName: string;
  amount: string;
  status: string;
  createdAt: Date;
};

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session, status } = useSession();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && params.id) {
      fetchCampaign();
      fetchOrders();
    }
  }, [status, params.id]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data.campaign);
      } else {
        router.push("/dashboard/campaigns");
      }
    } catch (error) {
      console.error("Error fetching campaign:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}/orders`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleCopyLink = () => {
    if (!campaign) return;
    const url = `${window.location.origin}/${session?.user?.username || "preview"}/${campaign.product.name.toLowerCase().replace(/\s+/g, "-")}`;
    navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/campaigns/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchCampaign();
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          <span>Loading campaign...</span>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (!campaign) {
    return null;
  }

  const progress = campaign.drop
    ? (campaign.drop.currentOrders / campaign.drop.minOrders) * 100
    : 0;
  const progressClamped = Math.min(progress, 100);
  const totalRevenue = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, order) => sum + parseFloat(order.amount), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/campaigns")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{campaign.name}</h1>
                <p className="text-sm text-muted-foreground capitalize">{campaign.status}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Link2 className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push(`/campaigns/${campaign.id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              {campaign.status === "active" ? (
                <Button variant="outline" size="sm" onClick={() => handleStatusChange("paused")}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : campaign.status === "draft" || campaign.status === "paused" ? (
                <Button size="sm" onClick={() => handleStatusChange("active")}>
                  <Play className="h-4 w-4 mr-2" />
                  Activate
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{campaign.drop?.currentOrders || 0}</p>
                </div>
                <Package className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Goal Progress</p>
                  <p className="text-2xl font-bold">{progressClamped.toFixed(0)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">
                    {orders.length > 0 ? ((orders.filter((o) => o.status === "paid").length / orders.length) * 100).toFixed(1) : "0"}%
                  </p>
                </div>
                <Eye className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {campaign.drop && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Pre-Order Goal</h3>
                    <p className="text-sm text-muted-foreground">
                      {campaign.drop.currentOrders} of {campaign.drop.minOrders} orders
                    </p>
                  </div>
                  {progressClamped >= 100 && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Goal Reached!</span>
                    </div>
                  )}
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${progressClamped >= 100 ? "bg-green-500" : "bg-primary"}`}
                    style={{ width: `${progressClamped}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {campaign.product.imageUrl && (
                    <img
                      src={campaign.product.imageUrl}
                      alt={campaign.product.name}
                      className="w-full aspect-video object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold mb-2">{campaign.product.name}</h3>
                    <p className="text-sm text-muted-foreground">{campaign.product.description}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="text-lg font-bold">${campaign.product.price}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Copy */}
              {campaign.copyData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Copy</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Headline</label>
                      <p className="text-lg font-semibold">{campaign.copyData.headline}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Description</label>
                      <p className="text-sm">{campaign.copyData.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">CTA Button</label>
                      <Button className="w-full" disabled>
                        {campaign.copyData.ctaText}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>Manage and track customer orders</CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {orders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{order.customerName || order.customerEmail}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${order.amount}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              order.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Settings</CardTitle>
                <CardDescription>Manage campaign configuration and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Campaign Status</h3>
                  <div className="flex gap-2">
                    <Button
                      variant={campaign.status === "active" ? "default" : "outline"}
                      onClick={() => handleStatusChange("active")}
                    >
                      Active
                    </Button>
                    <Button
                      variant={campaign.status === "paused" ? "default" : "outline"}
                      onClick={() => handleStatusChange("paused")}
                    >
                      Paused
                    </Button>
                    <Button
                      variant={campaign.status === "ended" ? "default" : "outline"}
                      onClick={() => handleStatusChange("ended")}
                    >
                      Ended
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold mb-2 text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete this campaign and all associated data
                  </p>
                  <Button variant="destructive">Delete Campaign</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
