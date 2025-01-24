"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

import { siteConfig } from "@/config/theme"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container">
        {/* Newsletter Section */}
        <div className="grid gap-8 py-8 lg:grid-cols-2 lg:py-12">
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Stay updated with Indian artistry
            </h3>
            <p className="mt-2 text-muted-foreground">
              Subscribe to our newsletter for exclusive updates, artisan stories,
              and special offers.
            </p>
          </div>
          <form className="flex flex-col gap-2 sm:flex-row lg:items-center">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
              required
            />
            <Button type="submit" className="sm:w-auto">
              Subscribe
            </Button>
          </form>
        </div>
        <Separator />
        {/* Main Footer Links */}
        <div className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h4 className="font-bold">About HastIndia</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="text-muted-foreground hover:text-foreground">
                  Meet Our Artisans
                </Link>
              </li>
              <li>
                <Link href="/impact" className="text-muted-foreground hover:text-foreground">
                  Social Impact
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-muted-foreground hover:text-foreground">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-foreground">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Artisan Corner</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sell" className="text-muted-foreground hover:text-foreground">
                  Sell on HastIndia
                </Link>
              </li>
              <li>
                <Link href="/artisan-resources" className="text-muted-foreground hover:text-foreground">
                  Artisan Resources
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-muted-foreground hover:text-foreground">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/artisan-support" className="text-muted-foreground hover:text-foreground">
                  Support & Training
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold">Connect With Us</h4>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href={siteConfig.links.facebook} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={siteConfig.links.instagram} target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href={siteConfig.links.youtube} target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </Link>
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Customer Support:</strong>
                <br />
                support@hastindia.com
              </p>
              <p>
                <strong>Artisan Support:</strong>
                <br />
                artisans@hastindia.com
              </p>
            </div>
          </div>
        </div>
        <Separator />
        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/shipping-policy" className="hover:text-foreground">
              Shipping Policy
            </Link>
            <Link href="/refund-policy" className="hover:text-foreground">
              Refund Policy
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HastIndia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

