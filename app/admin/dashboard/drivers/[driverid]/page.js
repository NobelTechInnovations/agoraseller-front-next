'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { ArrowLeft, Check, X, FileText, Mail, Phone, Car, User, Calendar, MapPin, CreditCard, Users, Shield } from "lucide-react";

export default function DriverDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const driverId = params.driverid;

  // Static driver data based on the API response
  const driverData = {
    driver: {
      id: "6804b7b6928080ca9424a8c6",
      fullName: "test",
      phoneNumber: "1212121212",
      email: "test@test.vg",
      isVerified: true,
      accountStatus: "active",
      currentStep: 5,
      stepsCompleted: {
        personalDetails: true,
        documentVerification: true,
        vehicleDetails: true,
        bankDetails: true,
        emergencyContact: true
      },
      registrationComplete: true
    },
    personalDetails: {
      address: "test",
      city: "test",
      state: "test",
      pincode: "202020",
      profileImage: "",
      alternativePhone: ""
    },
    documentDetails: {
      aadharNumber: "121212112121",
      panNumber: "FQQPS8010F",
      drivingLicenseNumber: "4354657864747647",
      verificationStatus: "pending",
      aadharFrontImage: "",
      aadharBackImage: "",
      panImage: "",
      drivingLicenseFrontImage: "",
      drivingLicenseBackImage: ""
    },
    vehicleDetails: {
      vehicleType: "bike",
      vehicleNumber: "56841584",
      vehicleModel: "2020",
      vehicleYear: "2020",
      vehicleColor: "Black",
      registrationCertificate: "",
      insuranceDocument: "",
      verificationStatus: "pending"
    },
    bankDetails: {
      accountHolderName: "Test",
      accountNumber: "58647186541",
      ifscCode: "KGHK0000250",
      bankName: "test",
      branchName: "test",
      cancelledChequeImage: "",
      bankStatementImage: "",
      verificationStatus: "pending"
    },
    emergencyContact: {
      name: "test",
      phoneNumber: "8654168542",
      relationship: "terst",
      alternateContact: {
        name: "",
        phoneNumber: "",
        relationship: ""
      }
    }
  };

  const handleApprove = () => {
    console.log('Approving driver:', driverId);
  };

  const handleReject = () => {
    console.log('Rejecting driver:', driverId);
  };

  const handleSendContract = () => {
    console.log('Sending contract to driver:', driverId);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      review: "bg-blue-100 text-blue-800",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Drivers
        </Button>
        <h1 className="text-2xl font-bold">Driver Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Info Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Driver Information</CardTitle>
              {getStatusBadge(driverData.driver.accountStatus)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{driverData.driver.fullName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{driverData.driver.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{driverData.driver.phoneNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Verification Status</p>
                    <p className="font-medium">{driverData.driver.isVerified ? 'Verified' : 'Not Verified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {driverData.driver.accountStatus === 'pending' && (
                <>
                  <Button
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleApprove}
                  >
                    <Check className="h-4 w-4" />
                    Approve Driver
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2"
                    onClick={handleReject}
                  >
                    <X className="h-4 w-4" />
                    Reject Driver
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleSendContract}
              >
                <FileText className="h-4 w-4" />
                Send Contract
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Personal Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{driverData.personalDetails.address}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium">{driverData.personalDetails.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">State</p>
                  <p className="font-medium">{driverData.personalDetails.state}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pincode</p>
                  <p className="font-medium">{driverData.personalDetails.pincode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Alternative Phone</p>
                  <p className="font-medium">{driverData.personalDetails.alternativePhone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Car className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Vehicle Type</p>
                  <p className="font-medium">{driverData.vehicleDetails.vehicleType}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Vehicle Number</p>
                  <p className="font-medium">{driverData.vehicleDetails.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-medium">{driverData.vehicleDetails.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium">{driverData.vehicleDetails.vehicleYear}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="font-medium">{driverData.vehicleDetails.vehicleColor}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Verification Status</p>
                {getStatusBadge(driverData.vehicleDetails.verificationStatus)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Bank Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Account Holder</p>
                  <p className="font-medium">{driverData.bankDetails.accountHolderName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Account Number</p>
                  <p className="font-medium">{driverData.bankDetails.accountNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">IFSC Code</p>
                  <p className="font-medium">{driverData.bankDetails.ifscCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bank Name</p>
                  <p className="font-medium">{driverData.bankDetails.bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Branch</p>
                  <p className="font-medium">{driverData.bankDetails.branchName}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Verification Status</p>
                {getStatusBadge(driverData.bankDetails.verificationStatus)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact Card */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Primary Contact</p>
                  <p className="font-medium">{driverData.emergencyContact.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="font-medium">{driverData.emergencyContact.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Relationship</p>
                  <p className="font-medium">{driverData.emergencyContact.relationship}</p>
                </div>
              </div>
              {driverData.emergencyContact.alternateContact.name && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Alternate Contact</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{driverData.emergencyContact.alternateContact.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">{driverData.emergencyContact.alternateContact.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Relationship</p>
                      <p className="font-medium">{driverData.emergencyContact.alternateContact.relationship}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Documents Card */}
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Aadhar Number</p>
                <p className="font-medium">{driverData.documentDetails.aadharNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">PAN Number</p>
                <p className="font-medium">{driverData.documentDetails.panNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Driving License</p>
                <p className="font-medium">{driverData.documentDetails.drivingLicenseNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Verification Status</p>
                {getStatusBadge(driverData.documentDetails.verificationStatus)}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-500">Aadhar Card</p>
                  <div className="flex gap-2">
                    {driverData.documentDetails.aadharFrontImage && (
                      <a href={driverData.documentDetails.aadharFrontImage} className="text-blue-600 hover:underline">
                        Front
                      </a>
                    )}
                    {driverData.documentDetails.aadharBackImage && (
                      <a href={driverData.documentDetails.aadharBackImage} className="text-blue-600 hover:underline">
                        Back
                      </a>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">PAN Card</p>
                  {driverData.documentDetails.panImage && (
                    <a href={driverData.documentDetails.panImage} className="text-blue-600 hover:underline">
                      View
                    </a>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Driving License</p>
                  <div className="flex gap-2">
                    {driverData.documentDetails.drivingLicenseFrontImage && (
                      <a href={driverData.documentDetails.drivingLicenseFrontImage} className="text-blue-600 hover:underline">
                        Front
                      </a>
                    )}
                    {driverData.documentDetails.drivingLicenseBackImage && (
                      <a href={driverData.documentDetails.drivingLicenseBackImage} className="text-blue-600 hover:underline">
                        Back
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
