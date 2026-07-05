const API="https://script.google.com/macros/s/AKfycbzR0PSW1q6mVTJ4qxefSMuRv04IbhvqcvJy2JfRfR21nEHoJak5CBFrdcEtGmejaV0z9Q/exec";
const groups={Vegetable:"🥬 Vegetables",Herb:"🌿 Herbs",Fruit:"🍎 Fruits"};
const state=JSON.parse(localStorage.getItem("purchaseQty")||"{}"); 

fetch(API)
.then(r=>r.json())
.then(data=>{
 const by={};
 data.forEach(x=>{
   (by[x.category]=by[x.category]||[]).push(x);
 });
 const root=document.getElementById("lists");
 Object.keys(groups).forEach(cat=>{
   if(!by[cat])return;
   const sec=document.createElement("div");
   sec.className="section";
   sec.innerHTML=`<h2>${groups[cat]}</h2>`;
   by[cat].forEach(item=>{
      const row=document.createElement("div");
      row.className="row";
      const input=document.createElement("input");
      input.type="number";
      input.step="0.1";
      input.inputMode="decimal";
      input.placeholder="kg";
      input.value=state[item.name]||"";
      input.addEventListener("input",()=>{
        if(input.value==="") delete state[item.name];
        else state[item.name]=input.value;
        localStorage.setItem("purchaseQty",JSON.stringify(state));
        update(data);
      });
      row.innerHTML=`<div>${item.name}</div>`;
      row.appendChild(input);
      row.appendChild(document.createTextNode("kg"));
      sec.appendChild(row);
   });
   root.appendChild(sec);
 });
 update(data);
});

function update(data){
 let out="";
 ["Vegetable","Herb","Fruit"].forEach(cat=>{
   const items=data.filter(x=>x.category===cat && state[x.name]);
   if(!items.length)return;
   out+=groups[cat]+"\n\n";
   items.forEach(i=>out+=`• ${i.name} - ${state[i.name]} kg\n`);
   out+="\n";
 });
 document.getElementById("preview").value=out.trim();
}

document.getElementById("copyBtn").onclick=()=>{
 navigator.clipboard.writeText(document.getElementById("preview").value);
 alert("Copied!");
};
document.getElementById("clearBtn").onclick=()=>{
 if(!confirm("Clear all quantities?"))return;
 localStorage.removeItem("purchaseQty");
 location.reload();
};
