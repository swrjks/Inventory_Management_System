
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerManagement } from "@/components/CustomerManagement";
import { ProductManagement } from "@/components/ProductManagement";
import { EmployeeManagement } from "@/components/EmployeeManagement";
import { SupplierManagement } from "@/components/SupplierManagement";
import { TransactionManagement } from "@/components/TransactionManagement";
import { Dashboard } from "@/components/Dashboard";
import { Users, Package, UserCheck, Truck, Receipt, BarChart3 } from "lucide-react";

const Index = () => {
  const tabItems = [
    { value: "dashboard", label: "Dashboard", icon: BarChart3 },
    { value: "customers", label: "Customers", icon: Users },
    { value: "products", label: "Products", icon: Package },
    { value: "employees", label: "Employees", icon: UserCheck },
    { value: "suppliers", label: "Suppliers", icon: Truck },
    { value: "transactions", label: "Transactions", icon: Receipt },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Inventory Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Manage your inventory, customers, employees, suppliers, and transactions with ease
          </p>
          <div className="mt-6 w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <div className="mb-8">
            <TabsList className="w-full bg-white border border-gray-200 shadow-lg rounded-2xl p-2 h-auto">
              <div className="grid grid-cols-6 w-full gap-2">
                {tabItems.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 
                             data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 
                             data-[state=active]:text-white data-[state=active]:shadow-lg
                             hover:bg-gray-50 text-gray-600 data-[state=active]:hover:from-blue-600 data-[state=active]:hover:to-purple-700"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </TabsTrigger>
                ))}
              </div>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="mt-8">
            <Dashboard />
          </TabsContent>

          <TabsContent value="customers" className="mt-8">
            <CustomerManagement />
          </TabsContent>

          <TabsContent value="products" className="mt-8">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="employees" className="mt-8">
            <EmployeeManagement />
          </TabsContent>

          <TabsContent value="suppliers" className="mt-8">
            <SupplierManagement />
          </TabsContent>

          <TabsContent value="transactions" className="mt-8">
            <TransactionManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
