import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Employee {
  emp_id: number;
  name: string;
  email: string;
  position: string;
  salary: number;
  hire_date: string;
}

export const EmployeeManagement = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    salary: "",
    hire_date: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/employees")
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      emp_id: editingEmployee ? editingEmployee.emp_id : Math.floor(Math.random() * 100000),
      name: formData.name,
      email: formData.email,
      position: formData.position,
      salary: parseFloat(formData.salary),
      hire_date: formData.hire_date
    };

    if (editingEmployee) {
      axios.put(`http://localhost:5000/employees/${editingEmployee.emp_id}`, payload)
        .then(() => {
          toast({ title: "Employee updated successfully!" });
          setEmployees(employees.map(e => e.emp_id === editingEmployee.emp_id ? payload : e));
        });
    } else {
      axios.post("http://localhost:5000/employees", payload)
        .then(() => {
          toast({ title: "Employee added successfully!" });
          setEmployees([...employees, payload]);
        });
    }

    setFormData({ name: "", email: "", position: "", salary: "", hire_date: "" });
    setEditingEmployee(null);
    setIsOpen(false);
  };


    const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      position: employee.position,
      salary: employee.salary.toString(),
      hire_date: employee.hire_date
    });
    setIsOpen(true);
  };

  const handleDelete = (id: number) => {
    axios.delete(`http://localhost:5000/employees/${id}`)
      .then(() => {
        toast({ title: "Employee deleted successfully!" });
        setEmployees(employees.filter(e => e.emp_id !== id));
      });
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Employee Management</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingEmployee(null);
              setFormData({ name: "", email: "", position: "", salary: "", hire_date: "" });
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEmployee ? "Edit Employee" : "Add New Employee"}</DialogTitle>
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
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="hire_date">Hire Date</Label>
                <Input
                  id="hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">{editingEmployee ? "Update" : "Add"} Employee</Button>
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
              <TableHead>Position</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Hire Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.emp_id}>
                <TableCell>{employee.emp_id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>₹{employee.salary.toLocaleString()}</TableCell>
                <TableCell>{employee.hire_date}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(employee)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(employee.emp_id)}>
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
