
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductForm } from "@/components/inventory/ProductForm";
import { Product } from "@/types/inventory";
import { toast } from "sonner";
import { Pencil, Trash, Package, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .order("nome");

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error("Erro ao carregar produtos: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleAddProduct = async (data: Omit<Product, "id" | "data_cadastro" | "valor_total">) => {
    const valor_total = data.quantidade * data.valor_unidade;
    
    try {
      const { data: newProduct, error } = await supabase
        .from("produtos")
        .insert([{ ...data, valor_total }])
        .select()
        .single();

      if (error) throw error;

      setProducts((prev) => [...prev, newProduct]);
      toast.success("Produto cadastrado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao cadastrar produto: " + error.message);
    }
  };

  const handleEditProduct = async (data: Omit<Product, "id" | "data_cadastro" | "valor_total">) => {
    if (!editingProduct) return;

    const valor_total = data.quantidade * data.valor_unidade;

    try {
      const { error } = await supabase
        .from("produtos")
        .update({ ...data, valor_total })
        .eq("id", editingProduct.id);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((item) =>
          item.id === editingProduct.id
            ? { ...editingProduct, ...data, valor_total }
            : item
        )
      );
      setEditingProduct(null);
      toast.success("Produto atualizado com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao atualizar produto: " + error.message);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("produtos")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      setProducts((prev) => prev.filter((item) => item.id !== product.id));
      toast.success("Produto removido com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao remover produto: " + error.message);
    } finally {
      setProductToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="w-8 h-8" />
            <h1 className="text-3xl font-bold text-gray-900">Estoque</h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Novo Produto</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Cadastrar Novo Produto</DialogTitle>
              </DialogHeader>
              <ProductForm
                onSubmit={handleAddProduct}
                onCancel={() => setEditingProduct(null)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Unidade</TableHead>
                <TableHead>Valor Unit.</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.nome}</TableCell>
                  <TableCell>{product.descricao}</TableCell>
                  <TableCell>{product.quantidade}</TableCell>
                  <TableCell>{product.unidade}</TableCell>
                  <TableCell>R$ {product.valor_unidade.toFixed(2)}</TableCell>
                  <TableCell>R$ {product.valor_total.toFixed(2)}</TableCell>
                  <TableCell className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditingProduct(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Editar Produto</DialogTitle>
                        </DialogHeader>
                        <ProductForm
                          initialData={product}
                          onSubmit={handleEditProduct}
                          onCancel={() => setEditingProduct(null)}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setProductToDelete(product);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDelete(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => productToDelete && handleDeleteProduct(productToDelete)}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
