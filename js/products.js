/* ==========================================================================
   AURA ARTISAN BAKERY — Product Catalog
   Central source of truth for all products. Swap the `img` keyword or URL
   to point at your own photography whenever you're ready.
   ========================================================================== */

function bakeryImg(keyword, sig){
  // Unsplash keyword-based placeholder — replace with real product photography later.
  return `https://source.unsplash.com/600x480/?${encodeURIComponent(keyword)}&sig=${sig}`;
}

const PRODUCTS = [
  // ---------------- Cakes ----------------
  { id:"cake-01", name:"Golden Velvet Cake", category:"Cakes", price:1450, oldPrice:1650, rating:4.9, desc:"Layers of gold-dusted vanilla sponge with silky mascarpone cream.", img:bakeryImg("cake,bakery",1), bestSeller:true },
  { id:"cake-02", name:"Dark Chocolate Truffle", category:"Cakes", price:1350, rating:4.8, desc:"Rich Belgian chocolate sponge glazed in a mirror ganache.", img:bakeryImg("chocolate-cake",2), bestSeller:true },
  { id:"cake-03", name:"Rose Pistachio Cake", category:"Cakes", price:1650, rating:4.7, desc:"Delicate rosewater sponge topped with candied pistachio shards.", img:bakeryImg("pistachio-cake",3) },
  { id:"cake-04", name:"Salted Caramel Cake", category:"Cakes", price:1550, rating:4.9, desc:"Buttery caramel layers with a whisper of Maldon sea salt.", img:bakeryImg("caramel-cake",4) },
  { id:"cake-05", name:"Red Velvet Cloud", category:"Cakes", price:1400, rating:4.6, desc:"Classic red velvet crumb wrapped in whipped cream cheese frosting.", img:bakeryImg("red-velvet-cake",5) },
  { id:"cake-06", name:"Lemon Elderflower Cake", category:"Cakes", price:1500, rating:4.7, desc:"Bright citrus sponge with an elderflower Swiss meringue finish.", img:bakeryImg("lemon-cake",6) },

  // ---------------- Pastries ----------------
  { id:"pastry-01", name:"Butter Croissant", category:"Pastries", price:180, rating:4.8, desc:"48-hour laminated dough, baked to a shattering golden crust.", img:bakeryImg("croissant",7), bestSeller:true },
  { id:"pastry-02", name:"Almond Danish", category:"Pastries", price:220, rating:4.6, desc:"Flaky puff pastry filled with silky almond frangipane.", img:bakeryImg("danish-pastry",8) },
  { id:"pastry-03", name:"Pain au Chocolat", category:"Pastries", price:210, rating:4.9, desc:"Two batons of dark chocolate wrapped in buttery lamination.", img:bakeryImg("pain-au-chocolat",9), bestSeller:true },
  { id:"pastry-04", name:"Fruit Danish Tart", category:"Pastries", price:240, rating:4.5, desc:"Vanilla custard and seasonal fruit atop a crisp pastry base.", img:bakeryImg("fruit-tart",10) },
  { id:"pastry-05", name:"Cheese Straw Twist", category:"Pastries", price:150, rating:4.4, desc:"Aged cheddar and cracked pepper twisted into puff pastry.", img:bakeryImg("cheese-pastry",11) },

  // ---------------- Cookies ----------------
  { id:"cookie-01", name:"Sea Salt Choco Chunk", category:"Cookies", price:120, rating:4.9, desc:"Thick, chewy cookies loaded with dark chocolate chunks.", img:bakeryImg("chocolate-chip-cookie",12), bestSeller:true },
  { id:"cookie-02", name:"Classic Oatmeal Raisin", category:"Cookies", price:100, rating:4.5, desc:"Wholesome rolled oats with plump golden raisins.", img:bakeryImg("oatmeal-cookie",13) },
  { id:"cookie-03", name:"Double Chocolate Fudge", category:"Cookies", price:130, rating:4.7, desc:"Cocoa-rich dough studded with milk chocolate chips.", img:bakeryImg("fudge-cookie",14) },
  { id:"cookie-04", name:"Almond Butter Crumble", category:"Cookies", price:140, rating:4.6, desc:"Nutty shortbread crumble with roasted almond pieces.", img:bakeryImg("almond-cookie",15) },

  // ---------------- Bread ----------------
  { id:"bread-01", name:"Sourdough Country Loaf", category:"Bread", price:340, rating:4.9, desc:"48-hour fermented sourdough with a deep, crackled crust.", img:bakeryImg("sourdough-bread",16), bestSeller:true },
  { id:"bread-02", name:"Multigrain Miche", category:"Bread", price:320, rating:4.6, desc:"Hearty blend of seven grains and toasted seeds.", img:bakeryImg("multigrain-bread",17) },
  { id:"bread-03", name:"Rustic Baguette", category:"Bread", price:150, rating:4.7, desc:"Crisp shell, airy crumb — baked fresh every morning.", img:bakeryImg("baguette",18) },
  { id:"bread-04", name:"Rosemary Focaccia", category:"Bread", price:280, rating:4.8, desc:"Olive-oil rich focaccia with fresh rosemary and flaked salt.", img:bakeryImg("focaccia",19) },

  // ---------------- Donuts ----------------
  { id:"donut-01", name:"Glazed Ring Donut", category:"Donuts", price:110, rating:4.6, desc:"Pillowy yeasted dough dipped in a classic vanilla glaze.", img:bakeryImg("glazed-donut",20), bestSeller:true },
  { id:"donut-02", name:"Pistachio Cream Donut", category:"Donuts", price:150, rating:4.7, desc:"Filled with pistachio pastry cream, dusted with crushed nuts.", img:bakeryImg("donut",21) },
  { id:"donut-03", name:"Boston Cream Donut", category:"Donuts", price:140, rating:4.5, desc:"Vanilla custard core capped with dark chocolate ganache.", img:bakeryImg("cream-donut",22) },
  { id:"donut-04", name:"Cinnamon Sugar Twist", category:"Donuts", price:120, rating:4.6, desc:"Hand-twisted dough rolled in cinnamon sugar while warm.", img:bakeryImg("cinnamon-donut",23) },

  // ---------------- Cupcakes ----------------
  { id:"cupcake-01", name:"Vanilla Bean Cupcake", category:"Cupcakes", price:160, rating:4.7, desc:"Madagascar vanilla bean sponge with a swirl of buttercream.", img:bakeryImg("cupcake",24), bestSeller:true },
  { id:"cupcake-02", name:"Red Velvet Cupcake", category:"Cupcakes", price:170, rating:4.6, desc:"Miniature red velvet crowned with cream cheese frosting.", img:bakeryImg("red-velvet-cupcake",25) },
  { id:"cupcake-03", name:"Salted Caramel Cupcake", category:"Cupcakes", price:180, rating:4.8, desc:"Caramel-filled centre topped with a salted caramel drizzle.", img:bakeryImg("caramel-cupcake",26) },
  { id:"cupcake-04", name:"Lemon Meringue Cupcake", category:"Cupcakes", price:175, rating:4.5, desc:"Zesty lemon sponge finished with a torched meringue peak.", img:bakeryImg("lemon-cupcake",27) },

  // ---------------- Brownies ----------------
  { id:"brownie-01", name:"Fudge Walnut Brownie", category:"Brownies", price:150, rating:4.9, desc:"Dense, fudgy brownie loaded with toasted walnuts.", img:bakeryImg("brownie",28), bestSeller:true },
  { id:"brownie-02", name:"Salted Caramel Brownie", category:"Brownies", price:170, rating:4.8, desc:"Swirled with house-made salted caramel sauce.", img:bakeryImg("caramel-brownie",29) },
  { id:"brownie-03", name:"Triple Chocolate Brownie", category:"Brownies", price:180, rating:4.7, desc:"Dark, milk and white chocolate in every bite.", img:bakeryImg("chocolate-brownie",30) },

  // ---------------- Beverages ----------------
  { id:"bev-01", name:"Artisan Flat White", category:"Beverages", price:190, rating:4.7, desc:"Double ristretto shot with velvety steamed milk.", img:bakeryImg("coffee-latte",31), bestSeller:true },
  { id:"bev-02", name:"Belgian Hot Chocolate", category:"Beverages", price:210, rating:4.8, desc:"Melted couverture chocolate whisked into warm milk.", img:bakeryImg("hot-chocolate",32) },
  { id:"bev-03", name:"Cold Brew Oat Latte", category:"Beverages", price:220, rating:4.6, desc:"Slow-steeped cold brew layered over creamy oat milk.", img:bakeryImg("cold-brew-coffee",33) },
  { id:"bev-04", name:"Chamomile Honey Tea", category:"Beverages", price:160, rating:4.5, desc:"Soothing chamomile blossoms sweetened with wild honey.", img:bakeryImg("herbal-tea",34) },
];

const CATEGORIES = ["Cakes","Pastries","Cookies","Bread","Donuts","Cupcakes","Brownies","Beverages"];

function getProductById(id){
  return PRODUCTS.find(p => p.id === id);
}

function formatINR(amount){
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function starRow(rating){
  return `<span class="rating"><svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>${rating.toFixed(1)}</span>`;
}
