
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect } from "react";


interface Product {
  prod_id: number;
  prod_name: string;
  mrp: number;
  stock: number;
  category: string;
  supplier_id?: number;
}



export const ProductManagement = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);

const fetchProducts = () => {
  axios.get("http://localhost:5000/products")
    .then(res => setProducts(res.data))
    .catch(err => console.error("Failed to fetch products:", err));
};

useEffect(() => {
  fetchProducts();
}, []);


  const [isOpen, setIsOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock_quantity: "",
    category: "",
    supplier_id: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const productData = {
    prod_name: formData.name,
    mrp: parseFloat(formData.price),
    stock: parseInt(formData.stock_quantity),
    supplier_id: formData.supplier_id ? parseInt(formData.supplier_id) : null
  };

  if (editingProduct) {
    axios.put(`http://localhost:5000/products/${editingProduct.prod_id}`, productData)
      .then(() => {
        toast({ title: "Product updated successfully!" });
        fetchProducts();
      })
      .catch(() => toast({ title: "Failed to update product", variant: "destructive" }));
  } else {
    const newProduct = {
      prod_id: Math.floor(Math.random() * 100000), // if you're not using AUTO_INCREMENT
      ...productData
    };
    axios.post("http://localhost:5000/products", newProduct)
      .then(() => {
        toast({ title: "Product added successfully!" });
        fetchProducts();
      })
      .catch(() => toast({ title: "Failed to add product", variant: "destructive" }));
  }

  setFormData({ name: "", price: "", stock_quantity: "", category: "", supplier_id: "" });
  setEditingProduct(null);
  setIsOpen(false);
};


const handleEdit = (product: Product) => {
  setEditingProduct(product);
  setFormData({
    name: product.prod_name,
    price: product.mrp.toString(),
    stock_quantity: product.stock.toString(),
    category: "", // category is not used in backend
    supplier_id: product.supplier_id?.toString() || ""
  });
  setIsOpen(true);
};


  const handleDelete = (id: number) => {
  axios.delete(`http://localhost:5000/products/${id}`)
    .then(() => {
      toast({ title: "Product deleted successfully!" });
      fetchProducts();
    })
    .catch(() => toast({ title: "Failed to delete product", variant: "destructive" }));
};


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Product Management</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProduct(null);
              setFormData({ name: "", price: "", stock_quantity: "", category: "", supplier_id: "" });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
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
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="stock_quantity">Stock Quantity</Label>
                <Input
                  id="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="supplier_id">Supplier ID (Optional)</Label>
                <Input
                  id="supplier_id"
                  type="number"
                  value={formData.supplier_id}
                  onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
                />
              </div>
              <Button type="submit">{editingProduct ? "Update" : "Add"} Product</Button>
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
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Supplier ID</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.prod_id}>
                <TableCell>{product.prod_id}</TableCell>
                <TableCell>{product.prod_name}</TableCell>
                <TableCell>₹{product.mrp}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.supplier_id || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(product.prod_id)}>
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
