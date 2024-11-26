<template>
    <div>
      <h1>Products</h1>
      <ProductsTable />
    </div>
  </template>
  
  <script>
  import ProductsTable from '@/components/ProductsTable.vue';
  
  export default {
    components: {
      ProductsTable,
    },
  };
  </script>
  