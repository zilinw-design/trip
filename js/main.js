document.getElementById('searchBtn').onclick=async()=>{
let k=document.getElementById('searchInput').value;
let box=document.getElementById('result');
box.innerHTML='搜索中...';
let ps=await searchAMap(k);
box.innerHTML='';
ps.slice(0,10).forEach(p=>{
let [lng,lat]=p.location.split(',');
let div=document.createElement('div');
div.className='result-item';
div.innerHTML=`<b>${p.name}</b><br>${p.address||''}<br><button>添加地图</button>`;
div.querySelector('button').onclick=()=>{addPlaceMarker({name:p.name,address:p.address,lat,lng});map.setView([lat,lng],16)};
box.appendChild(div);
});
}