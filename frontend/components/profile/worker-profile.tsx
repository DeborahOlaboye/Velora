"use client";

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Edit, Save, X } from "lucide-react";

interface WorkerProfileData {
  address: string;
  isVerified: boolean;
  gigWorkType: string;
  location: string;
  yearsExperience: number;
  totalContributions: string;
  numberOfContributions: number;
  lastContributionDate: string;
  withdrawalCount: number;
  registrationDate: string;
}

// Mock data - replace with actual data from smart contract/database
const mockProfileData: WorkerProfileData = {
  address: "0x1234...5678",
  isVerified: true,
  gigWorkType: "Ride-share Driver",
  location: "San Francisco, USA",
  yearsExperience: 3,
  totalContributions: "120.50",
  numberOfContributions: 24,
  lastContributionDate: "2025-11-01",
  withdrawalCount: 0,
  registrationDate: "2025-01-15",
};

export function WorkerProfile() {
  const account = useActiveAccount();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<WorkerProfileData>(mockProfileData);

  if (!account) {
    return (
      <Alert>
        <AlertDescription>
          Please connect your wallet to view your profile
        </AlertDescription>
      </Alert>
    );
  }

  const handleSave = () => {
    // TODO: Save to database/smart contract
    console.log("Saving profile:", profileData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                Worker Profile
                {profileData.isVerified && (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                )}
              </CardTitle>
              <CardDescription>
                View and manage your worker profile information
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  size="sm"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Wallet Address</Label>
              <p className="text-sm font-mono bg-gray-50 p-2 rounded">
                {account.address}
              </p>
            </div>

            <div>
              <Label>Verification Status</Label>
              <div className="flex items-center gap-2 mt-2">
                {profileData.isVerified ? (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <span className="text-sm text-green-600">Verified with Self Protocol</span>
                  </>
                ) : (
                  <span className="text-sm text-red-600">Not Verified</span>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="gigWorkType">Gig Work Type</Label>
              {isEditing ? (
                <Input
                  id="gigWorkType"
                  value={profileData.gigWorkType}
                  onChange={(e) =>
                    setProfileData({ ...profileData, gigWorkType: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm mt-2">{profileData.gigWorkType}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              {isEditing ? (
                <Input
                  id="location"
                  value={profileData.location}
                  onChange={(e) =>
                    setProfileData({ ...profileData, location: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm mt-2">{profileData.location}</p>
              )}
            </div>

            <div>
              <Label>Registration Date</Label>
              <p className="text-sm mt-2">
                {new Date(profileData.registrationDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <Label>Years of Experience</Label>
              <p className="text-sm mt-2">{profileData.yearsExperience} years</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contribution Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Contribution Statistics</CardTitle>
          <CardDescription>Your participation in the benefits pool</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Contributions</p>
              <p className="text-2xl font-bold text-blue-600">
                {profileData.totalContributions} cUSD
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Number of Contributions</p>
              <p className="text-2xl font-bold text-green-600">
                {profileData.numberOfContributions}
              </p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Emergency Withdrawals</p>
              <p className="text-2xl font-bold text-purple-600">
                {profileData.withdrawalCount}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Label>Last Contribution Date</Label>
            <p className="text-sm mt-1">
              {new Date(profileData.lastContributionDate).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Withdrawal Eligibility</h4>
            <p className="text-sm text-gray-700">
              You can request up to <strong>{(parseFloat(profileData.totalContributions) * 0.5).toFixed(2)} cUSD</strong> as an emergency withdrawal (50% of your total contributions).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contribution History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contributions</CardTitle>
          <CardDescription>Your latest contributions to the pool</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Mock contribution history */}
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex justify-between items-center p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="text-sm font-semibold">Monthly Contribution</p>
                  <p className="text-xs text-gray-600">
                    {new Date(2025, 10 - item, 1).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">+5.00 cUSD</p>
                  <p className="text-xs text-gray-600">Confirmed</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
