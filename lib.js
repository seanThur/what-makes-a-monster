var dataVis_obs = [];

function globalStartTimer(i, t) {
    console.log(dataVis_obs);
    console.log(i);
    dataVis_obs[i].startTimer(t);
}

class DataVis {
    makeFrame(chart, desc) {
        let ret = "<div class='chart-nav-collapse' ><embed type='text/html' src='plotly/"+chart+".html' width='60%' height='600px'>";
        ret += "<br><div class='chart-desc'>"+desc+"</div></div>";
        return(ret);
    }
    
    startTimer(t) {
        clearTimeout(this.progressTimer);
        if(this.lockTimer) {
            return;
        }
        this.progressTimer = setTimeout(function() {this.startTimer(5000);this.moveForward()}.bind(this), t);
    }
    shutTimer(isStopped) {
        if(isStopped) {
            clearTimeout(this.progressTimer);
            this.lockTimer = true;
        }
        else {
            this.lockTimer = false;
            this.startTimer(1000);
        }
    } 
    makeBodyCode() {
        let frames = [];
        let keys_list = Object.keys(this.dataBrick)
        for(var t=0;t<keys_list.length;t++) {
            frames.push(this.makeFrame(keys_list[t], this.dataBrick[keys_list[t]]));
        }
        this.body_code = "<form mem='3' ob='"+this.adr+"' style='border: 1px dashed rgba(55,0,0,0.6);vertical-align: middle;'><span>Pause<input type='checkbox' onclick='dataVis_obs["+this.adr+"].shutTimer(this.checked)'/></span><input style='position:relative;right:34%;top:340px;' type='button' onclick='dataVis_obs["+this.adr+"].clickBackward();' value='<' class='chart-nav-button'/><input type='button' style='position:relative;left:30%;top:340px;' onclick='dataVis_obs["+this.adr+"].clickForward();' value='>' class='chart-nav-button'/>"

        /*let chart_name_slug = "<ul class='outer_list' style='text-align: center;width:auto;padding-left:0%;padding-right:0%;'>";
        for(var y=0;y<keys_list.length;y++) {
            chart_name_slug+="<li>"+keys_list[y]+"</li>";
        }
        chart_name_slug+="</ul>";*/

        //ret += "<div class='chart-nav-container' style='visibility: visible;height: auto;'> <center style='vertical-align: center;height: 600px;font-size: 36px'> <br>"+frames.length+" charts avalible."+chart_name_slug+" </center> </div>";

        for(var i=0;i<frames.length;i++) {
            this.body_code+=frames[i];
        }


        this.body_code += "</form>";
        
        return(this.body_code);
    }
    collapseChart(i) {
        this.chartFrames[i].setAttribute('class', 'chart-nav-collapse');
    }
    revealChart(i) {
        this.chartFrames[i].setAttribute('class', 'chart-nav-visible');
    }
    move(t) {
        this.collapseChart(this.current);
        this.current+=t;
        if(this.current < 0) {
            this.current = this.chartFrames.length-1;
        }
        if(this.current >= this.chartFrames.length) {
            this.current = 0;
        }
        this.revealChart(this.current);
    }
    moveForward() {
        this.move(1)
    }
    moveBackward() {
        this.move(-1);
    }
    clickForward() {
        this.moveForward();
        this.startTimer(60000);
    }
    clickBackward() {
        this.moveBackward();
        this.startTimer(60000);
    }
    constructor(dataBrick) {
        this.current = 0;
        this.dataBrick = dataBrick;
        this.lockTimer = false;
        this.progressTimer = 0;
        this.body_code = "";
        dataVis_obs.push(this);
        this.adr = dataVis_obs.length-1;
        this.makeBodyCode();
        this.form_ob = new DOMParser().parseFromString(this.body_code, "text/html").children[0].children[1].children[0];
        this.chartFrames = [];
        console.log(this.form_ob.children);
        this.pauseButton = this.form_ob.children[0];
        this.leftButton = this.form_ob.children[1];
        this.rightButton = this.form_ob.children[2];
        this.chartFrames = Array.from(this.form_ob.children).slice(3);
        this.revealChart(this.current);
        this.startTimer(200);
        return(this);
    }
    get_body_code() {
        return(this.body_code);
    }
    get_form_ob() {
        return(this.form_ob);
    }
}