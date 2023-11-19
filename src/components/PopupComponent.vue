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
                                            <img id="active-image-web" class=""
                                            :class="[zoomInFlagWeb ? 'h-full overflow-hidden transition ease duration-750' : 'h-full mx-auto origin-center object-contain']" :src="require('../assets/ProductImages/' + images[activeTabIndex].standard_image)" alt="product-image">
                                        </div>

                                        <!-- <div :id="'image-container' + index" class="imageContainer z-100">
                                            <img :id="'image-tag' + index"
                                                :class="[zoomInFlagMobile ? 'scale-200 z-100 h-full' : 'scale-100 object-contain max-h-[60vh]']"
                                                
                                                :src="require('../assets/ProductImages/' + medium.standard_image)"
                                                alt="product-image"
                                            >
                                        </div> -->
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
                                                <div :key="activeImageMobileKey" :id="'image-container' + index" class="imageContainer">
                                                    <img :id="'image-tag' + index"
                                                        class="transition-translate duration-500"
                                                        :class="[zoomInFlagMobile ? 'scale-200 z-100 h-full' : 'scale-100 object-contain max-h-[60vh]']"
                                                        :src="require('../assets/ProductImages/' + medium.standard_image)"
                                                        alt="product-image"
                                                    >
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
                    console.log('this.activeImageBounds: ', this.activeImageBounds);
    
                    clearInterval(delay);
                }, 200);
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
                    console.log('this.activeImageBoundsWeb: ', this.activeImageBoundsWeb);
    
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
                        this.activeIndex = (this.activeIndex + 1) % this.product_data.media.length;
                    } else if (swipeLengthX < -50) {
                        // Right Swipe
                        this.activeIndex = (this.product_data.media.length + this.activeIndex - 1) % this.product_data.media.length;
                    }
                } else {
                    console.log('this.isSwiping blep: ', this.isSwiping);
                    let imageContainer = document.getElementById('image-container' + this.activeIndex);

                    let imageTag = document.getElementById('image-tag' + this.activeIndex);
                    let imageBounds = imageTag.getBoundingClientRect();
                    console.log('imageBounds: ', imageBounds);
                    
                    let translateX = (imageBounds.left - swipeLengthX <= 0) ? ((imageBounds.left - swipeLengthX >= (-1 * imageBounds.width / 2)) ? imageBounds.left - swipeLengthX : (-1 * imageBounds.width / 2)) : 0;
                    let translateY = (imageBounds.top - swipeLengthY <= 0) ? ((imageBounds.top - swipeLengthY >= (-1 * imageBounds.height / 2)) ? imageBounds.top - swipeLengthY : (-1 * imageBounds.height / 2)) : 0;
                    
                    console.log('s: ', translateX, translateY);
                    imageTag.style.transform = 'translate(' + translateX + 'px, ' + translateY + 'px)';
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
		// zoomImage(event) {
		// 	console.log('this.isSwiping: ', this.isSwiping);
		// 	if (!this.isSwiping) {
		// 		this.zoomInFlagMobile = !this.zoomInFlagMobile;

        //         if (this.zoomInFlagMobile) {
        //             console.log('event: ', event);
        //             let imageContainer = document.getElementById('image-container' + this.activeIndex);
        //             let imageTag = document.getElementById('image-tag' + this.activeIndex);

                    
        //             imageContainer.style.width = this.activeImageBounds.width * 2 + 'px';
        //             imageContainer.style.height = this.activeImageBounds.height * 2 + 'px';
                    
        //             let imageContainerBounds = imageContainer.getBoundingClientRect();

        //             let offsetX = ((this.activeImageBounds.width * 2) - window.innerWidth) / 2;
        //             console.log('offsetX: ', offsetX);

        //             imageContainer.style.transform = 'translate(' + -1 * imageContainerBounds.left + 'px, ' + -1 * imageContainerBounds.top + 'px' + ')';

        //             imageContainerBounds = imageContainer.getBoundingClientRect();
        //             console.log('imagecontbound: ', imageContainerBounds);
                    
        //             let leftOffset = (window.innerWidth - this.activeImageBounds.width) / 2;
        //             let topOffset = (window.innerHeight - this.activeImageBounds.height) / 2;

        //             let highlightX = (2 * (event.offsetX - leftOffset) < this.activeImageBounds.width / 2 ? 0 : ((2 * this.activeImageBounds.width - (2 * (event.offsetX - leftOffset)) < (this.activeImageBounds.width / 2)) ? ((window.innerWidth - 2 * (event.offsetX - leftOffset) > 0) ? 0 : this.activeImageBounds.width) : (2 * (event.offsetX - leftOffset) - this.activeImageBounds.width / 2)));

        //             let highlightY = (2 * (event.offsetY - topOffset) < this.activeImageBounds.height / 2 ? 0 : ((2 * this.activeImageBounds.height - (2 * (event.offsetY - topOffset)) < (this.activeImageBounds.height / 2)) ? ((window.innerHeight - 2 * (event.offsetY - topOffset) > 0) ? 0 : this.activeImageBounds.height) : (2 * (event.offsetY - topOffset) - this.activeImageBounds.height / 2)));

        //             console.log('highlights: ', highlightX, highlightY);

        //             imageTag.style.transform = 'translate(' + (-1 * (highlightX)) + 'px, ' + (-1 * highlightY) + 'px' + ')';
        //             console.log('imageContainer.style.transform: ', imageTag.style.transform);
        //         } else {
        //             this.activeImageMobileKey++;
        //             let imageContainer = document.getElementById('image-container' + this.activeIndex);
        //             let imageTag = document.getElementById('image-tag' + this.activeIndex);

        //             imageContainer.classList.remove('relative');
        //             imageTag.classList.remove('absolute');
        //             imageContainer.style.transform = 'none';
        //             imageTag.style.transform = 'none';
        //             // imageTag.classList.add('absolute');
        //             imageContainer.style.width = 'unset';
        //             imageContainer.style.height = 'unset';

        //             // let offsetX = ((this.activeImageBounds.width * 2) - window.innerWidth) / 2;
        //             // console.log('offsetX: ', offsetX);
        //             // imageContainer.style.transform = 'translate(' + offsetX + 'px, 0px' + ')';
        //             // console.log('imageContainer.style.transform: ', imageContainer.style.transform);
                    

        //             // let highlightX = (event.offsetX > (imageContainer.style.width/2)) ? (imageContainer.style.width - event.offsetX > (imageContainer.style.width/2) ? event.offsetX - (imageContainer.style.width/2) : eventOffsetX - (this.activeImageBounds.width/4)) : 0;
        //             // let highlightY = (event.offsetY > (imageContainer.style.height/2)) ? (imageContainer.style.height - event.offsetY > (imageContainer.style.height/2) ? event.offsetY - (imageContainer.style.height/2) : eventOffsetY - (imageContainer.style.height/2)) : 0;
            
        //             // imageContainer.style.left = 0 + 'px';
        //             // imageContainer.style.top = 0 + 'px';
        //         }

        //         console.log('event: ', event);
		// 	}
		// },
        zoomImage(event) {
			console.log('this.isSwiping: ', this.isSwiping);
			if (!this.isSwiping) {
				this.zoomInFlagMobile = !this.zoomInFlagMobile;

                if (this.zoomInFlagMobile) {
                    console.log('event: ', event);
                    let imageContainer = document.getElementById('image-container' + this.activeIndex);
                    let imageTag = document.getElementById('image-tag' + this.activeIndex);

                    
                    imageContainer.style.width = this.activeImageBounds.width * 2 + 'px';
                    imageContainer.style.height = this.activeImageBounds.height * 2 + 'px';
                    
                    let imageContainerBounds = imageContainer.getBoundingClientRect();

                    let offsetX = ((this.activeImageBounds.width * 2) - window.innerWidth) / 2;
                    console.log('offsetX: ', offsetX);

                    imageContainer.style.transform = 'translate(' + -1 * imageContainerBounds.left + 'px, ' + -1 * imageContainerBounds.top + 'px' + ')';

                    imageContainerBounds = imageContainer.getBoundingClientRect();
                    console.log('imagecontbound: ', imageContainerBounds);
                    
                    let leftOffset = (window.innerWidth - this.activeImageBounds.width) / 2;
                    let topOffset = (window.innerHeight - this.activeImageBounds.height) / 2;

                    let highlightX = (2 * (event.offsetX - leftOffset) < this.activeImageBounds.width / 2 ? 0 : ((2 * this.activeImageBounds.width - (2 * (event.offsetX - leftOffset)) < (this.activeImageBounds.width / 2)) ? ((window.innerWidth - 2 * (event.offsetX - leftOffset) > 0) ? 0 : this.activeImageBounds.width) : (2 * (event.offsetX - leftOffset) - this.activeImageBounds.width / 2)));

                    let highlightY = (2 * (event.offsetY - topOffset) < this.activeImageBounds.height / 2 ? 0 : ((2 * this.activeImageBounds.height - (2 * (event.offsetY - topOffset)) < (this.activeImageBounds.height / 2)) ? ((window.innerHeight - 2 * (event.offsetY - topOffset) > 0) ? 0 : this.activeImageBounds.height) : (2 * (event.offsetY - topOffset) - this.activeImageBounds.height / 2)));

                    console.log('highlights: ', highlightX, highlightY);

                    imageTag.style.transform = 'translate(' + (-1 * (highlightX)) + 'px, ' + (-1 * highlightY) + 'px' + ')';
                    console.log('imageContainer.style.transform: ', imageTag.style.transform);
                } else {
                    this.activeImageMobileKey++;
                    let imageContainer = document.getElementById('image-container' + this.activeIndex);
                    let imageTag = document.getElementById('image-tag' + this.activeIndex);

                    imageContainer.classList.remove('relative');
                    imageTag.classList.remove('absolute');
                    imageContainer.style.transform = 'none';
                    imageTag.style.transform = 'none';
                    imageContainer.style.width = 'unset';
                    imageContainer.style.height = 'unset';
                }

                console.log('event: ', event);
			}
		},
        zoomImageWeb(event) {
            console.log('event web: ', event);
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
            console.log('hey: ', event);
            let imageContainerWeb = document.getElementById('active-image-web-container');
            let imageTagWeb = document.getElementById('active-image-web');

            let offsetX = event.offsetX - event.target.offsetLeft;
            let offsetY = event.offsetY - event.target.offsetTop;

            imageTagWeb.style.transformOrigin = `${offsetX}px ${offsetY}px`;
        },
        displayZoomImage(eventOffsetX, eventOffsetY) {
            let imageTag = document.getElementById('image-tag' + this.activeIndex);

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
        },
		closePopup() {
			this.$emit('closePopupEvent');
		},
	}
}
</script>

<style scoped>
@import '../css/commonStyles';

#zoom-container {
    transition: background-image 2s ease;
}
</style>
