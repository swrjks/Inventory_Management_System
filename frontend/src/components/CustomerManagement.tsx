
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';
import { useEffect } from "react";

interface Customer {
  cust_id: number;
  name: string;
  email: string;
  address: string;
  ph_no: string;
  transaction_id?: number;
}

export const CustomerManagement = () => {
  const { toast } = useToast();


const [customers, setCustomers] = useState<Customer[]>([]);

// Fetch customers from backend
const fetchCustomers = () => {
  axios.get('http://localhost:5000/customers')
    .then(res => setCustomers(res.data))
    .catch(err => console.error("Error fetching customers:", err));
};

useEffect(() => {
  fetchCustomers();
}, []);


  const [isOpen, setIsOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ph_no: "",
    transaction_id: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const dataToSend = {
    ...formData,
    transaction_id: formData.transaction_id ? parseInt(formData.transaction_id) : null
  };

  if (editingCustomer) {
    // UPDATE existing customer
    axios.put(`http://localhost:5000/customers/${editingCustomer.cust_id}`, dataToSend)
      .then(() => {
        toast({ title: "Customer updated successfully!" });
        fetchCustomers();
      })
      .catch(() => toast({ title: "Update failed", variant: "destructive" }));
  } else {
    // ADD new customer
    const newCustomer = {
      ...dataToSend,
      cust_id: Math.floor(Math.random() * 100000) // or use auto-increment in DB
    };
    axios.post('http://localhost:5000/customers', newCustomer)
      .then(() => {
        toast({ title: "Customer added successfully!" });
        fetchCustomers();
      })
      .catch(() => toast({ title: "Add failed", variant: "destructive" }));
  }

  setFormData({ name: "", email: "", address: "", ph_no: "", transaction_id: "" });
  setEditingCustomer(null);
  setIsOpen(false);
};

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      address: customer.address,
      ph_no: customer.ph_no,
      transaction_id: customer.transaction_id?.toString() || ""
    });
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
  axios.delete(`http://localhost:5000/customers/${id}`)
    .then(() => {
      toast({ title: "Customer deleted successfully!" });
      fetchCustomers();
    })
    .catch(() => toast({ title: "Delete failed", variant: "destructive" }));
};


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Customer Management</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingCustomer(null);
              setFormData({ name: "", email: "", address: "", ph_no: "", transaction_id: "" });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCustomer ? "Edit Customer" : "Add New Customer"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="ph_no">Phone Number</Label>
                <Input
                  id="ph_no"
                  value={formData.ph_no}
                  onChange={(e) => setFormData({ ...formData, ph_no: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="transaction_id">Transaction ID (Optional)</Label>
                <Input
                  id="transaction_id"
                  type="number"
                  value={formData.transaction_id}
                  onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                />
              </div>
              <Button type="submit">{editingCustomer ? "Update" : "Add"} Customer</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.cust_id}>
                <TableCell>{customer.cust_id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.ph_no}</TableCell>
                <TableCell>{customer.transaction_id || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(customer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(customer.cust_id)}>
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
  );
};
