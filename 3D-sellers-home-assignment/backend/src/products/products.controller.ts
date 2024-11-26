import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return { message: 'Product created successfully', product };
  }

  @Get()
  async findAll() {
    const products = await this.productsService.findAll();
    return { message: 'Products retrieved successfully', products };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productsService.update(
      id,
      updateProductDto,
    );
    return { message: 'Product updated successfully', updatedProduct };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return { message: 'Product deleted successfully' };
  }
}
