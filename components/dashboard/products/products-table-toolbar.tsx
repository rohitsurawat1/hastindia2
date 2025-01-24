"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Filter, SlidersHorizontal } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface ProductsTableToolbarProps<TData> {
  table?: Table<TData>
}

export function ProductsTableToolbar<TData>({
  table,
}: ProductsTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-64">
          <Input
            placeholder="Search products..."
            className="pl-8"
          />
          <Filter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Separator orientation="vertical" className="h-8" />
        <Select defaultValue="all">
          <SelectTrigger className="w-36">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="textiles">Textiles</SelectItem>
            <SelectItem value="pottery">Pottery</SelectItem>
            <SelectItem value="jewelry">Jewelry</SelectItem>
            <SelectItem value="woodcraft">Woodcraft</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm">
          Download CSV
        </Button>
        <Button variant="outline" size="sm">
          Bulk Edit
        </Button>
      </div>
    </div>
  )
}

