function dataVis_make_frame(chart, desc) {
    ret = "<div class='chart-nav-collapse' ><embed type='text/html' src='plotly/"+chart+".html' width='60%' height='600px'>";
    ret += "<br><div class='chart-desc'>"+desc+"</div></div>";
    return(ret);
}

var wumbo;
function dataVis_nav_move(butt, dist) {
    console.log(butt.parentElement.children);
    papa = butt.parentElement
    console.log(butt.parentElement.getAttribute('mem'));
    current =  Number(butt.parentElement.getAttribute('mem'));
    console.log(current);
    //butt.parentElement.children[current].style.visibility = 'collapse';
    //butt.parentElement.children[current].style.height = '0px';
    butt.parentElement.children[current].setAttribute('class','chart-nav-collapse');
    
    current+=dist;
    if(current<3) {
        current = papa.children.length-1;
    }
    
    if(current> papa.children.length-1) {
        current = 3;
    }
    
    butt.parentElement.children[current].setAttribute('class', 'chart-nav-visible');
    //butt.parentElement.children[current].style.visibility = 'visible';
    //butt.parentElement.children[current].style.height = 'auto';
    
    butt.parentElement.setAttribute('mem', String(current));
}
function dataVis_nav_back(butt) {
    dataVis_nav_move(butt, -1);
}

function dataVis_nav_forward(butt) {
    dataVis_nav_move(butt, 1);
}

function startTimer(butt, t) {
    clearTimeout(progressTimer);
    progressTimer = setTimeout(function() {startTimer(butt, 5000);dataVis_nav_forward(butt);}, t);
}

function shutTimer(isStopped) {
    alert(isStopped);
    if(isStopped) {
        clearTimeout(progressTimer);
    }
    else {
        startTimer(document.getElementsByClassName('chart-nav-button')[1], 1000);
    }
} 

function dataVis(dataBrick) {
    /*
        Databrick: dictionary with chart name keys and desc. values.
    */
    frames = [];
    keys_list = Object.keys(dataBrick)
    for(var t=0;t<keys_list.length;t++) {
        frames.push(dataVis_make_frame(keys_list[t], dataBrick[keys_list[t]]));
    }
    ret = "<form mem='3' style='border: 1px dashed rgba(55,0,0,0.6);vertical-align: middle;'><span>Pause<input type='checkbox' onclick='shutTimer(this.checked)'/></span><input style='position:relative;right:34%;top:340px;' type='button' onclick='dataVis_nav_back(this);startTimer(this, 60000);' value='<' class='chart-nav-button'/><input type='button' style='position:relative;left:30%;top:340px;' onclick='dataVis_nav_forward(this);startTimer(this, 60000);' value='>' class='chart-nav-button'/>"
    
    chart_name_slug = "<ul class='outer_list' style='text-align: center;width:auto;padding-left:0%;padding-right:0%;'>";
    for(var y=0;y<keys_list.length;y++) {
        chart_name_slug+="<li>"+keys_list[y]+"</li>";
    }
    chart_name_slug+="</ul>";
    
    //ret += "<div class='chart-nav-container' style='visibility: visible;height: auto;'> <center style='vertical-align: center;height: 600px;font-size: 36px'> <br>"+frames.length+" charts avalible."+chart_name_slug+" </center> </div>";
    
    for(var i=0;i<frames.length;i++) {
        ret+=frames[i];
    }
    
    
    ret += "</form>";
    setTimeout(function() {
        startTimer(document.getElementsByClassName('chart-nav-button')[1], 50);
    }, 200);
    
    return(ret);
    
    
    
}

var progressTimer;