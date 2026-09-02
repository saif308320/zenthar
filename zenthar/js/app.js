(function () {
  const KEY = "zenthar_cart_v1";
  const PRODUCTS = {
    gx: { id: "gx", name: "Zenthar GX", base: 2499, img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=1200&q=80" },
    "gx-pro": { id: "gx-pro", name: "Zenthar GX Pro", base: 3199, img: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1200&q=80" },
    "vx-15": { id: "vx-15", name: "Zenthar VX 15", base: 1999, img: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=1200&q=80" },
    "nx-17": { id: "nx-17", name: "Zenthar NX 17", base: 2799, img: "https://images.unsplash.com/photo-1629429407759-01cd3d5bedba?auto=format&fit=crop&w=1200&q=80" },
    "core-14": { id: "core-14", name: "Zenthar Core 14", base: 1699, img: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?auto=format&fit=crop&w=1200&q=80" }
  };
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const save = (c) => localStorage.setItem(KEY, JSON.stringify(c));
  const money = (n) => "$" + n.toLocaleString("en-US");
  const count = () => load().reduce((s, i) => s + i.qty, 0);
  const total = () => load().reduce((s, i) => s + i.price * i.qty, 0);
  function add(item) {
    const cart = load();
    const key = item.id + "|" + (item.config || "");
    const f = cart.find((x) => x.key === key);
    if (f) f.qty += item.qty || 1;
    else cart.push({ key, id: item.id, name: item.name, config: item.config || "Stock", price: item.price, img: item.img, qty: item.qty || 1 });
    save(cart); render();
  }
  function updateQty(key, qty) { save(load().map((i) => i.key === key ? { ...i, qty: Math.max(1, qty) } : i)); render(); if (window.renderCart) window.renderCart(); }
  function remove(key) { save(load().filter((i) => i.key !== key)); render(); if (window.renderCart) window.renderCart(); }
  function clear() { save([]); render(); }
  function openD() { document.getElementById("shade")?.classList.add("on"); document.getElementById("drawer")?.classList.add("on"); }
  function closeD() { document.getElementById("shade")?.classList.remove("on"); document.getElementById("drawer")?.classList.remove("on"); }
  function render() {
    document.querySelectorAll("[data-count]").forEach((e) => e.textContent = count());
    const b = document.getElementById("db");
    if (b) {
      const c = load();
      b.innerHTML = c.length ? c.map((i) => `<div style="display:grid;grid-template-columns:64px 1fr auto;gap:8px;margin-bottom:12px"><img src="${i.img}" style="width:64px;height:48px;object-fit:cover" alt=""><div><strong>${i.name}</strong><div>${i.config}</div>${money(i.price)} × ${i.qty}</div><button class="ghostx" data-rm="${i.key}">x</button></div>`).join("") : "<p>Loadout empty.</p>";
      b.querySelectorAll("[data-rm]").forEach((x) => x.onclick = () => remove(x.dataset.rm));
    }
    const t = document.getElementById("dt");
    if (t) t.textContent = money(total());
  }
  window.ZX = { PRODUCTS, load, add, updateQty, remove, clear, money, count, total, openD, closeD, render };
  document.addEventListener("DOMContentLoaded", () => {
    render();
    document.getElementById("burger")?.addEventListener("click", () => document.getElementById("sidenav")?.classList.toggle("open"));
    document.querySelectorAll("[data-bag]").forEach((b) => b.onclick = openD);
    document.getElementById("shade")?.addEventListener("click", closeD);
    document.getElementById("dclose")?.addEventListener("click", closeD);
    document.querySelectorAll("[data-add]").forEach((btn) => {
      btn.onclick = () => {
        const p = PRODUCTS[btn.dataset.add];
        add({ id: p.id, name: p.name, price: p.base, img: p.img, qty: 1, config: "Stock" });
        openD();
      };
    });
  });
})();
