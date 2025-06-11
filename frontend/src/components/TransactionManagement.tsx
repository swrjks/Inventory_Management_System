
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


interface Transaction {
  transaction_id: number;
  cust_id: number;
  prod_id: number;
  quantity: number;
  total_amount: number;
  transaction_date: string;
  transaction_type: string;
}

export const TransactionManagement = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([
    { transaction_id: 1001, cust_id: 1, prod_id: 1, quantity: 1, total_amount: 1250, transaction_date: "2024-01-15", transaction_type: "Sale" },
    { transaction_id: 1002, cust_id: 2, prod_id: 2, quantity: 2, total_amount: 890, transaction_date: "2024-01-16", transaction_type: "Sale" },
    { transaction_id: 1003, cust_id: 1, prod_id: 3, quantity: 1, total_amount: 2100, transaction_date: "2024-01-17", transaction_type: "Sale" },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({
    cust_id: "",
    prod_id: "",
    quantity: "",
    total_amount: "",
    transaction_date: "",
    transaction_type: ""
  });

  useEffect(() => {
  axios.get("http://localhost:5000/transactions")
    .then(res => setTransactions(res.data))
    .catch(err => console.error("Error fetching transactions:", err));
}, []);


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const payload = {
    cust_id: parseInt(formData.cust_id),
    prod_id: parseInt(formData.prod_id),
    quantity: parseInt(formData.quantity),
    total_amount: parseFloat(formData.total_amount),
    transaction_date: formData.transaction_date,
    transaction_type: formData.transaction_type,
  };

  if (editingTransaction) {
    // PUT (update)
    await axios.put(`http://localhost:5000/transactions/${editingTransaction.transaction_id}`, payload);
    toast({ title: "Transaction updated successfully!" });
  } else {
    // POST (add)
    const newId = Math.max(...transactions.map(t => t.transaction_id), 1000) + 1;
    await axios.post("http://localhost:5000/transactions", {
      transaction_id: newId,
      ...payload
    });
    toast({ title: "Transaction added successfully!" });
  }

  // Refresh list
  axios.get("http://localhost:5000/transactions").then(res => setTransactions(res.data));

  setFormData({ cust_id: "", prod_id: "", quantity: "", total_amount: "", transaction_date: "", transaction_type: "" });
  setEditingTransaction(null);
  setIsOpen(false);
};

const handleEdit = (transaction: Transaction) => {
  setEditingTransaction(transaction);
  setFormData({
    cust_id: transaction.cust_id.toString(),
    prod_id: transaction.prod_id.toString(),
    quantity: transaction.quantity.toString(),
    total_amount: transaction.total_amount.toString(),
    transaction_date: transaction.transaction_date,
    transaction_type: transaction.transaction_type
  });
  setIsOpen(true);
};

const handleDelete = async (id: number) => {
  await axios.delete(`http://localhost:5000/transactions/${id}`);
  toast({ title: "Transaction deleted successfully!" });
  axios.get("http://localhost:5000/transactions").then(res => setTransactions(res.data));
};

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transaction Management</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingTransaction(null);
              setFormData({ cust_id: "", prod_id: "", quantity: "", total_amount: "", transaction_date: "", transaction_type: "" });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTransaction ? "Edit Transaction" : "Add New Transaction"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cust_id">Customer ID</Label>
                <Input
                  id="cust_id"
                  type="number"
                  value={formData.cust_id}
                  onChange={(e) => setFormData({ ...formData, cust_id: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="prod_id">Product ID</Label>
                <Input
                  id="prod_id"
                  type="number"
                  value={formData.prod_id}
                  onChange={(e) => setFormData({ ...formData, prod_id: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="total_amount">Total Amount</Label>
                <Input
                  id="total_amount"
                  type="number"
                  step="0.01"
                  value={formData.total_amount}
                  onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="transaction_date">Transaction Date</Label>
                <Input
                  id="transaction_date"
                  type="date"
                  value={formData.transaction_date}
                  onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="transaction_type">Transaction Type</Label>
                <Input
                  id="transaction_type"
                  value={formData.transaction_type}
                  onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">{editingTransaction ? "Update" : "Add"} Transaction</Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Customer ID</TableHead>
              <TableHead>Product ID</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.transaction_id}>
                <TableCell>{transaction.transaction_id}</TableCell>
                <TableCell>{transaction.cust_id}</TableCell>
                <TableCell>{transaction.prod_id}</TableCell>
                <TableCell>{transaction.quantity}</TableCell>
                <TableCell>₹{transaction.total_amount}</TableCell>
                <TableCell>{transaction.transaction_date}</TableCell>
                <TableCell>{transaction.transaction_type}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(transaction)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(transaction.transaction_id)}>
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
