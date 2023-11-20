<template>
	<div>
		<div class="bg-gray-400/75 rounded-lg fixed inset-0 flex items-center justify-center z-50">
            <div class="bg-white rounded">
                <div v-if="!loadingFlag" class="display-web container p-4 w-[90vw] h-[70vh] rounded-lg border-2 border-black overflow-auto">
                    <div class="relative h-[100%]">
                        <!-- Close Button for Web -->
                        <div class="absolute top-0 right-0">
                            <button @click="closePopup()" class="px-2 py-0 rounded border-2 border-indigo-400">X</button>
                        </div>

                        <div class="h-[100%]">
                            <div class="py-4">
                                <!-- Tabs -->
                                <div align="left">
                                    <button v-if="videos.length > 0" class="px-4 py-2" @click="activateTab('VIDEOS')" :class="[activeTab == 'VIDEOS' ? 'border-b-2 border-indigo-400' : '']">
                                        <span class="text-xl font-medium">Videos</span>
                                    </button>
        
                                    <button v-if="images.length > 0" class="px-4 py-2" @click="activateTab('IMAGES')" :class="[activeTab == 'IMAGES' ? 'border-b-2 border-indigo-400' : '']">
                                        <span class="text-xl font-medium">Images</span>
                                    </button>
                                </div>
                            </div>
        
                            <!-- Content -->
                            <div class="h-4/5 overflow-hidden">
                                <div class="pr-2 w-2/3 h-full float-left self-center overflow-hidden">
                                    <div v-if="activeTab == 'VIDEOS'" class="h-full">
                                        <!-- Display Content -->
                                        <div v-if="videos.length > 0" class="h-full flex justify-center align-center">
                                            <video class="flex align-center" autoplay controls muted>
                                                <source :src="require('../assets/ProductVideos/' + videos[activeTabIndex].video)" type="video/mp4">
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    </div>
            
                                    <div v-else class="h-full flex justify-center align-center">
                                        <!-- Display Content -->
                                        <div id="active-image-web-container" :key="activeImageWebKey" class="relative" :class="[zoomInFlagWeb ? 'cursor-zoom-out' : 'cursor-zoom-in']" @click="(event) => zoomImageWeb(event)">
                                            <img id="active-image-web" class="transition-all ease duration-500" 
                                            :class="[zoomInFlagWeb ? 'h-full overflow-hidden transition ease duration-750' : 'h-full mx-auto origin-center object-contain']" :src="require('../assets/ProductImages/' + images[activeTabIndex].standard_image)" alt="product-image">
                                        </div>
                                    </div>
                                </div>

                                <!-- Product Info & Thumbnails -->
                                <div class="pl-2 float-right flex flex-col w-1/3">
                                    <!-- Product Info -->
                                    <div>
                                        <p class="m-0 text-lg font-medium" align="left">{{ product_data.product_title }} <span>({{ product_data.colour }})</span></p>
                                    </div>

                                    <!-- Thumbnails -->
                                    <div v-if="activeTab == 'VIDEOS' && videos.length > 0" class="py-4 flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start align-center">
                                        <div class="w-[80px] h-[60px] flex justify-center align-center rounded px-2" :class="[activeTabIndex == index ? 'border-2 border-indigo-500' : '']" v-for="video, index in videos" :key="index" @click="updateSelectedMediaWeb(index)">
                                            <img class="object-contain cursor-pointer" :src="require('../assets/ProductImages/' + video.thumbnail)" alt="thumbnail">
                                        </div>
                                    </div>
                                    <div v-if="activeTab == 'IMAGES' && images.length > 0" class="py-4 flex flex-wrap gap-2 md:gap-4 justify-center md:justify-start align-center">
                                        <div class="" v-for="image, index in images" :key="index" @click="updateSelectedMediaWeb(index)">
                                            <img class="rounded p-2 w-[80px] h-[100px] object-contain cursor-pointer" :class="[activeTabIndex == index ? 'border-2 border-indigo-500' : '']" :src="require('../assets/ProductImages/' + image.thumbnail)" alt="thumbnail">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

			<div class="bg-white rounded-lg h-full">
				<div v-if="!loadingFlag" class="display-mobile h-full">
					<!-- Back button -->
					<div align="left" class="p-2 sticky top-0">
						<button class="px-4 py-1 rounded border-2 border-gray-300" @click="closePopup()">
							<span class="text-sm font-semibold text-gray-600">Back</span>
						</button>
					</div>
	
					<!-- Content -->
					<div class="py-2 relative">
                        <!-- Display Content -->
                        <div class="" @touchstart="onTouchStart" @touchend="onTouchStop" @touchmove="onTouchMove">
                            <!-- All elements -->
                            <ul class="flex h-[80vh] overflow-hidden list-none" :style="imageWidth">
                                <li class="w-[100%] flex justify-center align-center transition ease-linear duration-500" :style="currentImagePosition" v-for="medium, index in product_data.media" :key="index">
                                    <div class="my-auto flex align-center">
                                        <div v-if="medium.type == 'VIDEO'" class="flex align-center">
                                            <video class="aspect-[16/9] max-h-[450px]" controls autoplay muted>
                                                <source :src="require('../assets/ProductVideos/' + medium.video)" type="video/mp4">
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                        <div v-else class="my-auto">
                                            <div class="my-auto" @dblclick="(event) => zoomImage(event)">
                                                <div :id="'image-container' + index" :key="activeImageMobileKey" @click="(event) => zoomImageWeb(event)">
                                                    <img :id="'image-tag' + index" class="transition-all ease duration-500" 
                                                    :src="require('../assets/ProductImages/' + medium.standard_image)" alt="product-image">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <!-- Thumbnails -->
                        <div class="mt-4 sticky bottom-0">
                            <div class="p-4 flex gap-2 justify-center align-center">
                                <div class="rounded p-1 flex align-center"
                                    :class="[activeIndex == index ? 'border-2 border-indigo-500' : '']"
                                    v-for="medium, index in product_data.media" :key="index" @click="updateSelectedMediaMobile(index)"
                                >
                                    <img class="object-contain cursor-pointer w-[60px] h-[70px]"
                                        :class="[medium.type == 'VIDEO' ? 'self-center' : '']"
                                        :src="medium.type == 'VIDEO' ? require('../assets/HelperIcons/video-icon.png') : require('../assets/ProductImages/' + medium.thumbnail)" alt="thumbnail"
                                    >
                                </div>
                            </div>
                        </div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
    name: 'PopupViewer',
    props: {
		product_data: {
			type: Object,
			required: true
		},
		selected_id: {
			type: Number,
			required: true
		}
    },
	data() {
		return {
            screenWidth: null,
			activeTab: 'VIDEOS',
			images: [],
			videos: [],
            loadingFlag: true,
            activeIndex: null,
			activeTabIndex: null,
			isSwiping: false,
            swipeStartX: null,
            swipeEndX: null,
            swipeStartY: null,
            swipeEndY: null,
            previousOriginX: null,
            previousOriginY: null,
			zoomInFlagWeb: false,
			zoomInFlagMobile: false,
            currentImagePosition: null,
            activeImageBounds: null,
            activeImageBoundsWeb: null,
            activeImageWebKey: 0,
            activeImageMobileKey: 0
		}
	},
    computed: {
        imageWidth() {
            return { width: this.product_data.media.length * 100 + '%' }
        }
    },
    watch: {
        activeIndex() {
            if (this.zoomInFlagMobile) {
                this.zoomInFlagMobile = false;
                this.activeImageMobileKey++;
            }
            this.currentImagePosition = { transform: 'translateX(-' + this.activeIndex * 100 + '%)' };
            if (this.product_data.media[this.activeIndex].type == 'IMAGE') {
                let delay = setInterval(() => {
                    this.activeImageBounds = document.getElementById('image-tag' + this.activeIndex).getBoundingClientRect();
    
                    clearInterval(delay);
                }, 300);
            }
        },
        activeTabIndex() {
            if (this.zoomInFlagWeb) {
                this.zoomInFlagWeb = false;
                this.activeImageWebKey++;
            }
            if (this.activeTab == 'IMAGES') {
                let delay = setInterval(() => {
                    this.activeImageBoundsWeb = document.getElementById('active-image-web-container').getBoundingClientRect();
    
                    clearInterval(delay);
                }, 200);
            }
        },
        zoomInFlagMobile() {
            
        }
    },
	mounted() {
        this.screenWidth = window.screenWidth;
        this.media = this.product_data.media;

		this.images = this.media.filter((medium) => medium.type == 'IMAGE');
		this.videos = this.media.filter((medium) => medium.type == 'VIDEO');


		this.activeIndex = this.media.findIndex((medium) => medium.id == this.selected_id);
		this.activeTab = this.media[this.activeIndex].type == 'IMAGE' ? 'IMAGES' : 'VIDEOS';
		this.activeTabIndex = this.activeTab == 'VIDEOS' ? this.videos.findIndex((medium) => medium.id == this.selected_id) : this.images.findIndex((medium) => medium.id == this.selected_id);

        this.loadingFlag = false;
	},
    updated() {
        
    },
	methods: {
		activateTab(tab) {
			if (tab != this.activeTab) {
				this.activeTabIndex = 0;
			}

			this.activeTab = tab;
		},
		onTouchStart(event) {
            this.isSwiping = true;
            this.swipeStartX = event.touches[0].clientX;
            this.swipeStartY = event.touches[0].clientY;
        },
        onTouchStop() {
            if (this.isSwiping && this.swipeEndX != null) {
                let swipeLengthX = this.swipeStartX - this.swipeEndX;

                let swipeLengthY = this.swipeStartY - this.swipeEndY;


                if (!this.zoomInFlagMobile) {
                    if (swipeLengthX > 50) {
                        // Left Swipe
                        this.activeIndex = (this.activeIndex + 1) % this.product_data.media.length;
                    } else if (swipeLengthX < -50) {
                        // Right Swipe
                        this.activeIndex = (this.product_data.media.length + this.activeIndex - 1) % this.product_data.media.length;
                    }
                } else {
                    let imageContainer = document.getElementById('image-container' + this.activeIndex);
                    let imageContainerBounds = imageContainer.getBoundingClientRect();
                    let imageTag = document.getElementById('image-tag' + this.activeIndex);

                    let offsetX = this.previousOriginX + swipeLengthX < 0 ? 0 : (this.previousOriginX + swipeLengthX > imageContainerBounds.width ? imageContainerBounds.width : this.previousOriginX + swipeLengthX);
                    let offsetY = this.previousOriginY + swipeLengthY < 0 ? 0 : (this.previousOriginY + swipeLengthY > imageContainerBounds.height ? imageContainerBounds.height : this.previousOriginY + swipeLengthY);

                    imageTag.style.transformOrigin = `${offsetX}px ${offsetY}px`;
                    imageTag.style.transform = 'scale(2)';
                
                }

				this.swipeStartX = null;
				this.swipeEndX = null;
                this.isSwiping = false;
            } else if (this.swipeEndX == null) {
				this.swipeStartX = null;
                this.isSwiping = false;
            }
        },
        onTouchMove(event) {
            this.swipeEndX = event.touches[0].clientX;
            this.swipeEndY = event.touches[0].clientY;
        },
		zoomImage(event) {
			if (!this.isSwiping) {
				this.zoomInFlagMobile = !this.zoomInFlagMobile;

                if (this.zoomInFlagMobile) {
                    let imageTag = document.getElementById('image-tag' + this.activeIndex);

                    let offsetX = event.offsetX - event.target.offsetLeft;
                    let offsetY = event.offsetY - event.target.offsetTop;

                    imageTag.style.transformOrigin = `${offsetX}px ${offsetY}px`;
                    imageTag.style.transform = 'scale(2)';

                    this.previousOriginX = offsetX;
                    this.previousOriginY = offsetY;
                } else {
                    this.activeImageMobileKey++;
                }
			}
		},
        zoomImageWeb(event) {
            this.zoomInFlagWeb = !this.zoomInFlagWeb;

            let imageContainerWeb = document.getElementById('active-image-web-container');
            let imageTagWeb = document.getElementById('active-image-web');

            if (this.zoomInFlagWeb) {
                let offsetX = event.offsetX - event.target.offsetLeft;
                let offsetY = event.offsetY - event.target.offsetTop;

                imageTagWeb.style.transformOrigin = `${offsetX}px ${offsetY}px`;
                imageTagWeb.style.transform = 'scale(2)';

                imageContainerWeb.addEventListener('mousemove', this.onMouseMove);
            } else {
                imageContainerWeb.removeEventListener('mousemove', this.onMouseMove);
                this.activeImageWebKey++;
            }
        },
        onMouseMove(event) {
            let imageTagWeb = document.getElementById('active-image-web');

            let offsetX = event.offsetX - event.target.offsetLeft;
            let offsetY = event.offsetY - event.target.offsetTop;

            imageTagWeb.style.transformOrigin = `${offsetX}px ${offsetY}px`;
        },
		updateSelectedMediaWeb(index) {
            this.activeTabIndex = index;
        },
        updateSelectedMediaMobile(index) {
            this.activeIndex = index;
        },
		closePopup() {
			this.$emit('closePopupEvent');
		},
	}
}
</script>

<style scoped>
@import '../css/commonStyles';

</style>
