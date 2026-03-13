import React from "react";
import { Linkedin, Facebook, Instagram, Send } from "lucide-react";
import { Button } from "../../../ui/core/Button";
import { Input } from "../../../ui/core/Input";

export interface FooterProps {
  tagline?: string;
  email?: string;
  phone?: string;
  address?: string;
  country?: string;
}

const Footer: React.FC<FooterProps> = ({
  tagline = "Leading the Way in Medical Execellence, Trusted Care.",
  email = "fildineesoe@gmail.com",
  phone = "(237) 681-812-255",
  address = "0123 Some place",
  country = "Some country",
}) => {
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute right-[-128px] size-[256px] top-[122px] opacity-50">
        <div className="size-full rounded-full bg-muted" />
      </div>
      <div className="absolute left-[-119px] size-[239px] top-[-119px] opacity-30">
        <div className="size-full rounded-full bg-info" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-12 sm:px-5 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 xl:grid-cols-4 xl:gap-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-3xl font-bold mb-4">
              <span className="text-muted">MEDDICAL</span>
            </h3>
            <p className="text-sm leading-relaxed text-primary-foreground/90">
              {tagline}
            </p>
          </div>

          {/* Important Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Important Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-muted transition-colors">
                  Appointment
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-muted transition-colors">
                  Doctors
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-muted transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-muted transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>Call: {phone}</li>
              <li>Email: {email}</li>
              <li>Address: {address}</li>
              <li>{country}</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <div className="relative">
              <Input
                placeholder="Enter your email address"
                className="pr-12 bg-muted border-none text-primary placeholder:text-primary/60"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 -rotate-45">
                <Send className="size-5 text-primary" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-muted/20 pt-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-center md:text-left">
              © 2021 Hospital's name All Rights Reserved by PNTEC-LTD
            </p>
            <div className="flex items-center justify-center gap-4 md:justify-end">
              <a
                href="#"
                className="p-2 rounded-full bg-muted/10 hover:bg-muted/20 transition-colors"
              >
                <Linkedin className="size-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-muted/10 hover:bg-muted/20 transition-colors"
              >
                <Facebook className="size-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-muted/10 hover:bg-muted/20 transition-colors"
              >
                <Instagram className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Colored bars at bottom */}
      <div className="flex h-1">
        <div className="flex-1 bg-info" />
        <div className="flex-[6] bg-primary" />
        <div className="flex-1 bg-muted" />
      </div>
    </footer>
  );
};

export { Footer };
