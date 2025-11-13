import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  createdAt: Date
}

export interface Transaction {
  _id?: ObjectId
  userId: ObjectId | string
  type: "income" | "expense"
  amount: number
  category: string
  description: string
  date: Date
  createdAt: Date
}

export type UserDocument = User
export type TransactionDocument = Transaction
