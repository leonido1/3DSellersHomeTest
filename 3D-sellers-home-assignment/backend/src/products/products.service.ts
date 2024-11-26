import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Prisma service to interact with DB
import { WixService } from '../wix/wix.service';
import { CreateProductDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private readonly wixService: WixService,
  ) {}

  // Create a new product
  async create(createProductDto: CreateProductDto) {
    const productFromWix = await this.wixService.syncWithWix(
      'create',
      createProductDto,
    );
    // Save to the database using Prisma
    const product = await this.prisma.product.create({
      data: {
        name: productFromWix.name,
        description: productFromWix.description,
        price: productFromWix.priceData.price,
        type: productFromWix.productType,
        id: productFromWix.id,
      },
    });

    return product;
  }
  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return this.wixService.getAllProductsInStore();
  }
  async update(id: string, updateProductDto: any) {
    await this.wixService.syncWithWix('update', { id, ...updateProductDto });

    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const dataToUpdate: any = {};

    if (updateProductDto.name) {
      dataToUpdate.name = updateProductDto.name;
    }

    if (updateProductDto.price) {
      dataToUpdate.price = updateProductDto.price;
    }

    if (updateProductDto.description) {
      dataToUpdate.description = updateProductDto.description;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new Error('No valid fields to update');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: dataToUpdate,
    });

    return updatedProduct;
  }

  async remove(id: string) {
    await this.wixService.syncWithWix('delete', { id });
    const product = await this.prisma.product.findUnique({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.product.delete({ where: { id } });

    return { message: 'Product deleted successfully' };
  }
}
