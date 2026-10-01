const products=[
{id:1,name:"Everyday Cotton Kurta",cat:"Kurtas",price:1890,rating:4.8},
{id:2,name:"Printed Comfort Kurta",cat:"Kurtas",price:2190,rating:4.7},
{id:3,name:"Classic Salwar Set",cat:"Salwar Suits",price:3290,rating:4.9},
{id:4,name:"Festive Salwar Suit",cat:"Salwar Suits",price:3990,rating:4.8},
{id:5,name:"Elegant Daily Saree",cat:"Sarees",price:2890,rating:4.6},
{id:6,name:"Occasion Saree",cat:"Sarees",price:4590,rating:4.9},
{id:7,name:"Statement Dupatta",cat:"Accessories",price:990,rating:4.5},
{id:8,name:"Everyday Fashion Set",cat:"Accessories",price:1290,rating:4.6}
];
let cart=JSON.parse(localStorage.getItem("sm_cart")||"[]"),activeCat="All";
const money=n=>"NPR "+n.toLocaleString("en-NP");
const el=id=>document.getElementById(id);
function renderChips(){el("chips").innerHTML=["All","Kurtas","Salwar Suits","Sarees","Accessories"].map(c=>`<button class="chip ${activeCat===c?"active":""}" onclick="setCat('${c}')">${c}</button>`).join("")}
function setCat(c){activeCat=c;render();window.location.hash="shop"}
function render(){renderChips();let q=el("search").value.toLowerCase(),arr=products.filter(p=>(activeCat==="All"||p.cat===activeCat)&&(!q||p.name.toLowerCase().includes(q)));let s=el("sort").value;if(s==="price-low")arr.sort((a,b)=>a.price-b.price);if(s==="price-high")arr.sort((a,b)=>b.price-a.price);if(s==="rating")arr.sort((a,b)=>b.rating-a.rating);el("products").innerHTML=arr.map(p=>`<article class="product"><div class="product-art">${p.cat==="Kurtas"?"K":p.cat==="Sarees"?"S":"✦"}</div><div class="product-body"><h3>${p.name}</h3><div class="meta">${p.cat} · ★ ${p.rating}</div><div class="price">${money(p.price)}</div><button class="button add" onclick="add(${p.id})">Add to cart</button></div></article>`).join("")||"<p>No products found.</p>"}
function add(id){const p=products.find(x=>x.id===id),i=cart.find(x=>x.id===id);i?i.qty++:cart.push({id,qty:1});save();openCart()}
function save(){localStorage.setItem("sm_cart",JSON.stringify(cart));renderCart()}
function renderCart(){el("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);el("cartItems").innerHTML=cart.length?cart.map(x=>{let p=products.find(y=>y.id===x.id);return`<div class="cart-row"><div><strong>${p.name}</strong><div class="meta">${money(p.price)} × ${x.qty}</div></div><div class="qty"><button onclick="change(${x.id},-1)">−</button><span>${x.qty}</span><button onclick="change(${x.id},1)">+</button></div></div>`}).join(""):"<p>Your cart is empty.</p>";el("cartTotal").textContent=money(cart.reduce((a,x)=>a+products.find(y=>y.id===x.id).price*x.qty,0))}
function change(id,d){let x=cart.find(x=>x.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(x=>x.id!==id);save()}
function openCart(){el("cartDrawer").classList.add("open");el("overlay").classList.add("show")}
function closeCart(){el("cartDrawer").classList.remove("open");el("overlay").classList.remove("show")}
el("cartBtn").onclick=openCart;el("closeCart").onclick=closeCart;el("overlay").onclick=closeCart;el("search").oninput=render;el("sort").onchange=render;
el("checkoutBtn").onclick=()=>{if(!cart.length)return alert("Your cart is empty.");let lines=cart.map(x=>{let p=products.find(y=>y.id===x.id);return `${p.name} x ${x.qty} — ${money(p.price*x.qty)}`}).join("%0A");let total=cart.reduce((a,x)=>a+products.find(y=>y.id===x.id).price*x.qty,0);window.open("https://wa.me/?text="+encodeURIComponent("Hello S&M Marketplace,%0A%0AI want to order:%0A"+lines+"%0A%0ATotal: "+money(total)+"%0AName:%0APhone:%0AAddress:"));
};
el("trackForm").onsubmit=e=>{e.preventDefault();let n=el("orderNo").value.trim();el("trackResult").hidden=false;el("trackResult").innerHTML=`<strong>${n}</strong><br><span class="meta">Demo status: Order lookup is ready for connection to the S&M order database.</span>`};
el("bulkForm").onsubmit=e=>{e.preventDefault();let msg=`Wholesale enquiry — ${el("bulkCategory").value}, qty ${el("bulkQty").value}. Name: ${el("bulkName").value}, Phone: ${el("bulkPhone").value}. Notes: ${el("bulkMessage").value}`;window.open("https://wa.me/?text="+encodeURIComponent(msg))};
render();renderCart();