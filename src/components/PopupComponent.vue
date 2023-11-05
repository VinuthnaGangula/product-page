<template>
    <div class="bg-gray-400/75 rounded-lg fixed inset-0 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg">
			<div class="display-web p-4 w-[90vw] h-[75vh] rounded-lg border-2 border-black">
				<div class="relative">
					<!-- Close Button for Web -->
					<div class="absolute top-0 right-0">
						<button @click="closePopup()" class="px-2 py-0 rounded border-2 border-indigo-400">X</button>
					</div>

					<div class="py-4">
						<!-- Tabs -->
						<div>
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
						<div v-if="activeTab == 'VIDEOS'">
							<!-- Display Content -->
							<div class="h-[400px] flex justify-center align-center">

							</div>

							<!-- Thumbnails -->
							<div v-if="videos.length > 0" class="p-4 flex gap-2 md:gap-4 justify-center md:justify-start align-center">
								<div class="" v-for="video, index in videos" :key="index" @click="updateSelectedMedia(index)">
									<img class="rounded p-2 w-[80px] h-[100px] object-contain cursor-pointer" :class="[activeTabIndex == index ? 'border-2 border-indigo-500' : '']" :src="require('../assets/ProductImages/' + video.thumbnail)" alt="thumbnail">
								</div>
							</div>
						</div>

						<div v-else>
							<!-- Display Content -->
							<div class="h-[400px] flex justify-center align-center">
								<img class="w-[360px] h-[400px] object-contain cursor-pointer" :src="require('../assets/ProductImages/' + images[activeTabIndex].standard_image)" alt="product-image">
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

			<div class="display-mobile p-4 w-[100vw] h-[100vh]">
				<!-- Back button -->
				<button class="px-4 py-1 rounded border-2 border-gray-300" @click="closePopup()">
					<span class="text-lg font-medium">Back</span>
				</button>

				<div class="py-4">
					<!-- Tabs -->
					<div>
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
					<div v-if="activeTab == 'VIDEOS'">
						<!-- Display Content -->
						<div class="w-[180px] h-[320px] object-contain">
							<div @touchstart="onTouchStart" @touchend="onTouchStop" @touchmove="onTouchMove">
							</div>
						</div>

						<!-- Thumbnails -->
						<div v-if="videos.length > 0" class="p-4 flex gap-2 justify-center align-center">
							<div class="" v-for="video, index in videos" :key="index" @click="updateSelectedMedia(index)">
								<img class="rounded p-2 w-[80px] h-[100px] object-contain cursor-pointer" :class="[activeTabIndex == index ? 'border-2 border-indigo-500' : '']" :src="require('../assets/ProductImages/' + video.thumbnail)" alt="thumbnail">
							</div>
						</div>
					</div>

					<div v-else>
						<!-- Display Content -->
						<div class="h-[340px] flex justify-center align-center">
							<div @touchstart="onTouchStart" @touchend="onTouchStop" @touchmove="onTouchMove">
								<img class="w-[180px] h-[320px] object-contain cursor-pointer" :src="require('../assets/ProductImages/' + images[activeTabIndex].standard_image)" alt="product-image">
							</div>
						</div>

						<!-- Thumbnails -->
						<div v-if="images.length > 0" class="">
							<div class="p-4 flex gap-2 justify-center align-center">
								<div class="" v-for="image, index in images" :key="index" @click="updateSelectedMedia(index)">
									<img class="rounded p-2 w-[80px] h-[100px] object-contain cursor-pointer" :class="[activeTabIndex == index ? 'border-2 border-indigo-500' : '']" :src="require('../assets/ProductImages/' + image.thumbnail)" alt="thumbnail">
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
            if (this.isSwiping && this.swipeEnd != null) {
                let swipeLength = this.swipeStart - this.swipeEnd;

                if (swipeLength > 50) {
                    // Left Swipe
					let activeTabLength = (this.activeTab == 'VIDEOS' ? this.videos.length : this.images.length);
                    this.activeTabIndex = (this.activeTabIndex + 1) % activeTabLength;
                } else if (swipeLength < -50) {
                    // Right Swipe
					let activeTabLength = (this.activeTab == 'VIDEOS' ? this.videos.length : this.images.length);
                    this.activeTabIndex = (activeTabLength.length + this.activeTabIndex - 1) % activeTabLength.length;
                }

                this.isSwiping = false;
            } else if (this.swipeEnd == null) {
                this.isSwiping = false;
            }
        },
        onTouchMove(event) {
            this.swipeEnd = event.touches[0].clientX;
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
