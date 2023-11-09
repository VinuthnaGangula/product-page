<template>
	<div>
		<div class="bg-gray-400/75 rounded-lg fixed inset-0 flex items-center justify-center z-50">
			<div class="bg-white rounded-lg">
				<div class="display-web p-4 w-[90vw] h-[70vh] rounded-lg border-2 border-black overflow-auto">
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
							<div class="py-4">
								<div v-if="activeTab == 'VIDEOS'" class="flex flex-col justify-between">
									<!-- Display Content -->
									<div v-if="videos.length > 0" class="h-[400px] flex justify-center align-center">
										<video class="py-4" autoplay controls muted>
											<source :src="require('../assets/ProductVideos/' + videos[activeTabIndex].video)" type="video/mp4">
											Your browser does not support the video tag.
										</video>
									</div>
		
									<!-- Thumbnails -->
									<div v-if="videos.length > 0" class="p-4 flex gap-2 md:gap-4 justify-center md:justify-start align-center">
										<div class="w-[80px] h-[60px] flex justify-center align-center rounded px-2" :class="[activeTabIndex == index ? 'border-2 border-indigo-500' : '']" v-for="video, index in videos" :key="index" @click="updateSelectedMedia(index)">
											<img class="object-contain cursor-pointer" :src="require('../assets/ProductImages/' + video.thumbnail)" alt="thumbnail">
										</div>
									</div>
								</div>
		
								<div v-else class="flex flex-col justify-between">
									<!-- Display Content -->
									<div class="h-[400px] flex justify-center align-center">
										<button v-if="!zoomInFlagWeb" class="" @click="zoomInFlagWeb = !zoomInFlagWeb">
											<img class="w-[360px] h-[400px] object-contain cursor-pointer" :src="require('../assets/ProductImages/' + images[activeTabIndex].standard_image)" alt="product-image">
										</button>
									</div>
		
									<!-- Thumbnails -->
									<div v-if="images.length > 0" class="p-4 flex gap-2 md:gap-4 justify-center md:justify-start align-center">
										<div class="" v-for="image, index in images" :key="index" @click="updateSelectedMedia(index)">
											<img class="rounded p-2 w-[80px] h-[100px] object-contain cursor-pointer" :class="[activeTabIndex == index ? 'border-2 border-indigo-500' : '']" :src="require('../assets/ProductImages/' + image.thumbnail)" alt="thumbnail">
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
	
				<div class="display-mobile p-4 w-[100vw] h-[100vh]">
					<!-- Back button -->
					<div align="left">
						<button class="px-4 py-1 rounded border-2 border-gray-300" @click="closePopup()">
							<span class="text-base font-medium">Back</span>
						</button>
					</div>
	
					<div class="py-2">
						<!-- Tabs -->
						<div align="left">
							<button v-if="videos.length > 0" class="px-4 py-2" @click="activateTab('VIDEOS')" :class="[activeTab == 'VIDEOS' ? 'border-b-2 border-indigo-400' : '']">
								<span class="text-md md:text-xl font-medium">Videos</span>
							</button>
	
							<button v-if="images.length > 0" class="px-4 py-2" @click="activateTab('IMAGES')" :class="[activeTab == 'IMAGES' ? 'border-b-2 border-indigo-400' : '']">
								<span class="text-md md:text-xl font-medium">Images</span>
							</button>
						</div>
					</div>
	
					<!-- Content -->
					<div class="py-2">
						<div v-if="activeTab == 'VIDEOS'">
							<!-- Display Content -->
							<div class="object-contain h-[280px] flex justify-center align-center">
								<div class="flex justify-center align-center" v-if="videos.length > 0" @touchstart="onTouchStart" @touchend="onTouchStop" @touchmove="onTouchMove">
									<video class="" controls autoplay muted>
										<source :src="require('../assets/ProductVideos/' + videos[activeTabIndex].video)" type="video/mp4">
										Your browser does not support the video tag.
									</video>
								</div>
							</div>
	
							<!-- Thumbnails -->
							<div v-if="videos.length > 0" class="p-4 flex gap-2 justify-center align-center">
								<div class="rounded p-2 w-[80px] h-[50px]"  :class="[activeTabIndex == index ? 'border-2 border-indigo-500' : '']" v-for="video, index in videos" :key="index" @click="updateSelectedMedia(index)">
									<img class="object-contain cursor-pointer" :src="require('../assets/ProductImages/' + video.thumbnail)" alt="thumbnail">
								</div>
							</div>
						</div>
	
						<div v-else class="flex flex-col justify-between">
							<!-- Display Content -->
							<div class="h-[280px] flex justify-center align-center">
								<div class="flex justify-center align-center" @touchstart="onTouchStart" @touchend="onTouchStop" @touchmove="onTouchMove">
									<button @dblclick="zoomImage()">
										<img class="h-[240px] object-contain cursor-pointer" :src="require('../assets/ProductImages/' + images[activeTabIndex].standard_image)" alt="product-image">
									</button>
								</div>
							</div>
	
							<!-- Thumbnails -->
							<div v-if="images.length > 0" class="">
								<div class="p-4 flex gap-2 justify-center align-center">
									<div class="" v-for="image, index in images" :key="index" @click="updateSelectedMedia(index)">
										<img class="rounded p-2 w-[60px] h-[70px] object-contain cursor-pointer" :class="[activeTabIndex == index ? 'border-2 border-indigo-500' : '']" :src="require('../assets/ProductImages/' + image.thumbnail)" alt="thumbnail">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-if="zoomInFlagWeb"  @click="zoomInFlagWeb = !zoomInFlagWeb" class="p-4 bg-gray-400/75 rounded-lg cursor-pointer fixed inset-0 flex items-center justify-center z-50">
			<button class="p-4 bg-white rounded flex justify-center align-center">
				<img class="max-w-[60vw] max-h-[60vh] object-contain p-4" :src="require('../assets/ProductImages/' + images[activeTabIndex].zoom_image)" alt="product-zoom-image">
			</button>
		</div>

		<div v-if="zoomInFlagMobile" class="p-4 bg-gray-400/75 rounded-lg cursor-pointer fixed inset-0 flex items-center justify-center z-50">
			<button @dblclick="zoomInFlagMobile = !zoomInFlagMobile" class="p-4 bg-white rounded flex justify-center align-center">
				<img class="max-w-[80vw] max-h-[80vh] object-contain p-4" :src="require('../assets/ProductImages/' + images[activeTabIndex].zoom_image)" alt="product-zoom-image">
			</button>
		</div>
	</div>
