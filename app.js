const DEMO=[
{ID:101,Title:"Atomic Habits",Author:"James Clear",Price:1450,Condition:"New",Category:"Self-help",Stock:15,CoverImageURL:"https://images.unsplash.com/photo-1544947950-fa07a98d237f"},
{ID:102,Title:"Peer-e-Kamil",Author:"Umera Ahmed",Price:1200,Condition:"Pre-Loved",Category:"Urdu novels",Stock:4,CoverImageURL:"https://images.unsplash.com/photo-1512820790803-83ca734da794"},
{ID:103,Title:"The Psychology of Money",Author:"Morgan Housel",Price:1350,Condition:"New",Category:"Self-help",Stock:9},
{ID:104,Title:"Jannat Kay Pattay",Author:"Nimra Ahmed",Price:1100,Condition:"New",Category:"Urdu novels",Stock:12},
{ID:105,Title:"Deep Work",Author:"Cal Newport",Price:900,Condition:"Pre-Loved",Category:"Self-help",Stock:3},
{ID:106,Title:"Sapiens",Author:"Yuval Noah Harari",Price:1600,Condition:"New",Category:"History",Stock:7},
{ID:107,Title:"Shehr-e-Zaat",Author:"Umera Ahmed",Price:950,Condition:"Pre-Loved",Category:"Urdu novels",Stock:0},
{ID:108,Title:"The Alchemist",Author:"Paulo Coelho",Price:700,Condition:"Pre-Loved",Category:"Fiction",Stock:6}];

const $=id=>document.getElementById(id);
const rs=n=>"Rs "+Number(n).toLocaleString("en-PK");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const qs=new URLSearchParams(location.search), page=document.body.dataset.page;
let products=[], cart={};
try{cart=JSON.parse(store.get("tb_cart")||"{}")}catch(e){}
const saveCart=()=>{store.set("tb_cart",JSON.stringify(cart));cartCount()};
const pid=p=>slug(p.ID), byId=id=>products.find(p=>pid(p)===slug(id));
const sub=()=>Object.entries(cart).reduce((s,[i,n])=>s+(byId(i)?.Price||0)*n,0);
const norm=p=>({ID:p.ID,Title:String(p.Title||""),Author:String(p.Author||""),Price:Number(p.Price)||0,Condition:/pre/i.test(p.Condition)?"Pre-Loved":"New",Category:String(p.Category||"").trim(),Description:String(p.Description||""),CoverImageURL:p.CoverImageURL||"",Stock:Number(p.Stock)||0});

function cartCount(){const e=$("cnt");if(e)e.textContent=Object.values(cart).reduce((a,b)=>a+b,0)}
function toast(m){const t=$("toast");t.textContent=m;t.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(()=>t.style.display="none",2200)}

function shell(){
 const nav=[["index.html","Home","home"],["shop.html?c=all","All books","shop"],["shop.html?c=new","New",""],["shop.html?c=pre-loved","Pre-loved",""],["about.html","About","about"],["contact.html","Contact","contact"]];
 const links=nav.map(n=>`<a href="${n[0]}" class="${n[2]&&n[2]===page?"on":""}">${n[1]}</a>`).join("");
 document.body.insertAdjacentHTML("afterbegin",`
 <div style="background:var(--g);color:#fff" class="text-center text-sm py-2 px-3">Cash on delivery across Pakistan · Flat Rs 200 delivery on every order</div>
 <header class="sticky top-0 z-20 bg-white" style="border-bottom:1px solid var(--line)"><div class="wrap py-3 flex items-center gap-4">
  <a href="index.html" class="serif text-2xl font-bold" style="color:var(--g)">TahrirBook</a>
  <nav class="nav hidden md:flex gap-5 text-sm font-medium ml-4">${links}</nav>
  <form action="search.html" class="ml-auto flex-1 max-w-xs"><input name="q" class="inp" placeholder="Search books" aria-label="Search books" value="${esc(page==="search"?qs.get("q")||"":"")}"></form>
  <a href="cart.html" class="btn2 whitespace-nowrap">Cart (<span id="cnt">0</span>)</a></div>
  <nav class="nav md:hidden wrap pb-2 flex gap-4 text-sm overflow-x-auto whitespace-nowrap">${links}</nav></header>`);
 document.body.insertAdjacentHTML("beforeend",`
 <footer style="background:var(--soft);border-top:1px solid var(--line)" class="mt-12"><div class="wrap py-10 grid md:grid-cols-3 gap-8 text-sm">
  <div><div class="serif text-xl font-bold" style="color:var(--g)">TahrirBook</div><p class="mt-2" style="color:var(--mute)">New and pre-loved books for readers across Pakistan, paid for at your door.</p></div>
  <div><b>Shop</b><div class="mt-2 flex flex-col gap-1" style="color:var(--mute)"><a href="shop.html?c=all">All books</a><a href="shop.html?c=new">New books</a><a href="shop.html?c=pre-loved">Pre-loved books</a></div></div>
  <div><b>Help</b><div class="mt-2 flex flex-col gap-1" style="color:var(--mute)"><a href="shipping.html">Shipping and returns</a><a href="about.html">About us</a><a href="contact.html">Contact us</a></div></div></div>
  <div class="text-center text-xs pb-6" style="color:var(--mute)">© 2026 TahrirBook</div></footer><div id="toast" role="status"></div>`);
 cartCount();
}

