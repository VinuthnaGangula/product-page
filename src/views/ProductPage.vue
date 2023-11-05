<template>
	<div class="">
		<div class="bg-neutral-100">
			<!-- Header -->
			<div class="pl-4 md:pl-8 py-4 flex align-center bg-white h-[10vh]" align="left">
				<img class="" src="../assets/tbps-logo.webp" alt="logo">
			</div>

			<div class="container h-[90vh]">
				<!-- Product Section -->
				<div class="py-8 px-4 flex flex-col justify-start md:justify-between md:flex-row">
					<!-- Product Media Section -->
					<div class="w-[100%] md:w-[48%] pb-4 md:pb-0">
						<ProductMedia :media="productData.media"></ProductMedia>
					</div>

					<!-- Product Info Section -->
					<div class="flex-col w-full md:w-[48%]">
						<!-- Brand & Stock -->
						<div class="pb-2 pt-2 sm:pt-0 flex flex-wrap justify-between">
							<div>
								<p class="m-0 text-gray-400">{{ productData.brand_name }}</p>
							</div>

							<div>
								<p class="m-0 font-normal text-teal-600">{{ productData.stock_info }}</p>
							</div>
						</div>

						<p class="m-0 py-2 text-xl font-semibold">{{ productData.product_name }}</p>

						<p class="m-0 py-2 text-lg font-semibold">{{ productData.price }}</p>

						<!-- Line -->
						<div class="py-2">

						</div>

						<!-- Properties -->
						<div v-for="property, index in productData.properties" :key="index">
							<p class="m-0 py-2"><span class="font-medium">{{ property.name }}</span>: <span class="">{{ property.value }}</span></p>
						</div>

						<!-- Line -->
						<div class="py-2">

						</div>

						<!-- Product Quantity -->
						<div class="py-2 flex justify-center md:justify-start align-center">
							<button class="pr-2" @click="updateQuantity(-1)">
								<span class="text-xl text-color-slate-600">-</span>
							</button>

							<div class="bg-slate-200">
								<p class="px-4 py-2 w-[50px] text-slate-600 text-xl font-semibold flex justify-center align-center">{{ productData.quantity_added == 0 ? productQuantity : productData.quantity_added }}</p>
							</div>

							<button class="pl-2" @click="updateQuantity(1)">
								<span class="text-xl text-color-slate-600">+</span>
							</button>
						</div>

						<!-- Add to Basket -->
						<div class="py-2 w-full">
							<button class="px-4 py-2 w-[100%] bg-yellow-300 rounded">
								<span class="font-bold">Add to Basket</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ProductPage',
	components: {
		'ProductMedia': () => import('../components/ProductMedia.vue'),
	},
	data() {
		return {
			productData: {},
			productMedia: {},
			productQuantity: 1,
		}
	},
	mounted() {
		// Product Data.
		this.productData = {
			brand_name: 'SAMSUNG',
			product_name: 'Samsung Galaxy S23 Plus 5G',
			stock_info: 'Hurry Limited Stock',
			price: '£880.00',
			quantity_added: 0,
			properties: [
				{ name: 'Sim', value: 'DUAL SIM' },
				{ name: 'Condition', value: 'LIKE NEW' },
				{ name: 'Colour', value: 'LAVENDER' },
				{ name: 'Network', value: 'UNLOCKED' },
				{ name: 'Storage', value: '512GB' }
			],
			media: [
				{
					id: 1,
					placement: 1,
					type: 'IMAGE',
					thumbnail: 'product-image-thumbnail.jpeg',
					standard_image: 'product-image.jpeg',
					zoom_image: 'product-image-large.jpeg'
				},
				{
					id: 2,
					placement: 2,
					type: 'IMAGE',
					thumbnail: 'product-image-front-thumbnail.jpeg',
					standard_image: 'product-image-front.jpeg',
					zoom_image: 'product-image-front-large.jpeg'
				},
				{
					id: 3,
					placement: 3,
					type: 'IMAGE',
					thumbnail: 'product-image-back-thumbnail.jpeg',
					standard_image: 'product-image-back.jpeg',
					zoom_image: 'product-image-back-large.jpeg'
				},
				{
					id: 4,
					placement: 4,
					type: 'VIDEO',
					thumbnail: 'product-image-thumbnail.jpeg',
					video_link: 'product-image.jpeg'
				}
			],
			// media: {
			// 	images: {
			// 		thumbnails: [
			// 			'product-image-thumbnail.jpeg',
			// 			'product-image-front-thumbnail.jpeg',
			// 			'product-image-back-thumbnail.jpeg'
			// 		],
			// 		standard_image: [
			// 			'product-image.jpeg',
			// 			'product-image-front.jpeg',
			// 			'product-image-back.jpeg'
			// 		],
			// 		zoom_image: [
			// 			'product-image-large.jpeg',
			// 			'product-image-front-large.jpeg',
			// 			'product-image-back-large.jpeg'
			// 		]
			// 	},
			// 	videos: [
			// 		''
			// 	]
			// }
		};

		this.productMedia = this.productData.media;

		// Product Quantity check.
		this.productQuantity = this.productData.quantity_added == 0 ? 1 : this.productData.quantity_added;
	},
	methods: {
		updateQuantity(incrementFactor) {
			this.productQuantity += incrementFactor;
		}
	}
}
</script>

<style scoped>
@import '../css/commonStyles.css';
</style>