</template>

<script>
export default {
    name: 'PopupViewer',
    props: {
		media: {
			type: Array,
			required: true
		},
		selected_id: {
			type: Number,
			required: true
		}
    },
	data() {
		return {
			activeTab: 'VIDEOS',
			images: [],
			videos: [],
			activeTabIndex: null,
			isSwiping: false,
            swipeStart: null,
            swipeEnd: null,
			zoomInFlagWeb: false,
			zoomInFlagMobile: false,
		}
	},
	mounted() {
		this.images = this.media.filter((medium) => medium.type == 'IMAGE');
		this.videos = this.media.filter((medium) => medium.type == 'VIDEO');


		let activeIndex = this.media.findIndex((medium) => medium.id == this.selected_id);
		this.activeTab = this.media[activeIndex].type == 'IMAGE' ? 'IMAGES' : 'VIDEOS';
		this.activeTabIndex = this.activeTab == 'VIDEOS' ? this.videos.findIndex((medium) => medium.id == this.selected_id) : this.images.findIndex((medium) => medium.id == this.selected_id);
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
            this.swipeStart = event.touches[0].clientX;
        },
        onTouchStop() {
			console.log('this.isSwiping: ', this.isSwiping);
            if (this.isSwiping && this.swipeEnd != null) {
                let swipeLength = this.swipeStart - this.swipeEnd;
				console.log('swipeLen: ', swipeLength, this.swipeStart, this.swipeEnd);

                if (swipeLength > 50) {
                    // Left Swipe
					let activeTabLength = (this.activeTab == 'VIDEOS' ? this.videos.length : this.images.length);
                    this.activeTabIndex = (this.activeTabIndex + 1) % activeTabLength;
                } else if (swipeLength < -50) {
                    // Right Swipe
					let activeTabLength = (this.activeTab == 'VIDEOS' ? this.videos.length : this.images.length);
                    this.activeTabIndex = (activeTabLength + this.activeTabIndex - 1) % activeTabLength;
                }

				this.swipeStart = null;
				this.swipeEnd = null;
                this.isSwiping = false;
            } else if (this.swipeEnd == null) {
				this.swipeStart = null;
                this.isSwiping = false;
            }
			console.log('this.isSwiping: ', this.isSwiping);
        },
        onTouchMove(event) {
            this.swipeEnd = event.touches[0].clientX;
        },
		zoomImage() {
			console.log('this.isSwiping: ', this.isSwiping);
			if (!this.isSwiping) {
				this.zoomInFlagMobile = true;	
			}
		},
		updateSelectedMedia(index) {
            this.activeTabIndex = index;
        },
		closePopup() {
			this.$emit('closePopupEvent');
		}
	}
}
</script>

<style scoped>
@import '../css/commonStyles';
</style>
