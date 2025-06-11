
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import axios from "axios";


interface Supplier {
  supplier_id: number;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
}

export const SupplierManagement = () => {
  const { toast } = useToast();
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { supplier_id: 1, name: "Tech Supplies Co.", contact_person: "John Tech", email: "john@techsupplies.com", phone: "555-0100", address: "123 Tech St" },
    { supplier_id: 2, name: "Office Gear Ltd", contact_person: "Sarah Office", email: "sarah@officegear.com", phone: "555-0101", address: "456 Office Ave" },
    { supplier_id: 3, name: "Electronics Hub", contact_person: "Mike Electronics", email: "mike@electronicshub.com", phone: "555-0102", address: "789 Electronics Blvd" },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: ""
  });

  useEffect(() => {
  axios.get("http://localhost:5000/suppliers")
    .then(res => setSuppliers(res.data))
    .catch(err => console.error("Error fetching suppliers:", err));
}, []);

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (editingSupplier) {
    axios.put(`http://localhost:5000/suppliers/${editingSupplier.supplier_id}`, {
      ...formData
    }).then(() => {
      toast({ title: "Supplier updated successfully!" });
      axios.get("http://localhost:5000/suppliers").then(res => setSuppliers(res.data));
    });
  } else {
    const newId = Math.max(...suppliers.map(s => s.supplier_id), 0) + 1;
    axios.post("http://localhost:5000/suppliers", {
      supplier_id: newId,
      ...formData
    }).then(() => {
      toast({ title: "Supplier added successfully!" });
      axios.get("http://localhost:5000/suppliers").then(res => setSuppliers(res.data));
    });
  }

  setFormData({ name: "", contact_person: "", email: "", phone: "", address: "" });
  setEditingSupplier(null);
  setIsOpen(false);
};


  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact_person: supplier.contact_person,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address
    });
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
  axios.delete(`http://localhost:5000/suppliers/${id}`).then(() => {
    toast({ title: "Supplier deleted successfully!" });
    setSuppliers(suppliers.filter(s => s.supplier_id !== id));
  });
};


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Supplier Management</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingSupplier(null);
              setFormData({ name: "", contact_person: "", email: "", phone: "", address: "" });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSupplier ? "Edit Supplier" : "Add New Supplier"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  value={formData.contact_person}
                  onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
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
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              <Button type="submit">{editingSupplier ? "Update" : "Add"} Supplier</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Contact Person</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.supplier_id}>
                <TableCell>{supplier.supplier_id}</TableCell>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contact_person}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{supplier.address}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(supplier)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(supplier.supplier_id)}>
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
