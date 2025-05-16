'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "../../admin/components/ui/card";
import { Button } from "../../admin/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../admin/components/ui/table";
import Link from "next/link";
import { Icon } from '@iconify/react';
import { Eye, Search } from "lucide-react";
import axiosInstance from "../../utils/axios";
import { getSession } from "next-auth/react";

export default function SupportPage() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        setLoading(true);
        const session = await getSession();
        
        const response = await axiosInstance.get('/v1/seller/support/queries', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (response.data.success) {
          setQueries(response.data.data.queries);
        } else {
          setError('Failed to fetch queries');
        }
      } catch (error) {
        console.error('Error fetching queries:', error);
        setError('An error occurred while fetching queries');
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-800">Support & Help Center</h3>
        <p className="text-sm text-gray-600 mt-1">Get help with your orders, returns, and other queries</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/store-manage/support/faqs" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-blue-600 text-lg">❓</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">FAQs</p>
              <p className="text-xs text-gray-500 mt-0.5">Common Questions</p>
            </div>
          </div>
        </Link>

        <Link href="/store-manage/support/ticket" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <span className="text-green-600 text-lg">🎫</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Raise Ticket</p>
              <p className="text-xs text-gray-500 mt-0.5">Get Direct Support</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Help Categories */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="mr-2">📚</span> Help Categories
          </h2>
          <div className="relative w-64">
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm pr-8"
              placeholder="Search help articles..."
            />
            <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Orders Help */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Orders</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                <Icon icon="material-symbols:arrow-right" className="mr-2" />
                <span className="text-sm">How do I cancel my order?</span>
              </li>
              <li className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                <Icon icon="material-symbols:arrow-right" className="mr-2" />
                <span className="text-sm">Unable to deliver order due to out of stock items</span>
              </li>
              <li className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                <Icon icon="material-symbols:arrow-right" className="mr-2" />
                <span className="text-sm">How to track my order status?</span>
              </li>
              <li className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                <Icon icon="material-symbols:arrow-right" className="mr-2" />
                <span className="text-sm">Payment related issues</span>
              </li>
            </ul>
          </div>

          {/* Returns Help */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Returns & Refunds</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                <Icon icon="material-symbols:arrow-right" className="mr-2" />
                <span className="text-sm">How to initiate a return?</span>
              </li>
              <li className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                <Icon icon="material-symbols:arrow-right" className="mr-2" />
                <span className="text-sm">Return policy information</span>
              </li>
              <li className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                <Icon icon="material-symbols:arrow-right" className="mr-2" />
                <span className="text-sm">Refund status check</span>
              </li>
              <li className="flex items-center text-gray-700 hover:text-blue-600 cursor-pointer transition-colors">
                <Icon icon="material-symbols:arrow-right" className="mr-2" />
                <span className="text-sm">Damaged product return process</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Query History */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <span className="mr-2">📝</span> Previous Queries
          </h2>
          <Link href="/store-manage/support/ticket">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Raise New Ticket
            </Button>
          </Link>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Concern</TableHead>
                  <TableHead>Reference ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queries.length > 0 ? (
                  queries.map((query) => (
                    <TableRow key={query._id}>
                      <TableCell>{formatDate(query.createdAt)}</TableCell>
                      <TableCell>{query.subject}</TableCell>
                      <TableCell>{query.relatedConcern}</TableCell>
                      <TableCell>
                        {query.orderId ? (
                          <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                            <span className="font-medium mr-1">Order:</span> {query.orderId}
                          </span>
                        ) : query.productId ? (
                          <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded">
                            <span className="font-medium mr-1">Product:</span> {query.productId}
                          </span>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          query.status === "closed" 
                            ? "bg-green-100 text-green-800" 
                            : query.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {query.status.charAt(0).toUpperCase() + query.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="hover:bg-gray-100">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      No queries found. <Link href="/store-manage/support/ticket" className="text-blue-600 hover:underline">Raise a new ticket</Link>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