async function loadData(){
 let data=null;
 try{const c=JSON.parse(sessionStorage.getItem("tb_prod")||"null");if(c&&Date.now()-c.t<120000)data=c.d}catch(e){}
 if(!data&&API_URL){try{const r=await fetch(API_URL);data=await r.json();if(data.products)data=data.products;try{sessionStorage.setItem("tb_prod",JSON.stringify({t:Date.now(),d:data}))}catch(e){}}catch(e){data=null}}
 products=(data||DEMO).map(norm).filter(p=>p.Title);
 Object.keys(cart).forEach(i=>{const p=byId(i);if(!p||p.Stock<1)delete cart[i];else cart[i]=Math.min(cart[i],p.Stock)});
 saveCart();
}

function colls(){
 const c=[{s:"all",t:"All books",f:()=>true,d:"Every book in the store."},{s:"new",t:"New books",f:p=>p.Condition==="New",d:"Brand new copies, sealed and fresh."},{s:"pre-loved",t:"Pre-loved books",f:p=>p.Condition==="Pre-Loved",d:"Carefully checked second-hand copies at friendlier prices."}];
 [...new Set(products.map(p=>p.Category).filter(Boolean))].forEach(k=>c.push({s:slug(k),t:k,f:p=>p.Category===k,d:"Books in "+k+"."}));
 return c;
}
function cover(p){let h=0;for(const ch of String(p.ID))h=(h*31+ch.charCodeAt(0))%360;
 return `<div class="cover" style="background:linear-gradient(155deg,hsl(${h} 45% 32%),hsl(${(h+40)%360} 50% 20%))"><b>${esc(p.Title)}</b><small>${esc(p.Author)}</small>${p.CoverImageURL?`<img src="${esc(p.CoverImageURL)}" alt="Cover of ${esc(p.Title)}" loading="lazy" onerror="this.remove()">`:""}</div>`}
function card(p){const out=p.Stock<1;
 return `<a href="product.html?id=${pid(p)}" class="card block"><div class="relative">${cover(p)}${out?'<span class="tag absolute top-2 left-2" style="background:#fff">Sold out</span>':p.Condition==="Pre-Loved"?'<span class="tag absolute top-2 left-2">Pre-loved</span>':""}</div><h3 class="serif font-bold mt-3 leading-tight">${esc(p.Title)}</h3><div class="text-sm" style="color:var(--mute)">${esc(p.Author)}</div><div class="font-semibold mt-1">${rs(p.Price)}</div></a>`}
const grid=l=>l.length?`<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">${l.map(card).join("")}</div>`:'<p style="color:var(--mute)">No books found here yet. Try another collection.</p>';
const crumb=(...a)=>`<div class="text-sm mb-4" style="color:var(--mute)">${a.join(" / ")}</div>`;

