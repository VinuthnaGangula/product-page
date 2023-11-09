<template>
	<div class="bg-neutral-100">
		<!-- Header -->
		<div class="mb-2 md:mb-4 lg:mb-8 bg-white">
			<div class="pl-4 md:pl-8 py-4 flex justify-start align-center w-[40%] md:w-[100%] h-[10vh]">
				<img class="object-contain" src="../assets/tbps-logo.webp" alt="logo">
			</div>
		</div>

		<div v-if="!loadingFlag" class="container md:h-[90vh]">
			<!-- Product Section -->
			<div class="py-4 md:py-8 px-4 md:px-8 flex flex-col justify-start md:justify-between align-center md:flex-row">
				<!-- Product Media Section -->
				<div class="w-[100%] md:w-[48%] pb-4 md:pb-0">
					<div>
                        <!-- Popup Viewer Component -->
                        <div v-if="viewPopup">
                            <PopupViewer @closePopupEvent="closePopup()" :media="sortProductMedia" :selected_id="sortProductMedia[selectedIndex].id"></PopupViewer>
                        </div>

                        <div class="bg-white">
                            <div class="mx-4">
                                <!-- Active Media Content -->
                                <div class="relative">
                                    <!-- Prev Button -->
                                    <div class="pr-1 absolute z-30 left-0 top-1/2">
                                        <button class="rounded-full" @click="updateSelectedMedia(selectedIndex - 1)">
                                            <img class="w-[24px] md:w-[32px] h-[24px] md:h-[32px]" src="../assets/HelperIcons/previous-icon.svg">
                                        </button>
                                    </div>

                                    <!-- Next Button -->
                                    <div class="pl-1 z-30 absolute right-0 top-1/2">
                                        <button class="rounded-full" @click="updateSelectedMedia(selectedIndex + 1)">
                                            <img class="w-[24px] md:w-[32px] h-[24px] md:h-[32px]" src="../assets/HelperIcons/next-icon.svg">
                                        </button>
                                    </div>
                                    
                                    <div class="display-web">
                                        <div class="w-[100%]">
											<div class="h-[384px] flex justify-center align-center">
												<div class="p-8">
													<button @click="openPopupView()">
														<div class="picture relative" id="picture">
															<div v-if="sortProductMedia[selectedIndex].type != 'VIDEO'" class="absolute w-[100px] h-[100px] border-2 border-black bg-neutral-400 pointer-events-none highlight-class z-50 opacity-0" id="highlight">
															</div>

															<img class="h-[320px] object-contain cursor-pointer" :src="require('../assets/ProductImages/' + sortProductMedia[selectedIndex].standard_image)" alt="product-image">
														</div>
													</button>
												</div>
											</div>
                                        </div>
                                    </div>

                                    <div class="display-mobile">
                                        <div class="pt-4 h-[220px] flex justify-center align-center">
                                            <div class="flex justify-center align-center" @touchstart="onTouchStart" @touchend="onTouchStop" @touchmove="onTouchMove">
                                                <button class="flex justify-center align-center items-center" @click="openPopupView()">
                                                    <img :class="sortProductMedia[selectedIndex].type == 'VIDEO' ? 'w-[80%]' : 'h-[180px]'" class="flex justify-center align-center object-contain cursor-pointer" :src="require('../assets/ProductImages/' + sortProductMedia[selectedIndex].standard_image)" alt="product-image">
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Thumbnails -->
                                <div class="p-4 flex gap-2 md:gap-4 justify-center md:justify-start align-center">
                                    <div :class="[selectedIndex == index ? 'border-2 border-indigo-500' : '']" class="w-[36px] md:w-[70px] h-[44px] md:h-[80px] rounded p-1 md:p-2 flex justify-center align-center" v-for="medium, index in sortProductMedia" :key="index" @click="updateSelectedMedia(index)">
                                        <img v-if="medium.type == 'IMAGE'" class="object-contain cursor-pointer" :src="require('../assets/ProductImages/' + medium.thumbnail)" alt="thumbnail">
                                        <img v-else class="object-contain cursor-pointer" :src="require('../assets/HelperIcons/video-icon.png')" alt="thumbnail">
									</div>
                                </div>
                            </div>
                        </div>
                    </div>
				</div>

				<!-- Product Info Section -->
				<div class="relative flex flex-col md:w-[48%] bg-neutral-100">
                    <div v-if="sortProductMedia[selectedIndex].type != 'VIDEO'" id="zoom" class="hidden lg:block w-[100vw] border-2 border-black zoomed-image absolute w-[500px] h-[500px] pointer-events-none z-100 opacity-0">
                    </div>

					<div class="">
						<!-- Brand & Stock -->
						<div class="pb-2 pt-2 sm:pt-0 flex flex-wrap justify-between">
							<div>
								<p align="left" class="m-0 font-sans text-sm md:text-lg text-gray-400">{{ productData.brand_name }}</p>
							</div>

							<div>
								<p align="left" class="m-0 font-sans text-sm lg:text-md font-normal text-teal-600">{{ productData.stock_info }}</p>
							</div>
						</div>

						<p align="left" class="m-0 font-sans py-1 md:py-2 text-base md:text-xl text-black font-semibold">{{ productData.product_name }}</p>

						<p align="left" class="m-0 font-sans py-1 md:py-2 text-base md:text-xl text-black font-semibold">{{ productData.price }}</p>

						<!-- Line -->
						<div class="py-2">
							<div class="border-t-2 border-gray-300"></div>
						</div>

						<!-- Properties -->
						<div v-for="property, index in productData.properties" :key="index">
							<p align="left" class="m-0 font-sans py-1 md:py-2 text-sm md:text-md"><span class="font-medium text-black">{{ property.name }}</span>: <span class="">{{ property.value }}</span></p>
						</div>

						<!-- Line -->
						<div class="py-2">
							<div class="border-t-2 border-gray-300"></div>
						</div>

						<!-- Product Quantity -->
						<div class="pt-2 flex justify-center md:justify-start align-center">
							<button :disabled="disableButton" class="pr-2" @click="updateQuantity(-1)">
								<span class="text-xl text-color-slate-600">
									<img class="w-[20px] h-[20px]" src="../assets/HelperIcons/remove-icon.png">
								</span>
							</button>

							<div class="mx-2 bg-slate-200">
								<p align="left" class="m-0 font-sans px-4 py-2 w-[50px] text-slate-600 text-md md:text-xl font-semibold flex justify-center align-center">{{ productData.quantity_added == 0 ? productQuantity : productData.quantity_added }}</p>
							</div>

							<button class="pl-2" @click="updateQuantity(1)">
								<span class="text-xl text-color-slate-600">
									<img class="w-[20px] h-[20px]" src="../assets/HelperIcons/add-icon.png">
								</span>
							</button>
						</div>

						<!-- Add to Basket -->
						<div class="pt-4 w-full">
							<button class="px-4 py-2 w-[100%] bg-yellow-300 rounded">
								<span class="font-semibold text-md md:text-xl">Add to Basket</span>
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
        'PopupViewer': () => import('../components/PopupComponent.vue'),
	},
	data() {
		return {
			productData: {},
			productMedia: {},
			productQuantity: 1,
			sortProductMedia: [],
            viewPopup: false,
            selectedIndex: 0,
            selectedMedium: null,
            isSwiping: false,
            swipeStart: 0,
            swipeEnd: null,
            zoomOnHoverFlag: false,
            loadingFlag: true,
            imageKey: 0,
			disableButton: true
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
					thumbnail: 'product-video-image.png',
					standard_image: 'product-video-image.png',
					video: 'SampleVideo.mp4'
				}
			]
		};

		this.productMedia = this.productData.media;

		// Product Quantity check.
		this.productQuantity = this.productData.quantity_added == 0 ? 1 : this.productData.quantity_added;

		this.sortProductMedia = this.productData.media.sort((medium1, medium2) => {
            return medium1.placement - medium2.placement
        });

        this.selectedMedium = this.sortProductMedia[0];

        this.loadingFlag = false;
	},
    updated() {
        let delay = setInterval(() => {
            if (this.sortProductMedia[this.selectedIndex].type != 'VIDEO') {
                let mainContainer = document.querySelector('#picture');

                let rect = document.querySelector("#highlight");

                let zoom = document.querySelector("#zoom");

                let imagePath = require('../assets/ProductImages/' + this.selectedMedium.standard_image);
                zoom.style['background-image'] = `url(${imagePath})`;

                let originalImageBounds = mainContainer.getBoundingClientRect();

                zoom.style.backgroundSize = originalImageBounds.width * 5 + 'px ' + originalImageBounds.height * 5 + 'px';

                mainContainer.addEventListener('mousemove', function(event) {
                    let highlightX = (event.offsetX > 50) ? (originalImageBounds.width - event.offsetX > 50 ? event.offsetX - 50 : originalImageBounds.width - 100) : 0;
                    let highlightY = (event.offsetY > 50) ? (originalImageBounds.height - event.offsetY > 50 ? event.offsetY - 50 : originalImageBounds.height - 100) : 0;

                    rect.style.left = highlightX + 'px';
                    rect.style.top = highlightY + 'px';

                    zoom.style.backgroundPosition = '-' + highlightX * 5 + 'px ' + '-' + highlightY * 5 + 'px';

					rect.style.opacity = 0.5;
                    zoom.style.opacity = 1;
                });

                mainContainer.addEventListener('mouseout', function() {
					rect.style.opacity = 0;
                    zoom.style.opacity = 0;
                });    
            }
            
            clearInterval(delay);
        }, 1500);
    },
	methods: {
		updateQuantity(incrementFactor) {
			this.productQuantity += incrementFactor;
			if (this.productQuantity == 0) {
				this.disableButton = true;
				this.productQuantity -= incrementFactor;
			} else {
				this.disableButton = false;
			}
		},
        updateSelectedMedia(index) {
            this.selectedIndex = index >= 0 && index < this.sortProductMedia.length ? index : (this.sortProductMedia.length + index) % this.sortProductMedia.length;
            this.selectedMedium = this.sortProductMedia[this.selectedIndex];

            if (window.innerWidth > 768 && this.selectedMedium.type != 'VIDEO') {
                let zoom = document.querySelector("#zoom");
                let imagePath = require('../assets/ProductImages/' + this.selectedMedium.standard_image);
                zoom.style['background-image'] = `url(${imagePath})`;
            }
        },
        onTouchStart(event) {
            this.isSwiping = true;
            this.swipeStart = event.touches[0].clientX;
        },
        onTouchStop() {
            if (this.isSwiping && this.swipeEnd != null) {
                let swipeLength = this.swipeStart - this.swipeEnd;

                if (swipeLength > 50) {
                    // Left Swipe
                    this.selectedIndex = (this.selectedIndex + 1) % this.sortProductMedia.length;
                    this.selectedMedium = this.sortProductMedia[this.selectedIndex];
                } else if (swipeLength < -50) {
                    // Right Swipe
                    this.selectedIndex = (this.sortProductMedia.length + this.selectedIndex - 1) % this.sortProductMedia.length;
                    this.selectedMedium = this.sortProductMedia[this.selectedIndex];
                }

                this.swipeStart = null;
				this.swipeEnd = null;
                this.isSwiping = false;
            } else if (this.swipeEnd == null) {
                this.swipeStart = null;
                this.isSwiping = false;
            }
        },
        onTouchMove(event) {
            this.swipeEnd = event.touches[0].clientX;
        },
        openPopupView() {
            if (!this.isSwiping) {
                this.viewPopup=true;
            }
        },
        closePopup() {
            this.viewPopup = false;
        }
	}
}
</script>

<style scoped>
@import '../css/commonStyles.css';

.highlight-active-class {
    opacity: 0.5;
}
</style>
