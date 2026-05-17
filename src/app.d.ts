declare global {
  namespace App {
    interface Locals {
      companyId?: string;
    }
    interface PageData {
      brand?: import("$lib/data/types").BrandConfig;
      companyId?: string;
    }
  }
}

export {};
