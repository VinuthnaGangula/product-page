<template>
    <div>
        <!-- Popup Viewer Component -->
		<div v-if="viewPopup">
			<PopupViewer @closePopupEvent="closePopup()" :media="sortedMedia" :selected_id="media[selectedIndex].id"></PopupViewer>
		</div>
    
        <div class="bg-white">
            <div class="">
                <!-- Active Media Content -->
                <div class="relative">
                    <!-- Prev Button -->
                    <div class="px-2 absolute left-0 top-1/2">
                        <button @click="updateSelectedMedia(selectedIndex - 1)">
                            Prev
                        </button>
                    </div>

                    <!-- Next Button -->
                    <div class="px-2 absolute right-0 top-1/2">
                        <button @click="updateSelectedMedia(selectedIndex + 1)">
                            Next
                        </button>
                    </div>
                    
                    <div class="display-web">
                        <div class="flex w-[100vw]">
                            <div class="">
                                <div class="h-[384px] flex justify-center align-center">
                                    <div v-if="selectedMedium" class="p-8">
                                        <button class="" @click="openPopupView()">
                                            <div class="relative">
                                                <img id="original-image" class="h-[320px] object-contain cursor-pointer" :src="require('../assets/ProductImages/' + selectedMedium.standard_image)" alt="product-image">

                                                <div id="hover-selection" class="absolute w-[100px] h-[100px] translate-x-1/2 translate-y-1/2 bg-black">
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                <div v-if="zoomOnHoverFlag" class="zoomed-image-container fixed z-50">
                                    <img id="zoomed-image" class="zoom-image h-[60vh]" :src="require('../assets/ProductImages/' + selectedMedium.standard_image)" alt="product-image">
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="display-mobile">
                        <div class="h-[340px] flex justify-center align-center">
                            <div v-if="selectedMedium" @touchstart="onTouchStart" @touchend="onTouchStop" @touchmove="onTouchMove">
                                <button @click="openPopupView()">
                                    <img :class="[selectedMedium.type == 'VIDEO' ? 'w-[80vw]' : 'w-[180px]']" class="h-[320px] object-contain cursor-pointer" :src="require('../assets/ProductImages/' + selectedMedium.standard_image)" alt="product-image">

                                </button>
                                <!-- <div v-if="selectedMedium.type == 'IMAGE'">
                                    <img class="w-[180px] h-[320px] object-contain cursor-pointer" @click="openPopupView()" :src="require('../assets/ProductImages/' + selectedMedium.standard_image)" alt="product-image">
                                </div>
                                <div v-else class="w-[180px] h-[320px] object-contain">
                                    video
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Thumbnails -->
                <div class="p-4 flex gap-2 md:gap-4 justify-center md:justify-start align-center">
                    <div class="w-[60px] h-[80px]" v-for="medium, index in sortedMedia" :key="index" @click="updateSelectedMedia(index)">
                        <img class="rounded p-2 cursor-pointer" :class="[selectedIndex == index ? 'border-2 border-indigo-500' : '']" :src="require('../assets/ProductImages/' + medium.thumbnail)" alt="thumbnail">
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script>
export default {
    name: 'ProductMediaComponent',
    components: {
        'PopupViewer': () => import('../components/PopupComponent.vue'),
    },
    props: {
        media: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            viewPopup: false,
            sortedMedia: [],
            selectedIndex: 0,
            selectedMedium: null,
            isSwiping: false,
            swipeStart: 0,
            swipeEnd: null,
            zoomOnHoverFlag: false,
        }
    },
    mounted() {
        this.sortedMedia = this.media.sort((medium1, medium2) => {
            return medium1.placement - medium2.placement
        });

        this.selectedMedium = this.sortedMedia[0];

        
    },
    methods: {
        updateSelectedMedia(index) {
            this.selectedIndex = index >= 0 && index < this.sortedMedia.length ? index : (this.sortedMedia.length + index) % this.sortedMedia.length;
            this.selectedMedium = this.sortedMedia[this.selectedIndex];
        },
        onTouchStart(event) {
            this.isSwiping = true;
            this.swipeStart = event.touches[0].clientX;
        },
        onTouchStop() {
            if (this.isSwiping && this.swipeEnd != null) {
                let swipeLength = this.swipeStart - this.swipeEnd;
                console.log('swipeLen: ', swipeLength, this.swipeStart, this.swipeEnd);

                if (swipeLength > 50) {
                    // Left Swipe
                    this.selectedIndex = (this.selectedIndex + 1) % this.sortedMedia.length;
                    this.selectedMedium = this.sortedMedia[this.selectedIndex];
                } else if (swipeLength < -50) {
                    // Right Swipe
                    this.selectedIndex = (this.sortedMedia.length + this.selectedIndex - 1) % this.sortedMedia.length;
                    this.selectedMedium = this.sortedMedia[this.selectedIndex];
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
            this.$router.go();
        }
    }
}
</script>

<style scoped>
@import '../css/commonStyles.css';

.zoom-image {
    left: 0;
    top: 0;
}

/* .video-button {
    background-image: url('../assets/HelperIcons/play-button.png');
} */
/* .point-zoom:hover {
    transform: scale(1.5);
} */
/* .hover-area:hover {
    position: absolute;
    width: 100px;
    height: 100px;
    background-color: grey;
} */
</style>