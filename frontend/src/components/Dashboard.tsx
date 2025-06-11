import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, UserCheck, Truck, CreditCard, TrendingUp } from "lucide-react";

interface Transaction {
  transaction_id: number;
  total_amount: number;
  transaction_date: string;
}

interface Product {
  prod_id: number;
  prod_name: string;
  stock: number;
}

export const Dashboard = () => {
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const resTx = await axios.get("http://localhost:5000/api/recent-transactions");
        setRecentTransactions(resTx.data);

        const resStock = await axios.get("http://localhost:5000/api/low-stock");
        setLowStockItems(resStock.data);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">1,234</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Products</CardTitle>
            <Package className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">856</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>+5% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Employees</CardTitle>
            <UserCheck className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">45</div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              <span>+2 new hires</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Suppliers</CardTitle>
            <Truck className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">23</div>
            <div className="text-xs text-gray-500 mt-1">Active partnerships</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Transactions</CardTitle>
            <CreditCard className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">₹89,240</div>
            <div className="text-xs text-gray-500 mt-1">This month</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="bg-blue-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {recentTransactions.map(tx => (
              <div key={tx.transaction_id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Transaction #{tx.transaction_id}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{new Date(tx.transaction_date).toLocaleString()}</p>
                </div>
                <span className="text-lg font-bold text-green-600">₹{tx.total_amount}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader className="bg-red-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {lowStockItems.map(product => (
              <div key={product.prod_id} className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <span className="text-sm font-medium text-gray-700">{product.prod_name}</span>
                  <p className="text-xs text-gray-500 mt-1">Low stock warning</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-red-600">{product.stock} units</span>
                  <div className="w-full bg-red-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
