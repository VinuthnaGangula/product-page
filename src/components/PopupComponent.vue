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
                            <div class="h-4/5">
                                <div class="pr-2 w-2/3 h-full float-left self-center">
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
                                            <div id="active-image-web-container" class="block" :class="[zoomInFlagWeb ? 'cursor-zoom-out' : 'cursor-zoom-in']" @click="(event) => toggleZoomInWeb(event)">
                                                <img id="active-image-web" class="relative"
                                                :class="[zoomInFlagWeb ? 'scale-200 top-0 left-0 h-full overflow-hidden' : 'h-full top-0 left-1/2 -translate-x-1/2 scale-100 object-contain']" :src="require('../assets/ProductImages/' + images[activeTabIndex].standard_image)" alt="product-image">
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
                                    <div v-if="activeTab == 'VIDEOS' && videos.length > 0" class="py-4 flex gap-2 md:gap-4 justify-center md:justify-start align-center">
                                        <div class="w-[80px] h-[60px] flex justify-center align-center rounded px-2" :class="[activeTabIndex == index ? 'border-2 border-indigo-500' : '']" v-for="video, index in videos" :key="index" @click="updateSelectedMediaWeb(index)">
                                            <img class="object-contain cursor-pointer" :src="require('../assets/ProductImages/' + video.thumbnail)" alt="thumbnail">
                                        </div>
                                    </div>
                                    <div v-if="activeTab == 'IMAGES' && images.length > 0" class="py-4 flex gap-2 md:gap-4 justify-center md:justify-start align-center">
                                        <div class="" v-for="image, index in images" :key="index" @click="updateSelectedMediaWeb(index)">
                                            <img class="rounded p-2 w-[80px] h-[100px] object-contain cursor-pointer" :class="[activeTabIndex == index ? 'border-2 border-indigo-500' : '']" :src="require('../assets/ProductImages/' + image.thumbnail)" alt="thumbnail">
                                        </div>
                                    </div>

                                    <!-- Zoom -->
                                    <!-- <div v-if="zoomInFlagMobile" class="p-4 bg-gray-400/75 rounded-lg cursor-pointer fixed inset-0 flex items-center justify-center z-50">
                                        <button @dblclick="zoomInFlagMobile = !zoomInFlagMobile" class="p-4 bg-white rounded flex justify-center align-center">
                                            <img class="max-w-[80vw] max-h-[80vh] object-contain p-4" :src="require('../assets/ProductImages/' + images[activeTabIndex].zoom_image)" alt="product-zoom-image">
                                        </button>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

			<div class="bg-white rounded-lg h-full">
				<div v-if="!loadingFlag" class="display-mobile h-full">
					<!-- Back button -->
					<div align="left" class="p-2">
						<button class="px-4 py-1 rounded border-2 border-gray-300" @click="closePopup()">
							<span class="text-sm font-semibold text-gray-600">Back</span>
						</button>
					</div>

                    <!-- <div class="z-100 w-[100%] h-[100%] hidden object-cover transition ease bg-no-repeat" id="zoom-container" @dblclick="zoomImage()" @touchstart="onTouchStart" @touchend="onTouchStop" @touchmove="onTouchMove">
                        <img class="aspect-[3/5] object-contain cursor-pointer" :src="require('../assets/ProductImages/' + medium.standard_image)" alt="product-image">
                    </div> -->
	
					<!-- Content -->
					<div class="py-2 relative">
                        <!-- Display Content -->
                        <div class="" @touchstart="onTouchStart" @touchend="onTouchStop" @touchmove="onTouchMove">
                            <!-- All elements -->
                            <ul class="flex h-[90vh] list-none" :style="imageWidth">
                                <li class="w-[100%] flex justify-center align-center transition-transform ease-linear duration-75" :style="currentImagePosition" v-for="medium, index in product_data.media" :key="index">
                                    <div class=" flex align-center">
                                        <div v-if="medium.type == 'VIDEO'" class="flex align-center">
                                            <video class="aspect-[16/9] max-h-[450px]" controls autoplay muted>
                                                <source :src="require('../assets/ProductVideos/' + medium.video)" type="video/mp4">
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                        <div v-else class=" flex justify-center align-center">
                                            <div class="" @dblclick="(event) => zoomImage(event)">
                                                <!-- <div class=" relative" :class="[zoomInFlagMobile ? 'w-[200%]' : '']">
                                                    <img id="image-tag" :class="[zoomInFlagMobile ? 'scale-200' : '']" class="absolute left-0 top-0 aspect-[3/5] object-contain cursor-pointer" :src="require('../assets/ProductImages/' + medium.standard_image)" alt="product-image">
                                                </div> -->

                                                <div id="image-container" class="imageContainer z-100">
                                                    <!-- <img id="image-tag" :class="[screenWidth < 350 ? 'h-[280px]' : '']" class="max-h-[450px] object-cover cursor-pointer" :src="require('../assets/ProductImages/' + medium.standard_image)" alt="product-image"> -->
                                                    <img id="image-tag"
                                                        :class="[zoomInFlagMobile ? 'scale-200 h-full overflow-clip' : 'scale-100']"
                                                        
                                                        class=" cursor-pointer"
                                                        :src="require('../assets/ProductImages/' + medium.standard_image)"
                                                        alt="product-image"
                                                    >
                                                    <!-- :class="[screenWidth < 350 ? 'h-[280px]' : 'max-h-[450px]']" -->
                                                    <!-- <img id="zoom-tag" v-else :class="[screenWidth < 350 ? 'h-[280px]' : '']" class="max-h-[450px] object-cover cursor-pointer" :src="require('../assets/ProductImages/' + medium.standard_image)" alt="product-image"> -->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <!-- Thumbnails -->
                        <div class="absolute bottom-0">
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
                    
                    <!-- <div v-if="zoomInFlagMobile" id="zoom-container" @dblclick="(event) => zoomImage(event)" class="p-4 bg-gray-400/75 rounded-lg cursor-pointer fixed inset-0 flex items-center justify-center z-50">
                        <button class="p-4 bg-white rounded flex justify-center align-center">
                            <img class="max-w-[60vw] max-h-[60vh] object-contain p-4" :src="require('../assets/ProductImages/' + product_data.media[activeIndex].zoom_image)" alt="product-zoom-image">
                        </button>
                    </div> -->
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
			zoomInFlagWeb: false,
			zoomInFlagMobile: false,
            currentImagePosition: null,
            activeImageBounds: null,
            previousZoomX: null,
            previousZoomY: null
		}
	},
    computed: {
        imageWidth() {
            return { width: this.product_data.media.length * 100 + '%' }
        }
    },
    watch: {
        activeIndex() {
            this.currentImagePosition = { transform: 'translateX(-' + this.activeIndex * 100 + '%)' };
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
        let delay = setInterval(() => {
            this.activeImageBounds = document.getElementById('image-tag').getBoundingClientRect();
            console.log('this.activeImageBounds: ', this.activeImageBounds);

            clearInterval(delay);
        }, 1000);
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
            console.log('spy: ', event);
            this.swipeStartX = event.touches[0].clientX;
            this.swipeStartY = event.touches[0].clientY;
        },
        onTouchStop() {
			console.log('this.isSwiping: ', this.isSwiping);
            if (this.isSwiping && this.swipeEndX != null) {
                let swipeLengthX = this.swipeStartX - this.swipeEndX;
				console.log('swipeLenX: ', swipeLengthX, this.swipeStartX, this.swipeEndX);

                let swipeLengthY = this.swipeStartY - this.swipeEndY;
                console.log('swipeLengthY: ', swipeLengthY);


                if (!this.zoomInFlagMobile) {
                    if (swipeLengthX > 50) {
                        // Left Swipe
                        // let activeTabLength = (this.activeTab == 'VIDEOS' ? this.videos.length : this.images.length);
                        this.activeIndex = (this.activeIndex + 1) % this.product_data.media.length;
                    } else if (swipeLengthX < -50) {
                        // Right Swipe
                        // let activeTabLength = (this.activeTab == 'VIDEOS' ? this.videos.length : this.images.length);
                        this.activeIndex = (this.product_data.media.length + this.activeIndex - 1) % this.product_data.media.length;
                    }
                } else {
                    // this.previousZoomX = 
                    // this.displayZoomImage(this.swipeEndX, this.swipeEndY);
                    let imageContainer = document.getElementById('image-tag');

                    // let zoomContainer = document.getElementById('zoom-container');
                    // let backgroundPosition = window.getComputedStyle(zoomContainer).getPropertyValue('background-position').split(' ');

                    // let offsetX = (parseInt(backgroundPosition[0].split('px')[0]) + swipeLengthX);
                    // let offsetY = parseInt(backgroundPosition[1].split('px')[0]) + swipeLengthY;
                    // console.log('offsets: ', offsetX, offsetY);

                    // let positionX = offsetX < (-1 * this.activeImageBounds.width / 2) ? 0 : (offsetX >= 0 ? (-1 * (this.activeImageBounds.width / 2)) : offsetX);
                    // let positionY = offsetY < (-1 * this.activeImageBounds.height / 2) ? 0 : (offsetY >= 0 ? (-1 * (this.activeImageBounds.height / 2)) : offsetY);

                    // zoomContainer.style.backgroundPosition = positionX + 'px ' + positionY + 'px';
                    // console.log('zoomContainer.style.backgroundPosition: ', zoomContainer.style.backgroundPosition);

                    // imageContainer.classList.add('hidden');
                    // zoomContainer.classList.remove('hidden');
                }

				this.swipeStartX = null;
				this.swipeEndX = null;
                this.isSwiping = false;
            } else if (this.swipeEndX == null) {
				this.swipeStartX = null;
                this.isSwiping = false;
            }
			console.log('this.isSwiping: ', this.isSwiping);
        },
        onTouchMove(event) {
            this.swipeEndX = event.touches[0].clientX;
            this.swipeEndY = event.touches[0].clientY;
        },
		zoomImage(event) {
			console.log('this.isSwiping: ', this.isSwiping);
			if (!this.isSwiping) {
				this.zoomInFlagMobile = !this.zoomInFlagMobile;

                if (this.zoomInFlagMobile) {
                //     this.previousZoomX = event.offsetX;
                //     this.previousZoomY = event.offsetY;

                //     this.displayZoomImage(event.offsetX, event.offsetY);
                //     // let delay = setInterval(() => {
                //     //     this.displayZoomImage(event.offsetX, event.offsetY);
                //     //     clearInterval(delay);
                //     // }, 1000);
                // } else {
                    let imageContainer = document.getElementById('image-container');
                    let imageTag = document.getElementById('image-tag');

                    imageTag.classList.add('absolute');
                    // imageTag.classList.add('absolute');
                    imageContainer.style.width = this.activeImageBounds.width * 2 + 'px';
                    imageContainer.style.height = this.activeImageBounds.height * 2 + 'px';

                    let offsetX = ((this.activeImageBounds.width * 2) - window.innerWidth) / 2;
                    console.log('offsetX: ', offsetX);
                    imageContainer.style.transform = 'translate(' + offsetX + 'px, 0px' + ')';
                    console.log('imageContainer.style.transform: ', imageContainer.style.transform);
                    

                    let highlightX = (event.offsetX > (imageContainer.style.width/2)) ? (imageContainer.style.width - event.offsetX > (imageContainer.style.width/2) ? event.offsetX - (imageContainer.style.width/2) : eventOffsetX - (this.activeImageBounds.width/4)) : 0;
                    let highlightY = (event.offsetY > (imageContainer.style.height/2)) ? (imageContainer.style.height - event.offsetY > (imageContainer.style.height/2) ? event.offsetY - (imageContainer.style.height/2) : eventOffsetY - (imageContainer.style.height/2)) : 0;
            
                    imageContainer.style.left = highlightX + 'px';
                    imageContainer.style.top = highlightY + 'px';
                    
                //     let zoomContainer = document.getElementById('zoom-container');

                //     imageContainer.classList.remove('hidden');
                //     zoomContainer.classList.add('hidden');
                } else {
                    let imageContainer = document.getElementById('image-container');
                    let imageTag = document.getElementById('image-tag');

                    imageTag.classList.remove('absolute');
                    // imageTag.classList.add('absolute');
                    imageContainer.style.width = this.activeImageBounds.width / 2 + 'px';
                    imageContainer.style.height = this.activeImageBounds.height / 2 + 'px';

                    imageContainer.style.transform = 'none';
                    // let offsetX = ((this.activeImageBounds.width * 2) - window.innerWidth) / 2;
                    // console.log('offsetX: ', offsetX);
                    // imageContainer.style.transform = 'translate(' + offsetX + 'px, 0px' + ')';
                    // console.log('imageContainer.style.transform: ', imageContainer.style.transform);
                    

                    // let highlightX = (event.offsetX > (imageContainer.style.width/2)) ? (imageContainer.style.width - event.offsetX > (imageContainer.style.width/2) ? event.offsetX - (imageContainer.style.width/2) : eventOffsetX - (this.activeImageBounds.width/4)) : 0;
                    // let highlightY = (event.offsetY > (imageContainer.style.height/2)) ? (imageContainer.style.height - event.offsetY > (imageContainer.style.height/2) ? event.offsetY - (imageContainer.style.height/2) : eventOffsetY - (imageContainer.style.height/2)) : 0;
            
                    // imageContainer.style.left = 0 + 'px';
                    // imageContainer.style.top = 0 + 'px';
                }

                console.log('event: ', event);
			}
		},
        displayZoomImage(eventOffsetX, eventOffsetY) {
            let imageTag = document.getElementById('image-tag');

            let highlightX = (eventOffsetX > (this.activeImageBounds.width/4)) ? (this.activeImageBounds.width - eventOffsetX > (this.activeImageBounds.width/4) ? eventOffsetX - (this.activeImageBounds.width/4) : eventOffsetX - (this.activeImageBounds.width/4)) : 0;
            let highlightY = (eventOffsetY > (this.activeImageBounds.height/4)) ? (this.activeImageBounds.height - eventOffsetY > (this.activeImageBounds.height/4) ? eventOffsetY - (this.activeImageBounds.height/4) : eventOffsetY - (this.activeImageBounds.height/4)) : 0;
            
            console.log('highlight: ', highlightX, highlightY);

            imageTag.style.left = highlightX + 'px';
            imageTag.style.top = highlightY + 'px';

            // let zoomContainer = document.getElementById('zoom-container');

            // zoomContainer.style.width = this.activeImageBounds.width * 2 + 'px';
            // zoomContainer.style.height = this.activeImageBounds.height * 2 + 'px';

            console.log('this.activeImageBounds.width * 2: ', this.activeImageBounds.width * 2, this.activeImageBounds.height * 2);
            let imagePath = require('../assets/ProductImages/' + this.product_data.media[this.activeIndex].standard_image);
            // zoomContainer.style.backgroundImage = `url(${imagePath})`;

            // zoomContainer.style.backgroundSize = this.activeImageBounds.width * 2 + 'px ' + this.activeImageBounds.height * 2 + 'px';

            // zoomContainer.style.backgroundPosition = '-' + highlightX * 2 + 'px ' + '-' + highlightY * 2 + 'px';
            // console.log('zoomContainer.style.backgroundPosition: ', zoomContainer.style.backgroundPosition);

            // imageContainer?.classList.add('hidden');
            // zoomContainer.classList.remove('hidden');
        },
		updateSelectedMediaWeb(index) {
            this.activeTabIndex = index;
        },
        updateSelectedMediaMobile(index) {
            this.activeIndex = index;

            // let delay = setInterval(() => {
            //     this.activeImageBounds = document.getElementById('image-tag').getBoundingClientRect();
            //     console.log('this.activeImageBounds: ', this.activeImageBounds);

            //     clearInterval(delay);
            // }, 1000);
        },
		closePopup() {
			this.$emit('closePopupEvent');
		},
        toggleZoomInWeb(event) {
            console.log('event: ', event);
            this.zoomInFlagWeb = !this.zoomInFlagWeb;

            if (this.zoomInFlagWeb) {

            }
        }
	}
}
</script>

<style scoped>
@import '../css/commonStyles';

#zoom-container {
    transition: background-image 2s ease;
}
</style>