const views={
home(){
 const f=products.filter(p=>p.Stock>0).slice(0,8),c=colls().slice(1,5);
 return `<section class="rounded-3xl p-8 md:p-14 mb-12" style="background:linear-gradient(120deg,var(--soft),#fff6d6)"><h1 class="serif text-4xl md:text-6xl font-bold max-w-2xl leading-tight">Your next favourite book, paid for at your door.</h1><p class="mt-4 max-w-lg" style="color:var(--mute)">Browse new and pre-loved books. Order in a minute, pay cash when the parcel arrives.</p><div class="mt-6 flex gap-3 flex-wrap"><a class="btn" href="shop.html?c=all">Shop all books</a><a class="btn2" href="shop.html?c=pre-loved">See pre-loved deals</a></div></section>
 <section class="grid sm:grid-cols-3 gap-4 mb-12 text-sm">${[["Cash on delivery","Pay only when your book arrives."],["Delivery across Pakistan","Flat Rs 200, any city."],["Checked before dispatch","Every pre-loved copy is inspected."]].map(x=>`<div class="rounded-xl p-5" style="background:var(--soft)"><b>${x[0]}</b><p style="color:var(--mute)" class="mt-1">${x[1]}</p></div>`).join("")}</section>
 <h2 class="serif text-2xl font-bold mb-4">Shop by collection</h2><div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">${c.map(k=>`<a href="shop.html?c=${k.s}" class="rounded-xl p-5 font-semibold serif text-lg" style="border:1px solid var(--line)">${esc(k.t)}<div class="text-xs font-normal mt-1" style="color:var(--g);font-family:Inter">${products.filter(k.f).length} books</div></a>`).join("")}</div>
 <div class="flex justify-between items-end mb-4"><h2 class="serif text-2xl font-bold">Featured books</h2><a href="shop.html?c=all" class="text-sm font-medium" style="color:var(--g)">View all</a></div>${grid(f)}`},
shop(){
 const all=colls(),k=all.find(x=>x.s===(qs.get("c")||"all"))||all[0],sort=qs.get("sort")||"featured";
 let l=products.filter(k.f);
 if(sort==="low")l.sort((a,b)=>a.Price-b.Price);else if(sort==="high")l.sort((a,b)=>b.Price-a.Price);else if(sort==="az")l.sort((a,b)=>a.Title.localeCompare(b.Title));
 document.title=k.t+" – TahrirBook";
 return `${crumb('<a href="index.html">Home</a>',esc(k.t))}<h1 class="serif text-3xl md:text-4xl font-bold">${esc(k.t)}</h1><p class="mt-1" style="color:var(--mute)">${esc(k.d)}</p>
 <div class="flex flex-wrap gap-2 my-5">${all.map(x=>`<a href="shop.html?c=${x.s}" class="${x.s===k.s?"btn":"btn2"} !py-1 !px-4 text-sm">${esc(x.t)}</a>`).join("")}</div>
 <div class="flex justify-between items-center mb-5 text-sm"><span style="color:var(--mute)">${l.length} books</span><label>Sort <select id="sort" class="inp !w-auto !py-1 ml-1">${[["featured","Featured"],["low","Price: low to high"],["high","Price: high to low"],["az","Title A to Z"]].map(o=>`<option value="${o[0]}" ${sort===o[0]?"selected":""}>${o[1]}</option>`).join("")}</select></label></div>${grid(l)}`},
product(){
 const p=byId(qs.get("id")||"");if(!p)return views.nf();
 document.title=p.Title+" – TahrirBook";
 const rel=products.filter(x=>x!==p&&(x.Category&&x.Category===p.Category||x.Condition===p.Condition)).slice(0,4),out=p.Stock<1,d=(a,b)=>`<dt style="color:var(--mute)">${a}</dt><dd class="col-span-2">${b}</dd>`;
 return `${crumb('<a href="index.html">Home</a>','<a href="shop.html?c=all">Books</a>',esc(p.Title))}
 <div class="grid md:grid-cols-2 gap-10"><div class="max-w-sm w-full">${cover(p)}</div><div><span class="tag">${p.Condition==="New"?"New":"Pre-loved"}</span>
 <h1 class="serif text-3xl md:text-4xl font-bold mt-2">${esc(p.Title)}</h1><p class="mt-1" style="color:var(--mute)">by ${esc(p.Author)}</p>
 <div class="text-2xl font-semibold mt-4">${rs(p.Price)}</div><p class="text-xs" style="color:var(--mute)">Delivery Rs 200 added at checkout</p>
 <p class="mt-3 text-sm font-medium" style="color:${out?"#b3261e":p.Stock<=5?"#9a6700":"var(--g)"}">${out?"Sold out":p.Stock<=5?"Only "+p.Stock+" left in stock":"In stock"}</p>
 <div class="flex items-center gap-3 mt-5"><div class="flex items-center rounded-full" style="border:1px solid var(--line)"><button class="px-4 py-2" id="qm" aria-label="Less">−</button><span id="qn" class="w-6 text-center">1</span><button class="px-4 py-2" id="qp" aria-label="More">+</button></div><button class="btn flex-1" id="addBtn" ${out?"disabled":""}>${out?"Sold out":"Add to cart"}</button></div>
 <button class="btn2 w-full mt-3" id="buyBtn" ${out?"disabled":""}>Buy it now</button>
 <p class="mt-6 text-sm leading-relaxed">${esc(p.Description||"A "+(p.Condition==="New"?"brand new":"carefully checked pre-loved")+" copy of "+p.Title+" by "+p.Author+".")}</p>
 <dl class="mt-5 text-sm grid grid-cols-3 gap-y-2" style="border-top:1px solid var(--line);padding-top:1rem">${d("Author",esc(p.Author))}${d("Condition",p.Condition)}${p.Category?d("Category",esc(p.Category)):""}${d("Payment","Cash on delivery")}</dl></div></div>
 ${rel.length?`<h2 class="serif text-2xl font-bold mt-14 mb-4">You may also like</h2>${grid(rel)}`:""}`},
search(){const q=(qs.get("q")||"").trim(),l=products.filter(p=>(p.Title+" "+p.Author+" "+p.Category).toLowerCase().includes(q.toLowerCase()));
 return `<h1 class="serif text-3xl font-bold">Search results</h1><p class="mt-1 mb-6" style="color:var(--mute)">${l.length} result${l.length===1?"":"s"} for “${esc(q)}”</p>${grid(l)}`},
cart(){
 const e=Object.keys(cart);
 if(!e.length)return `<div class="text-center py-16"><h1 class="serif text-3xl font-bold">Your cart is empty</h1><p class="mt-2" style="color:var(--mute)">Add a book to get started.</p><a href="shop.html?c=all" class="btn mt-5">Browse books</a></div>`;
 return `<h1 class="serif text-3xl font-bold mb-6">Your cart</h1><div class="grid md:grid-cols-3 gap-8"><div class="md:col-span-2 space-y-3">${e.map(i=>{const p=byId(i);return `<div class="flex items-center gap-4 rounded-xl p-3" style="border:1px solid var(--line)"><div class="w-16">${cover(p).replace(/<b>.*?<\/small>/,"")}</div><div class="flex-1"><a href="product.html?id=${i}" class="serif font-bold">${esc(p.Title)}</a><div class="text-sm" style="color:var(--mute)">${rs(p.Price)}</div></div><button class="btn2 !px-3 !py-0" data-d="${i}" data-n="-1" aria-label="Remove one">−</button><span>${cart[i]}</span><button class="btn2 !px-3 !py-0" data-d="${i}" data-n="1" aria-label="Add one">+</button></div>`}).join("")}</div>
 <aside class="rounded-xl p-5 h-fit" style="background:var(--soft)"><h2 class="font-semibold mb-3">Order summary</h2>${totals()}<a href="checkout.html" class="btn w-full mt-4">Go to checkout</a></aside></div>`},
checkout(){
 if(qs.get("done"))return `<div class="text-center py-16 max-w-md mx-auto"><h1 class="serif text-3xl font-bold" style="color:var(--g)">Order placed</h1><p class="mt-3">Your order number is <b>${esc(qs.get("done"))}</b>.</p><p class="mt-1 text-sm" style="color:var(--mute)">We will call you to confirm before dispatch. Keep the cash ready for delivery.</p><a href="index.html" class="btn mt-6">Keep shopping</a></div>`;
 const e=Object.keys(cart);
 if(!e.length)return views.cart();
 return `<h1 class="serif text-3xl font-bold mb-6">Checkout</h1><div class="grid md:grid-cols-5 gap-8"><form id="form" class="md:col-span-3 space-y-3" novalidate><h2 class="font-semibold">Delivery details</h2>
 <div><label class="text-sm" for="fn">Full name</label><input id="fn" class="inp" autocomplete="name"></div>
 <div><label class="text-sm" for="ph">Phone (03XXXXXXXXX)</label><input id="ph" class="inp" inputmode="tel" autocomplete="tel" maxlength="13"></div>
 <div><label class="text-sm" for="ct">City</label><input id="ct" class="inp" autocomplete="address-level2"></div>
 <div><label class="text-sm" for="ad">Full address</label><textarea id="ad" class="inp" rows="3" autocomplete="street-address"></textarea></div>
 <p id="err" class="text-sm" style="color:#b3261e"></p><div class="rounded-xl p-4 text-sm" style="background:var(--soft)"><b>Payment:</b> cash on delivery. You pay ${rs(sub()+DELIVERY)} when the parcel arrives.</div><button id="place" class="btn w-full" type="submit">Place order</button></form>
 <aside class="md:col-span-2 rounded-xl p-5 h-fit" style="background:var(--soft)"><h2 class="font-semibold mb-3">Order summary</h2>${e.map(i=>{const p=byId(i);return `<div class="flex justify-between text-sm py-1"><span>${esc(p.Title)} × ${cart[i]}</span><span>${rs(p.Price*cart[i])}</span></div>`}).join("")}<div class="mt-3 pt-3" style="border-top:1px solid var(--line)">${totals()}</div></aside></div>`},
nf(){return `<div class="text-center py-16"><h1 class="serif text-3xl font-bold">Book not found</h1><p class="mt-2" style="color:var(--mute)">It may no longer be listed.</p><a href="shop.html?c=all" class="btn mt-5">Browse books</a></div>`}
};
const totals=()=>`<div class="text-sm space-y-1"><div class="flex justify-between"><span>Subtotal</span><span>${rs(sub())}</span></div><div class="flex justify-between"><span>Delivery</span><span>${rs(DELIVERY)}</span></div><div class="flex justify-between font-bold text-base pt-1"><span>Total</span><span>${rs(sub()+DELIVERY)}</span></div></div>`;

