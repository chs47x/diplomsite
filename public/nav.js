let i = 0;
let dt = new Array("ffffff","008f1f", "cc00ff");
function next_cl() {
    document.getElementById("logo_text").style.color='#'+dt[i++];
    if (i>=dt.length) i=0;
}
setInterval(next_cl,1000);