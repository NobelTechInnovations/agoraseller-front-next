'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { MoreHorizontal, Check, X, FileText, Eye } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function DriversPage() {
  const router = useRouter();
  const [drivers, setDrivers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      status: "pending",
      vehicleType: "Car",
      licenseNumber: "DL123456",
    },
    {
      id: 2,
      name: "Sarah Smith",
      email: "sarah@example.com",
      phone: "+1987654321",
      status: "approved",
      vehicleType: "Van",
      licenseNumber: "DL789012",
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael@example.com",
      phone: "+1122334455",
      status: "rejected",
      vehicleType: "Truck",
      licenseNumber: "DL345678",
    },
    {
      id: 4,
      name: "Emily Brown",
      email: "emily@example.com",
      phone: "+1555666777",
      status: "review",
      vehicleType: "Car",
      licenseNumber: "DL901234",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david@example.com",
      phone: "+1888999000",
      status: "pending",
      vehicleType: "Van",
      licenseNumber: "DL567890",
    }
  ]);

  const handleViewDetails = (driverId) => {
    router.push(`/admin/dashboard/drivers/${driverId}`);
  };

  const handleApprove = async (driverId) => {
    // Implement approve logic
    console.log('Approving driver:', driverId);
  };

  const handleReject = async (driverId) => {
    // Implement reject logic
    console.log('Rejecting driver:', driverId);
  };

  const handleSendContract = async (driverId) => {
    // Implement send contract logic
    console.log('Sending contract to driver:', driverId);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      review: "bg-blue-100 text-blue-800",
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Vehicle Type</TableHead>
              <TableHead>Vehicle Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.email}</TableCell>
                <TableCell>{driver.phone}</TableCell>
                <TableCell>{driver.vehicleType}</TableCell>
                <TableCell>{driver.licenseNumber}</TableCell>
                <TableCell>{getStatusBadge(driver.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(driver.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    {driver.status === 'pending' && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApprove(driver.id)}
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReject(driver.id)}
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSendContract(driver.id)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(driver.id)}>
                          View Full Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSendContract(driver.id)}>
                          Send Contract
                        </DropdownMenuItem>
                        {driver.status === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(driver.id)}>
                              Approve Driver
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(driver.id)}>
                              Reject Driver
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