function change(p,d){const k=pid(p),n=(cart[k]||0)+d;if(n<=0)delete cart[k];else cart[k]=Math.min(n,p.Stock);saveCart()}
function draw(){$("view").innerHTML=views[page]();bind()}
function bind(){
 const s=$("sort");if(s)s.onchange=()=>{qs.set("sort",s.value);location.search=qs.toString()};
 const ab=$("addBtn");
 if(ab){let n=1;const p=byId(qs.get("id"));
  $("qm").onclick=()=>{n=Math.max(1,n-1);$("qn").textContent=n};
  $("qp").onclick=()=>{n=Math.min(p.Stock,n+1);$("qn").textContent=n};
  ab.onclick=()=>{change(p,n);toast(n+" added to your cart")};
  $("buyBtn").onclick=()=>{change(p,n);location.href="checkout.html"}}
 document.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{change(byId(b.dataset.d),+b.dataset.n);draw()});
 const f=$("form");if(f)f.onsubmit=submit;
}
async function submit(e){
 e.preventDefault();
 const name=$("fn").value.trim(),phone=$("ph").value.replace(/[\s-]/g,""),city=$("ct").value.trim(),addr=$("ad").value.trim();
 let m="";
 if(name.length<3)m="Enter your full name.";
 else if(!/^(03\d{9}|\+923\d{9})$/.test(phone))m="Enter a valid mobile number like 03001234567.";
 else if(city.length<2)m="Enter your city.";
 else if(addr.length<10)m="Enter your complete address with house, street and area.";
 $("err").textContent=m;if(m)return;
 const b=$("place");b.disabled=true;b.textContent="Placing order…";
 const d=new Date(),z=n=>String(n).padStart(2,"0");
 const order={orderId:(window.tbId=window.tbId||"TB"+d.getFullYear()+z(d.getMonth()+1)+z(d.getDate())+Math.floor(1000+Math.random()*9000)),date:d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate()),name,phone,city,address:addr,
  items:Object.entries(cart).map(([i,q])=>`${byId(i).Title} (x${q})`).join(", "),cartLines:Object.entries(cart).map(([i,q])=>({id:byId(i).ID,qty:q})),total:sub()+DELIVERY,status:"Pending"};
 try{
  if(API_URL){const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(order)});const j=await r.json();
   if(!j.ok){const er=String(j.error||"");try{sessionStorage.removeItem("tb_prod")}catch(x){}
    throw {user:/Out of stock/.test(er)?"Sorry, "+er.split("Out of stock: ")[1]+" is sold out or has less stock than your cart. Please update your cart.":/Unknown product/.test(er)?"A book in your cart is no longer available. Please update your cart.":"We could not place your order. Please check your details and try again."}}}
  cart={};saveCart();try{sessionStorage.removeItem("tb_prod")}catch(x){}
  location.href="checkout.html?done="+order.orderId;
 }catch(err){$("err").textContent=err.user||"We could not confirm your order. Check your connection and press Place order again. You will not be charged twice.";b.disabled=false;b.textContent="Place order"}
}
shell();
if(views[page]){$("view").innerHTML='<p class="py-20 text-center" style="color:var(--mute)">Loading books…</p>';loadData().then(draw)}
