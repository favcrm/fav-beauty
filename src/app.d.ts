declare global {
  namespace App {
    interface PageData {
      brand?: import("$lib/data/types").BrandConfig;
    }
  }
}

export {};
