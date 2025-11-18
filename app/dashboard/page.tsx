"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard-header";
import { Sidebar } from "@/components/sidebar";
import { Navigation } from "@/components/navigation";
import { SummaryCard } from "@/components/summary-card";
import { AddTransactionModal } from "@/components/add-transaction-modal";
import { TransactionList } from "@/components/transaction-list";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { getUser, getToken, logout } from "@/lib/token-storage";
import { apiCall } from "@/lib/api-client";

interface Transaction {
  _id: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  description: string;
  date: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const token = getToken();
      if (!token) return router.push("/login");

      const data = await apiCall<Transaction[]>("/api/transactions", {
        method: "GET",
      });
      setTransactions(data);
    } catch (err: any) {
      console.error("[v0] Error fetching transactions:", err);
      setError("Failed to load transactions");
      if (err.message === "Invalid token") {
        logout();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getUser();
    const token = getToken();

    if (!user || !token) {
      router.push("/login");
      return;
    }

    setUserName(user.email);
    fetchTransactions();
  }, [router]);

  // Add transaction
  const handleAddTransaction = async (
    transaction: Omit<Transaction, "_id">
  ) => {
    try {
      const newTransaction = await apiCall<Transaction>("/api/transactions", {
        method: "POST",
        body: JSON.stringify(transaction),
      });
      setTransactions([newTransaction, ...transactions]); // update transactions state
      setModalOpen(false);
    } catch (err: any) {
      console.error("[v0] Error adding transaction:", err);
      setError("Failed to add transaction");
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (_id: string) => {
    if (!_id || _id.length !== 24) {
      console.error("Invalid transaction ID:", _id);
      return;
    }

    try {
      await apiCall(`/api/transactions/${_id.trim()}`, { method: "DELETE" }); // ✅ trim
      setTransactions(transactions.filter((t) => t._id !== _id));
    } catch (err: any) {
      console.error("[v0] Error deleting transaction:", err);
      setError("Failed to delete transaction");
    }
  };

  // Summary calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <DashboardHeader userName={userName} />

      <main className="sm:ml-64 px-4 sm:px-6 py-6 sm:py-8 space-y-8 pb-24 sm:pb-8">
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryCard
            title="Total Income"
            amount={totalIncome}
            icon={<TrendingUp className="w-5 h-5" />}
            variant="income"
          />
          <SummaryCard
            title="Total Expense"
            amount={totalExpense}
            icon={<TrendingDown className="w-5 h-5" />}
            variant="expense"
          />
          <SummaryCard
            title="Balance"
            amount={balance}
            icon={<Wallet className="w-5 h-5" />}
            variant="default"
          />
        </div>

        {/* Add Transaction Button */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add Transaction
        </button>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">
              Recent Transactions
            </h2>
            <Link
              href="/transactions"
              className="flex items-center gap-1 text-primary hover:underline text-sm font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <TransactionList
            transactions={recentTransactions}
            onDelete={handleDeleteTransaction} // ✅ deletion works
          />
        </div>
      </main>

      <Navigation />
      <AddTransactionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddTransaction}
      />
    </div>
  );
}
