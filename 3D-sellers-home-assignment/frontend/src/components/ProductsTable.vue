<template>
  <div>
    <el-button type="primary" @click="openAddProductModal"
      >Add Product</el-button
    >

    <!-- Product Table -->
    <el-table :data="products" style="width: 100%" border>
      <el-table-column prop="name" label="Name" width="180"></el-table-column>
      <el-table-column
        prop="price.price"
        label="Price"
        width="120"
      ></el-table-column>
      <el-table-column prop="description" label="Description"></el-table-column>
      <el-table-column label="Actions">
        <template #default="{ row }">
          <el-button @click="openEditProductModal(row)" size="small"
            >Edit</el-button
          >
          <el-button @click="deleteProduct(row.id)" type="danger" size="small"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- Add/Edit Product Modal -->
    <el-dialog v-model="dialogVisible" title="Product Form">
      <el-form :model="productForm" ref="form">
        <el-form-item
          label="Name"
          :rules="[
            {
              required: true,
              message: 'Please input the product name',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="productForm.name"
            placeholder="Enter product name"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Price"
          :rules="[
            {
              required: true,
              message: 'Please input the price',
              trigger: 'blur',
            },
          ]"
        >
          <el-input-number
            v-model="productForm.price"
            placeholder="Enter product price"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="Description">
          <el-input
            v-model="productForm.description"
            placeholder="Enter product description"
          ></el-input>
        </el-form-item>
      </el-form>

      <!-- Modal Footer -->
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveProduct">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>
  
  <script>
import axios from "axios";
const backendUrl = process.env.VUE_APP_API_URL; //import.meta.env.VITE_API_URL;


export default {
  data() {

    return {
      products: [],
      dialogVisible: false,
      productForm: {
        id: null,
        name: "",
        price: 0,
        description: "",
      },
    };
  },
  methods: {
    // Fetch all products from Wix API
    async fetchProducts() {
      try {
        const response = await axios.get(`${backendUrl}/products/`);
        this.products = response.data.products || [];
      } catch (error) {
        this.$message.error("Failed to load products");
      }
    },

    // Open Add Product Modal
    openAddProductModal() {
      this.productForm = { id: null, name: "", price: 0, description: "" }; // Reset form
      this.dialogVisible = true;
    },

    // Open Edit Product Modal
    openEditProductModal(product) {
      this.productForm = { ...product }; // Fill form with product data
      this.dialogVisible = true;
    },

    // Save or Update Product
    async saveProduct() {
      if (this.productForm.id) {
        // Update Product
        await this.updateProduct(this.productForm);
      } else {
        // Add Product
        await this.addProduct(this.productForm);
      }
      this.dialogVisible = false; // Close modal
    },

    // Add Product
    async addProduct(product) {
      try {
        await axios.post(`${backendUrl}/products`, product); // Make sure this endpoint exists on your backend
        this.$message.success("Product added successfully");
        this.fetchProducts(); // Refresh the product list
      } catch (error) {
        this.$message.error("Failed to add product");
      }
    },

    // Update Product
    async updateProduct(product) {
      try {
        await axios.patch(`${backendUrl}/products/${product.id}`, product); // Ensure PUT route exists
        this.$message.success("Product updated successfully");
        this.fetchProducts(); // Refresh the product list
      } catch (error) {
        this.$message.error("Failed to update product");
      }
    },

    // Delete Product
    async deleteProduct(id) {
      try {
        await axios.delete(`${backendUrl}/products/${id}`);
        this.$message.success("Product deleted successfully");
        this.fetchProducts(); // Refresh the product list
      } catch (error) {
        this.$message.error("Failed to delete product");
      }
    },
  },
  mounted() {
    this.fetchProducts(); // Fetch products when the component is mounted
  },
};
</script>
  
  <style>
/* Add custom styles here if necessary */
</style>
  