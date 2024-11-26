import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WixService {
  private readonly wixStoreReaderUrl =
    'https://www.wixapis.com/stores-reader/v1/products/query';
  private readonly wixApiUrl: string =
    'https://www.wixapis.com/stores/v1/products';
  private wixAuthToken: string;
  private wixSiteId: string;
  constructor(private readonly configService: ConfigService) {
    this.wixAuthToken = configService.get<string>('API_KEY');
    this.wixSiteId = configService.get<string>('SITE_ID');
  }

  private async createProductOnWix(product: any) {
    try {
      const response = await axios.post(
        this.wixApiUrl,
        {
          product: {
            name: product.name,
            priceData: { price: product.price },
            productType: product.productType || 'physical',
            description: product.description,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${this.wixAuthToken}`,
            'wix-site-id': this.wixSiteId,
          },
        },
      );
      return response.data.product;
      console.log('Product created on Wix');
    } catch (error) {
      console.error('Error creating product on Wix:', error);
      throw new Error('Failed to create product on Wix');
    }
  }

  private async updateProductOnWix(product: any) {
    // const wixPayload = this.buildWixPayloadForUpdate(product);
    // wixPayload.product.id = product?.id; // Adding product ID for update

    try {
      await axios.patch(
        `${this.wixApiUrl}/${product.id}`,
        {
          product: {
            name: product.name,
            priceData: { price: product.price },
            productType: product.productType,
            description: product.description,
          },
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${this.wixAuthToken}`,
            'wix-site-id': this.wixSiteId,
          },
        },
      );
      console.log('Product updated on Wix');
    } catch (error) {
      console.error('Error updating product on Wix:', error);
      throw new Error('Failed to update product on Wix');
    }
  }

  private async deleteProductFromWix(productId: string) {
    try {
      await axios.delete(`${this.wixApiUrl}/${productId}`, {
        headers: {
          Authorization: `Bearer ${this.wixAuthToken}`,
          'wix-site-id': this.wixSiteId,
        },
      });
      console.log('Product deleted from Wix');
    } catch (error) {
      console.error('Error deleting product from Wix:', error);
      throw new Error('Failed to delete product from Wix');
    }
  }

  public async getAllProductsInStore(): Promise<any> {
    try {
      const response = await axios.post(
        this.wixStoreReaderUrl,
        {},
        {
          headers: {
            Authorization: `${this.wixAuthToken}`,
            'wix-site-id': this.wixSiteId,
          },
          params: {
            // limit: 100,
          },
        },
      );

      return response.data.products;
    } catch (error) {
      console.error('Error fetching products from Wix:', error);
      throw new Error('Failed to fetch products from Wix');
    }
  }

  public async syncWithWix(action: string, product: any): Promise<any> {
    try {
      switch (action) {
        case 'create':
          return await this.createProductOnWix(product);

        case 'update':
          return this.updateProductOnWix(product);
        case 'delete':
          await this.deleteProductFromWix(product.id);
          break;
        default:
          throw new Error('Invalid action');
      }
    } catch (error) {
      console.error('Error syncing with Wix:', error);
      throw new Error('Failed to sync with Wix');
    }
  }
}
