/* Aplikasi Jadwal Pelajaran: memakai penyimpanan & sinkron Planner Devy, menampilkan modul jadwal saja */
(function(){
  var f=document.getElementById("jFrame"),l=document.getElementById("jLoad");
  if(l)l.hidden=false;
  f.addEventListener("load",function(){f.classList.add("on");document.body.classList.add("jon");if(l)l.hidden=true});
  f.src="wakasek.html?app=jadwal&v="+(window.PDV_V||1)+(location.hash||"");
})();
