<script setup lang="ts">
import proimg1 from '@/public/images/products/s4.jpg';
import proimg2 from '@/public/images/products/s5.jpg';
import proimg3 from '@/public/images/products/s7.jpg';
import proimg4 from '@/public/images/products/s11.jpg';
// import proimg1 from '/images/products/s4.jpg';
// import proimg2 from '/images/products/s5.jpg';
// import proimg3 from '/images/products/s7.jpg';
// import proimg4 from '/images/products/s11.jpg';
const productsCard = [
  {
    title: 'Boat Headphone',
    link: '/',
    photo: proimg1,
    salesPrice: 375,
    price: 285,
    rating: 4,
  },
  {
    title: 'MacBook Air Pro',
    link: '/',
    photo: proimg2,
    salesPrice: 650,
    price: 900,
    rating: 5,
  },
  {
    title: 'Red Valvet Dress',
    link: '/',
    photo: proimg3,
    salesPrice: 150,
    price: 200,
    rating: 3,
  },
  {
    title: 'Cute Soft Teddybear',
    link: '/',
    photo: proimg4,
    salesPrice: 285,
    price: 345,
    rating: 2,
  },
];
</script>
<template>
  <v-row>
    <v-col v-for="card in productsCard" :key="card.title" cols="12" lg="3" sm="6">
      <v-card elevation="10" class="withbg" rounded="md">
        <NuxtLink :to="card.link">
          <v-img :src="card.photo" height="100%" class="rounded-t-md" />
        </NuxtLink>
        <div class="d-flex justify-end mr-4 mt-n5">
          <v-btn size="40" icon class="bg-primary d-flex">
            <v-avatar size="30" class="text-white">
              <BasketIcon size="15" />
            </v-avatar>
            <v-tooltip
              activator="parent"
              location="bottom"
            >
              Add To Cart
            </v-tooltip>
          </v-btn>
        </div>
        <v-card-item class="pt-0">
          <h6 class="text-h6" v-text="card.title" />
          <div class="d-flex align-center justify-space-between mt-1">
            <div>
              <span class="text-h6" v-text="`$${card.price}`" />
              <span class="text-body-1 ml-2 text-medium-emphasis text-decoration-line-through" v-text="`$${card.salesPrice}`" />
            </div>
            <v-rating v-model="card.rating" density="compact" color="warning" size="small" readonly />
          </div>
        </v-card-item>
      </v-card>
    </v-col>
  </v-row>
</template>
