// eslint-disable-next-line no-undef
let eventBus = new Vue();

// eslint-disable-next-line no-undef
Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
    <ul>
    <li v-for="detail in details">{{ detail }}</li>
    </ul>
  `,
});

// eslint-disable-next-line no-undef
Vue.component("product-review", {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
   
    <div v-if="errors.length">
      <b>Please correct the following</b>
      <ul>
        <li v-for="error in errors">{{error}}</li>
      </ul>
    </div>
    <!--
    <p v-if="errors.length">
      <b>Please correct the following</b>
      <ul>
        <li v-for="error in errors">{{error}}</li>
      </ul>
    </p>
    -->
    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name">
    </p>

    <p>
      <label for="review">Review:</label>
      <textarea id="review" v-model="review"></textarea>
    </p>

    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>

    <p>
      <label for="recommend">Would you recommend this product?</label>
      <select id="recommend" v-model="recommend">
        <option>Yes</option>
        <option>No</option>
      </select>
    </p>

    <p>
      <input type="submit" value="Submit">
    </p>

    </form>
    `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: [],
    };
  },
  methods: {
    onSubmit: function () {
      this.errors.length = 0;
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if (!this.name) this.errors.push("Name is required");
        if (!this.review) this.errors.push("Review is required");
        if (!this.rating) this.errors.push("Rating is required");
        if (!this.recommend)
          this.errors.push("Please provide your recommendation");
      }
    },
  },
});

// eslint-disable-next-line no-undef
Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: false,
    },
  },
  template: `
      <div>
      
        <ul>
          <span class="tabs"
                style="margin:25px"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="index"
          >{{ tab }}</span>
        </ul>

        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul v-else>
                <li v-for="(review, index) in reviews" :key="index">
                  <p>{{ review.name }}</p>
                  <p>Rating:{{ review.rating }}</p>
                  <p>{{ review.review }}</p>
                  <p>{{review.recommend}}</p>
                </li>
            </ul>
        </div>

        <div v-show="selectedTab === 'Make a Review'">
          <product-review></product-review>
        </div>
    
      </div>
    `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews",
    };
  },
});

// eslint-disable-next-line no-undef
Vue.component("info-tabs", {
  props: {
    shipping: {
      required: true,
    },
    details: {
      type: Array,
      required: true,
    },
  },
  template: `
      <div>
      
        <ul>
          <span class="tabs"
                style="margin:25px"
                :class="{ activeTab: selectedTab === tab }"
                v-for="(tab, index) in tabs"
                @click="selectedTab = tab"
                :key="index"
          >{{ tab }}</span>
        </ul>

        <div v-show="selectedTab === 'Shipping'">
          <p>{{ shipping }}</p>
        </div>

        <div v-show="selectedTab === 'Details'">
          <ul>
            <li v-for="detail in details">{{ detail }}</li>
          </ul>
        </div>
    
      </div>
    `,
  data() {
    return {
      tabs: ["Shipping", "Details"],
      selectedTab: "Shipping",
    };
  },
});

// eslint-disable-next-line no-undef
Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
  <div class="product">
                <div class="product-image">
                    <img v-bind:src="image" :title="description" v-bind:alt="description"/>
                </div>

                <div class="product-info">
                    <h1>{{prodTitle}}</h1>
                    <h5>{{description}}</h5>
                    <p v-if="inStock">Product is available</p>
                    <p v-else v-bind:class="{strikeThrough : !inStock}">Product is not available</p>
                    
                    <p>Available at
                        <a v-bind:href="url">{{url}}</a>
                    </p>
                    
                    <!-- Moving both these to info tabs
                    <p> Shipping: {{shipping}}</p>
                    <product-details :details="details"></product-details>
                    -->
                  <info-tabs  :shipping="shipping" :details="details"></info-tabs>
                  
                    <div
                         class="color-box"
                         v-for="(sizeandstock, index) in sizeandstocks"
                         v-bind:key="sizeandstock.id"
                         v-bind:style="{backgroundColor: sizeandstock.colour}"
                         @mouseover="updateImage(index)"
                    >
                    </div>
                </div>
                <button
                        v-on:click="addToCart"
                        v-bind:disabled="!inStock"
                        v-bind:class="{disabledButton: !inStock}"
                >Add to Cart</button>
                <button v-on:click="removeFromCart">Remove from Cart</button>
                
                <product-tabs :reviews="reviews"></product-tabs>
            </div>
  `,
  data() {
    return {
      product: "Socks",
      brand: "Awesome - Just too good!! ",
      description: "This is made of pure cotton.",
      selectedVariant: 0,
      url: "https://near.store",
      details: ["Cotton", "Linen", "Added Colours", "Customized Logo"],
      sizeandstocks: [
        {
          id: 1,
          image: "./assets/vmSocks-green-onWhite.jpg",
          colour: "Green",
          size: 30,
          stock: 100,
        },
        {
          id: 3,
          image: "./assets/vmSocks-blue-onWhite.jpg",
          colour: "Blue",
          size: 50,
          stock: 10,
        },
      ],
      reviews: [],
    };
  },
  methods: {
    addToCart: function () {
      this.$emit("add-to-cart", this.sizeandstocks[this.selectedVariant].id);
    },
    updateImage: function (index) {
      this.selectedVariant = index;
    },
    removeFromCart: function () {
      this.$emit(
        "remove-from-cart",
        this.sizeandstocks[this.selectedVariant].id
      );
    },
  },
  computed: {
    prodTitle: function () {
      return this.brand + " " + this.product;
    },
    image: function () {
      return this.sizeandstocks[this.selectedVariant].image;
    },
    inStock: function () {
      return this.sizeandstocks[this.selectedVariant].stock;
    },
    shipping: function () {
      if (this.premium) {
        return "Free";
      } else {
        return "29";
      }
    },
  },
  mounted() {
    eventBus.$on("review-submitted", (productReview) => {
      this.reviews.push(productReview);
    });
  },
});

// eslint-disable-next-line no-unused-vars,no-undef
let app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCart: function (id) {
      this.cart.push(id);
    },
    removeFromCart: function (id) {
      const index = this.cart.indexOf(id);
      if (index > -1) {
        this.cart.splice(index, 1);
      }
    },
  },
});
