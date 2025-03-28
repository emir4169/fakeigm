// Beautify function from Cookie Clicker (keep exactly as before)
function triggerAnim(element,anim)
{
	if (!element) return;
	element.classList.remove(anim);
	void element.offsetWidth;
	element.classList.add(anim);
}

function formatEveryThirdPower(notations) {
    return function (value) {
        var base = 0,
            notationValue = '';
        if (!isFinite(value)) return 'Inf.';
        if (value >= 1000) {
            value /= 1000;
            while (Math.round(value) >= 1000) {
                value /= 1000;
                base++;
            }
            if (base >= notations.length) return 'Inf.';
            notationValue = notations[base];
        }
        return (value < 1000000000000 ? Math.round(value * 10) / 10 : Math.floor(value)) + notationValue;
    };
}
var formatShort = ['k', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No'];
var numberFormatter = formatEveryThirdPower(formatShort);

function Beautify(value, floats) {
    var negative = (value < 0);
    var decimal = '';
    var fixed = value.toFixed(floats);
    if (Math.abs(value) < 1000 && floats > 0 && Math.floor(fixed) != fixed) decimal = '.' + fixed.split('.')[1];
    value = Math.floor(Math.abs(value));
    if (floats > 0 && fixed == value + 1) value++;
    var output = numberFormatter(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (output == '0') negative = false;
    return negative ? '-' + output : output + decimal;
}
var B = Beautify;
var G = {}
G.author = "emir4169" // your own name goes here
G.author = G.author + " (made the game) emir4169 (made FakeIGM)";
    // Update building display with rounded costs
/*	function updateBuildingDisplay(building) {
	    const textEl = document.getElementById(`thing-text-${building.id}`);
	    const costEl = document.querySelector(`#thing-costs-${building.id}`).querySelector('.cost'); 
	    const container = document.getElementById(`thing-${building.id}`);

	    // Get the associated resource information
	    const resource = G.resources.find(r => r.key === building.cost.key);
	    const nextCost = Math.round(building.cost.amount * Math.pow(1.15, building.amount));
	    const hasEnough = resource.amount >= nextCost;
        // check if building.req() is true
	    if (textEl) textEl.textContent = `${building.name}: ${building.amount}`;
	    if (costEl) {
	        // Use the resource's actual name from game state instead of "R1"
	        costEl.textContent = `Cost: ${B(nextCost)} ${resource.name}`;
	        costEl.classList.toggle('notEnough', !hasEnough);
	        costEl.classList.toggle('hasEnough', hasEnough);
	    }
	    if (container) {
            container.classList.toggle('visible', building.req() === true);
            container.classList.toggle('hidden', building.req() === false);
	        container.classList.toggle('cantAfford', !hasEnough);
	        // Update visibility classes based on ownership
	        container.classList.toggle('notOwned', building.amount === 0);
	    }
	}*/
    
G.init = () => {
    G = {
        init: G.init,
        author: G.author,
        buildings: [],
        buttons: [],
        upgrades: [],
        resources: [],
        achievs: [],
        Things: [],
        
        Thing: function(type, key, name, amount = 0, cost = 0, effects = [], cssClasses = [], icon = [], req, clickAmount = 0,totalAmount = 0, onclick,desc = "", showEarned = true) {
            const thing = { 
                id: globalid++, 
                type, 
                key, 
                name, 
                amount, 
                cost, 
                effects,
                cssClasses,
                iconClasses: [],
                icon,
                clickAmount,
                req: req,
                desc,
                tooltip:function()
		        {
		        	var me=this;
		        	var str='';
		        	if (!me.noBuy && me.cost)//me.type=='res' || me.type=='building')
		        	{
		        		str+='<div class="costs">'+G.getCostsStr(G.getCosts(me, 1))+'</div>';
		        	}
		        	if (me.icon) str+='<div class="thing-icon" style="'+G.resolveIcon(me.icon,true)+'"></div>';
		        	if (me.name) str+='<div class="title">'+me.name+'</div>';
		        	if ((me.type=='upgrade' || me.type=='achiev') && me.amount > 0) str+='<div class="subtitle">(owned)</div>';
		        	if (me.type=='resource' || me.type=='building') str+='<div class="subtitle">(amount : '+B(me.amount)+')</div>';
		        	if (me.showEarned) str+='<div class="subtitle">(total earned : '+B(me.totalAmount)+')</div>';
		        	if (me.showMax) str+='<div class="subtitle">(max : '+B(me.maxAmount)+')</div>';
		        	if (me.showClicks) str+='<div class="subtitle">(clicks : '+B(me.clicks)+')</div>';
		        	if (me.desc) str+='<div class="desc"><div>'+`<div>`+me.desc+`</div>`+'</div></div>';
		        	return str;
		        },
                totalAmount,
                getQuickDom:function(id)
                {
                    //returns simplified non-gameplay DOM with no bindings save for tooltip, such as something you'd see in the stats page
                    var me=this;
                    var classes='thing '+me.type;
                    if (me.cssClasses) classes+=' '+me.cssClasses;
                    if (!me.icon) classes+=' noIcon';
                    classes+=' noText';
                    //if (me.tags) classes+=' tag-'+me.tags.join(' tag-');
                    classes+=" tag-"
                    var iconClasses='thing-icon';
                    if (me.iconClasses) iconClasses+=' '+me.iconClasses;
                    var icon=G.resolveIcon(me.icon);
                    var str='';
                    str+='<div '+(id?'id="'+id+'" ':'')+'class="'+classes+'">';
                    str+='<div class="'+iconClasses+'" style="'+icon+'"></div>';
                    if (!me.icon) str+='<div class="thing-text">'+me.name+'</div>';
                    str+='</div>';
                    if (me.tooltip && !me.noTooltip)
                    {
                        var obj={func:function(me){return function(){return me.tooltip();}}(me)};
                        if (me.tooltipClasses) obj.classes=me.tooltipClasses;
                        str=G.tooltipped(str,obj,'display:inline-block;');
                    }
                
                    return str;
                },
                onclick
            };
            this.Things.push(thing);
            return thing;
        },
        getQuickDom:function(me,id){
            //returns simplified non-gameplay DOM with no bindings save for tooltip, such as something you'd see in the stats page
            var classes='thing '+me.type;
            if (me.cssClasses) classes+=' '+me.cssClasses;
            if (!me.icon) classes+=' noIcon';
            classes+=' noText';
            //if (me.tags) classes+=' tag-'+me.tags.join(' tag-');
            classes+=" tag-"
            var iconClasses='thing-icon';
            if (me.iconClasses) iconClasses+=' '+me.iconClasses;
            var icon=G.resolveIcon(me.icon);
            var str='';
            str+='<div '+(id?'id="'+id+'" ':'')+'class="'+classes+'">';
            str+='<div class="'+iconClasses+'" style="'+icon+'"></div>';
            if (!me.icon) str+='<div class="thing-text">'+me.name+'</div>';
            str+='</div>';
            if (me.tooltip && !me.noTooltip)
            {
                var obj={func:function(me){return function(){return me.tooltip();}}(me)};
                if (me.tooltipClasses) obj.classes=me.tooltipClasses;
                str=G.tooltipped(str,obj,'display:inline-block;');
            }
        
            return str;
        },
        idlessThing: (type, key, name, amount, cost) => ({ type, key, name, amount, cost }),
        
        button: function(key, text, onclick, effects, cssClasses, icon, desc) {
            return G.Thing("button", key, text, 0, 0, effects, cssClasses, icon, () => true, 0,0, function(){G.hideTooltip();onclick()}, desc, true);
        }, //type, key, name, amount = 0, cost = 0, effects = [], cssClasses = [], icon = [], req, clickAmount = 0,totalAmount = 0, onclick,desc = "", showEarned = true
        shiny: function(key, name, moves, icon, effects, timeLeft) {
            var shiny = G.Thing("shiny", key, name, 0, 0, effects, ["bigButton"], icon, () => true, 0,0,function(){shiny.clickAmount = shiny.clickAmount + 1;applyEffects(effects, 1)}, "", true);
            shiny.moves = moves;
            shiny.timeLeft = timeLeft*30;
            shiny.dur = 10;
            shiny.durMult = 1;
            shiny.classes = shiny.cssClasses
            shiny.click = shiny.onclick
            shiny.logic = () => {
                if (shiny.timeLeft <= 0) {
                    shiny.timeLeft = timeLeft*30;
                    G.spawnShiny(shiny);
                } else {
                    shiny.timeLeft -= 1;
                }
            }
            return shiny
        }
    };
    // Beautify function from Cookie Clicker (keep exactly as before)
    function triggerAnim(element,anim)
    {
    	if (!element) return;
    	element.classList.remove(anim);
    	void element.offsetWidth;
    	element.classList.add(anim);
    }

    //the old Beautify function from Cookie Clicker, shortened to B(value)
    //initially adapted from http://cookieclicker.wikia.com/wiki/Frozen_Cookies_%28JavaScript_Add-on%29
    function formatEveryThirdPower(notations)
    {
    	return function (value)
    	{
    		var base = 0,
    		notationValue = '';
    		if (!isFinite(value)) return 'Inf.';
    		if (value >= 1000)
    		{
    			value /= 1000;
    			while(Math.round(value) >= 1000)
    			{
    				value /= 1000;
    				base++;
    			}
    			if (base >= notations.length) {return 'Inf.';} else {notationValue = notations[base];}
    		}
    		return (value<1000000000000?( Math.round(value * 10) / 10 ):Math.floor(value)) + notationValue;
    	};
    }

    function rawFormatter(value) {return Math.round(value * 1000) / 1000;}

    var formatLong=[' thousand',' million',' billion',' trillion',' quadrillion',' quintillion',' sextillion',' septillion',' octillion',' nonillion'];
    var prefixes=['','un','duo','tre','quattuor','quin','sex','septen','octo','novem'];
    var suffixes=['decillion','vigintillion','trigintillion','quadragintillion','quinquagintillion','sexagintillion','septuagintillion','octogintillion','nonagintillion'];
    for (var i in suffixes)
    {
    	for (var ii in prefixes)
    	{
    		formatLong.push(' '+prefixes[ii]+suffixes[i]);
    	}
    }

    var formatShort=['k','M','B','T','Qa','Qi','Sx','Sp','Oc','No'];
    var prefixes=['','Un','Do','Tr','Qa','Qi','Sx','Sp','Oc','No'];
    var suffixes=['D','V','T','Qa','Qi','Sx','Sp','O','N'];
    for (var i in suffixes)
    {
    	for (var ii in prefixes)
    	{
    		formatShort.push(' '+prefixes[ii]+suffixes[i]);
    	}
    }
    formatShort[10]='Dc';


    var numberFormatters =
    [
    	formatEveryThirdPower(formatShort),
    	formatEveryThirdPower(formatLong),
    	rawFormatter
    ];
    var numberFormatter=numberFormatters[2];
    function Beautify(value,floats)
    {
    	var negative=(value<0);
    	var decimal='';
    	var fixed=value.toFixed(floats);
    	if (Math.abs(value)<1000 && floats>0 && Math.floor(fixed)!=fixed) decimal='.'+(fixed.toString()).split('.')[1];
    	value=Math.floor(Math.abs(value));
    	if (floats>0 && fixed==value+1) value++;
    	var formatter=numberFormatter;
    	var output=formatter(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g,',');
    	if (output=='0') negative=false;
    	return negative?'-'+output:output+decimal;
    }
    var B=Beautify;
        function BeautifyTime(value)
    {
    	//value should be in seconds
    	value=Math.max(Math.ceil(value,0));
    	var years=Math.floor(value/31536000);
    	value-=years*31536000;
    	var days=Math.floor(value/86400);
    	value-=days*86400;
    	var hours=Math.floor(value/3600)%24;
    	value-=hours*3600;
    	var minutes=Math.floor(value/60)%60;
    	value-=minutes*60;
    	var seconds=Math.floor(value)%60;
    	var str='';
    	if (years) str+=B(years)+'Y';
    	if (days || str!='') str+=B(days)+'d';
    	if (hours || str!='') str+=hours+'h';
    	if (minutes || str!='') str+=minutes+'m';
    	if (seconds || str!='') str+=seconds+'s';
    	if (str=='') str+='0s';
    	return str;
    }
    var BT=BeautifyTime;


    var sayTime=function(time,detail)
    {   
	    //time is a value where one second is equal to 1000.
	    //detail skips days when >1, hours when >2, minutes when >3 and seconds when >4.
	    //if detail is -1, output something like "3 hours, 9 minutes, 48 seconds"
	    if (time<=0) return '';
	    var str='';
	    var detail=detail||0;
	    time=Math.floor(time);
	    var second=1000;
	    if (detail==-1)
	    {
	    	var days=0;
	    	var hours=0;
	    	var minutes=0;
	    	var seconds=0;
	    	if (time>=second*60*60*24) days=(Math.floor(time/(second*60*60*24)));
	    	if (time>=second*60*60) hours=(Math.floor(time/(second*60*60)));
	    	if (time>=second*60) minutes=(Math.floor(time/(second*60)));
	    	if (time>=second) seconds=(Math.floor(time/(second)));
	    	hours-=days*24;
	    	minutes-=hours*60+days*24*60;
	    	seconds-=minutes*60+hours*60*60+days*24*60*60;
	    	if (days>10) {hours=0;}
	    	if (days) {minutes=0;seconds=0;}
	    	if (hours) {seconds=0;}
	    	var bits=[];
	    	if (days>0) bits.push(B(days)+' day'+(days==1?'':'s'));
	    	if (hours>0) bits.push(B(hours)+' hour'+(hours==1?'':'s'));
	    	if (minutes>0) bits.push(B(minutes)+' minute'+(minutes==1?'':'s'));
	    	if (seconds>0) bits.push(B(seconds)+' second'+(seconds==1?'':'s'));
	    	if (bits.length==0) str='less than 1 second';
	    	else str=bits.join(', ');
	    }
	    else
	    {
	    	if (time>=second*60*60*24*2 && detail<2) str=B(Math.floor(time/(second*60*60*24)))+' days';
	    	else if (time>=second*60*60*24 && detail<2) str='1 day';
	    	else if (time>=second*60*60*2 && detail<3) str=B(Math.floor(time/(second*60*60)))+' hours';
	    	else if (time>=second*60*60 && detail<3) str='1 hour';
	    	else if (time>=second*60*2 && detail<4) str=B(Math.floor(time/(second*60)))+' minutes';
	    	else if (time>=second*60 && detail<4) str='1 minute';
	    	else if (time>=second*2 && detail<5) str=B(Math.floor(time/(second)))+' seconds';
	    	else if (time>=second && detail<5) str='1 second';
	    	else str='less than 1 second';
	    }
	    return str;
    }
    G.desc = "A fake version of IGM."
    G.getCosts=function(thing,amount)
    {
        //also see : G.getCostsStr, G.spendCosts
        var costByThing = {}
        // repeat through all things in G.resources
        for (var i in G.resources)
        {
            var resource = G.resources[i]
            var resource_cost = thing.cost.find((a) => (a.key == resource.key))
            var cost = 0
            if (resource_cost) var cost = resource_cost.amount
            costByThing[resource.id] = calculateTotalCost(cost,thing.amount,amount)//cost*amount   /*.amount*amount*/
        }
        return costByThing
    },
    G.getProductionRate= function(resourceKey) {
	    return G.buildings.reduce((total, building) => {
	        building.effects.forEach(effect => {
	            if (effect.type === 'tick' && effect.arg1 === resourceKey) {
	                let multiplier = 1;
				
	                // Only apply upgrades that specifically target this building
	                G.upgrades.forEach(upgrade => {
	                    if (upgrade.amount > 0) {
	                        upgrade.effects.forEach(upEffect => {
	                            if (upEffect.type === 'gain' && 
	                                (upEffect.arg1 === "all"||upEffect.arg1 === resourceKey||upEffect.arg1 === building.key)) {  // This is the crucial check
	                                multiplier *= upEffect.arg2;
	                            }
	                        });
	                    }
	                });
				
	                total += building.amount * effect.arg2 * multiplier;
	            }
	        });
	        return total;
	    }, 0);
	}
    G.getCostsStr=function(costs,neutral,specialOutput)
    {
        var str='';
        var notEnough=0;
        var t=0;
        for (var i in costs)
        {
            var w=G.Things[i];
            var v=costs[i];
            //if (v>w.amount) t=-1;
            if (G.getProductionRate(w.key) == 0) t=-1;
            // veryCOolStRingThatWillNeverBeAnywhereElse1
            if (t!=-1) t=Math.max(t,(v-w.amount)/G.getProductionRate(G.resources.find((a) => (a.id == i)).key));
            var classes='cost';
            if (!neutral && !w.canBeNegative && v>w.amount) {classes+=' notEnough';notEnough++;}
            else if (!neutral) classes+=' hasEnough';
            str+='<div class="'+classes+'">'+B(v)+' '+(v==1?w.name:w.name)+'</div>';
        }

        if (t>0 && !neutral) str+='<div class="costTimeRemaining">(in '+sayTime(t*1000+750)+')</div>';
        if (!specialOutput) return str;
        else return {str:str,lacking:notEnough};
    }
    G.resolveIcon=function(icon,small,contain = false)
    {
        //returns a bit of CSS
        var str='';
        if (icon)
        {
            str='background-image:';
            if (contain) {
                str="background-size: contain;background-image:"
            }
            for (var ii in icon)
            {
                str+='url('+icon[ii].url+'),';
            }
            str=str.slice(0,-1);
            str+=';background-position:';
            for (var ii in icon)
            {
                str+=icon[ii].x*48+'px '+icon[ii].y*48+'px,';
            }
            str=str.slice(0,-1);
            if (small)
            {
                str+=';background-size:';
                for (var ii in icon)
                {
                    if (icon[ii].tile) str+='auto,';
                    else str+='100%,';
                }
                str=str.slice(0,-1);
            }
            str+=';';
        }
        return str;
    },
    G.textN=0;
	G.updateTextTimer=function(id,func,freq)
	{
		var el=document.getElementById('updatabletextspan-'+id);
		if (el)
		{
			var delay=freq*1000;
			if (freq<0) {freq=-freq;delay=100;}//a trick : the first update always occurs 100ms after being declared
			el.innerHTML=func();
			G.addCallbacks();
			setTimeout(function(id,func){return function(){G.updateTextTimer(id,func,freq);}}(id,func),delay);
		}
	}
    G.selfUpdatingText=function(func,freq)
    {
        if (!freq) freq=1;
        //returns a string for a span of text that updates itself every second; creates a callback that must be applied after the html has been created, with G.addCallbacks()
        var id=G.textN;
        var str='<span class="updatabletextspan" id="updatabletextspan-'+id+'">'+func()+'</span>';
        G.pushCallback(function(id,func,freq){return function(){
            G.updateTextTimer(id,func,-freq);
        }}(id,func,freq));
        G.textN++;
        return str;
    }
    G.w=window.innerWidth;
    G.h=window.innerHeight;
    G.resizing=false;
    if (!G.stabilizeResize) G.stabilizeResize=function(){}
    G._stabilizeResize=function()
    {
        G.resizing=false;
        G.stabilizeResize();
    }
    G.resize=function()
    {
        G.resizing=true;
    }
    window.addEventListener('resize',function(event)
    {
        G.w=window.innerWidth;
        G.h=window.innerHeight;
        G.resize();
    });
    AddEvent(document,'mousedown',function(event){G.mouseDown=true;G.mousePressed=true;G.mouseDragFrom=event.target;G.mouseDragFromX=G.mouseX;G.mouseDragFromY=G.mouseY;});
	AddEvent(document,'mouseup',function(event){G.mouseUp=true;G.mouseDragFrom=0;});
	AddEvent(document,'click',function(event){G.clickL=event.target;});
    var saveAs=function(view){"use strict";if(typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var doc=view.document,get_URL=function(){return view.URL||view.webkitURL||view},save_link=doc.createElementNS("http://www.w3.org/1999/xhtml","a"),can_use_save_link="download"in save_link,click=function(node){var event=new MouseEvent("click");node.dispatchEvent(event)},is_safari=/Version\/[\d\.]+.*Safari/.test(navigator.userAgent),webkit_req_fs=view.webkitRequestFileSystem,req_fs=view.requestFileSystem||webkit_req_fs||view.mozRequestFileSystem,throw_outside=function(ex){(view.setImmediate||view.setTimeout)(function(){throw ex},0)},force_saveable_type="application/octet-stream",fs_min_size=0,arbitrary_revoke_timeout=500,revoke=function(file){var revoker=function(){if(typeof file==="string"){get_URL().revokeObjectURL(file)}else{file.remove()}};if(view.chrome){revoker()}else{setTimeout(revoker,arbitrary_revoke_timeout)}},dispatch=function(filesaver,event_types,event){event_types=[].concat(event_types);var i=event_types.length;while(i--){var listener=filesaver["on"+event_types[i]];if(typeof listener==="function"){try{listener.call(filesaver,event||filesaver)}catch(ex){throw_outside(ex)}}}},auto_bom=function(blob){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)){return new Blob(["\ufeff",blob],{type:blob.type})}return blob},FileSaver=function(blob,name,no_auto_bom){if(!no_auto_bom){blob=auto_bom(blob)}var filesaver=this,type=blob.type,blob_changed=false,object_url,target_view,dispatch_all=function(){dispatch(filesaver,"writestart progress write writeend".split(" "))},fs_error=function(){if(target_view&&is_safari&&typeof FileReader!=="undefined"){var reader=new FileReader;reader.onloadend=function(){var base64Data=reader.result;target_view.location.href="data:attachment/file"+base64Data.slice(base64Data.search(/[,;]/));filesaver.readyState=filesaver.DONE;dispatch_all()};reader.readAsDataURL(blob);filesaver.readyState=filesaver.INIT;return}if(blob_changed||!object_url){object_url=get_URL().createObjectURL(blob)}if(target_view){target_view.location.href=object_url}else{var new_tab=view.open(object_url,"_blank");if(new_tab==undefined&&is_safari){view.location.href=object_url}}filesaver.readyState=filesaver.DONE;dispatch_all();revoke(object_url)},abortable=function(func){return function(){if(filesaver.readyState!==filesaver.DONE){return func.apply(this,arguments)}}},create_if_not_found={create:true,exclusive:false},slice;filesaver.readyState=filesaver.INIT;if(!name){name="download"}if(can_use_save_link){object_url=get_URL().createObjectURL(blob);setTimeout(function(){save_link.href=object_url;save_link.download=name;click(save_link);dispatch_all();revoke(object_url);filesaver.readyState=filesaver.DONE});return}if(view.chrome&&type&&type!==force_saveable_type){slice=blob.slice||blob.webkitSlice;blob=slice.call(blob,0,blob.size,force_saveable_type);blob_changed=true}if(webkit_req_fs&&name!=="download"){name+=".download"}if(type===force_saveable_type||webkit_req_fs){target_view=view}if(!req_fs){fs_error();return}fs_min_size+=blob.size;req_fs(view.TEMPORARY,fs_min_size,abortable(function(fs){fs.root.getDirectory("saved",create_if_not_found,abortable(function(dir){var save=function(){dir.getFile(name,create_if_not_found,abortable(function(file){file.createWriter(abortable(function(writer){writer.onwriteend=function(event){target_view.location.href=file.toURL();filesaver.readyState=filesaver.DONE;dispatch(filesaver,"writeend",event);revoke(file)};writer.onerror=function(){var error=writer.error;if(error.code!==error.ABORT_ERR){fs_error()}};"writestart progress write abort".split(" ").forEach(function(event){writer["on"+event]=filesaver["on"+event]});writer.write(blob);filesaver.abort=function(){writer.abort();filesaver.readyState=filesaver.DONE};filesaver.readyState=filesaver.WRITING}),fs_error)}),fs_error)};dir.getFile(name,{create:false},abortable(function(file){file.remove();save()}),abortable(function(ex){if(ex.code===ex.NOT_FOUND_ERR){save()}else{fs_error()}}))}),fs_error)}),fs_error)},FS_proto=FileSaver.prototype,saveAs=function(blob,name,no_auto_bom){return new FileSaver(blob,name,no_auto_bom)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(blob,name,no_auto_bom){if(!no_auto_bom){blob=auto_bom(blob)}return navigator.msSaveOrOpenBlob(blob,name||"download")}}FS_proto.abort=function(){var filesaver=this;filesaver.readyState=filesaver.DONE;dispatch(filesaver,"abort")};FS_proto.readyState=FS_proto.INIT=0;FS_proto.WRITING=1;FS_proto.DONE=2;FS_proto.error=FS_proto.onwritestart=FS_proto.onprogress=FS_proto.onwrite=FS_proto.onabort=FS_proto.onerror=FS_proto.onwriteend=null;return saveAs}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!=null){define([],function(){return saveAs})}


	G.mouseX=0;
	G.mouseY=0;
	G.mouseMoved=0;
	G.draggedFrames=0;//increment every frame when we're moving the mouse and we're clicking
	G.GetMouseCoords=function(e)
	{
		var posx=0;
		var posy=0;
		if (!e) var e=window.event;
		if (e.pageX||e.pageY)
		{
			posx=e.pageX;
			posy=e.pageY;
		}
		else if (e.clientX || e.clientY)
		{
			posx=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
			posy=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
		}
		var x=0;
		var y=0;
		G.mouseX=posx-x;
		G.mouseY=posy-y;
		G.mouseMoved=1;
	}
	AddEvent(document,'mousemove',G.GetMouseCoords);
    
		G.keys={};//key is being held down
		G.keysD={};//key was just pressed down
		G.keysU={};//key was just pressed up
		//shift=16, ctrl=17
		AddEvent(window,'keyup',function(e){
			if ((document.activeElement.nodeName=='TEXTAREA' || document.activeElement.nodeName=='INPUT') && e.keyCode!=27) return;
			if (e.keyCode==27) {}//esc
			else if (e.keyCode==13) {}//enter
			G.keys[e.keyCode]=0;
			G.keysD[e.keyCode]=0;
			G.keysU[e.keyCode]=1;
		});
		AddEvent(window,'keydown',function(e){
			if (!G.keys[e.keyCode])//prevent repeats
			{
				if (e.ctrlKey && e.keyCode==83) {e.preventDefault();}//ctrl-s
				if ((document.activeElement.nodeName=='TEXTAREA' || document.activeElement.nodeName=='INPUT') && e.keyCode!=27) return;
				if (e.keyCode==32) {e.preventDefault();}//space
				G.keys[e.keyCode]=1;
				G.keysD[e.keyCode]=1;
				G.keysU[e.keyCode]=0;
				//console.log('Key pressed : '+e.keyCode);
			}
		});
		AddEvent(window,'blur',function(e){
			G.keys={};
			G.keysD={};
			G.keysU={};
		});
    G.Callbacks=[];
    G.callbackDepth=0;
    G.addCallbacks=function()
    {
        if (G.callbackDepth>0) return false;//prevent nesting callbacks
        G.callbackDepth++;
        var len=G.Callbacks.length;
        for (var i=0;i<len;i++)
        {G.Callbacks[i]();}
        G.Callbacks=[];
        G.callbackDepth--;
    }
    G.pushCallback=function(func)
    {
        G.Callbacks.push(func);
    }

	/*=====================================================================================
	PARTICLES
	=======================================================================================*/
	G.particlesL=document.getElementById('particles');
	G.particlesN=50;
	G.particlesI=0;
	G.particles=[];
	G.particlesReset=function()
	{
		var str='';
		for (var i=0;i<G.particlesN;i++)
		{
			str+='<div id="particle-'+i+'" class="particle"><div id="particleText-'+i+'" class="particleText"></div></div>';
		}
		G.particlesL.innerHTML=str;
		
		for (var i=0;i<G.particlesN;i++)
		{
			G.particles[i]={id:i,low:false,t:-1,x:0,y:0,xd:0,yd:0,l:document.getElementById('particle-'+i),lt:document.getElementById('particleText-'+i)};
		}
	}
	G.particlesReset();
	
	G.particleAt=function(el,icon,text)
	{
		//if (G.getSetting('particles')==0) return false;
		var me=G.particles[G.particlesI];
		/*var box=el.getBoundingClientRect();
		var x=box.left;
		var y=box.top;
		var w=box.right-x;
		var h=box.bottom-y;
		me.x=x+w*0.2+Math.random()*w*0.6-24;
		me.y=y+h*0.2+Math.random()*h*0.6-24-48;*/
		me.x=G.mouseX-24+(Math.random()*20-10);
		me.y=G.mouseY-24-48+(Math.random()*20-10);
		me.xd=Math.random()*8-4;
		me.yd=-Math.random()*8-4;
		me.r=Math.random()*90-45;
		me.t=0;
		if (text) me.lt.innerHTML=text;
		me.baseCSS='display:block;'+G.resolveIcon(icon,true);
		if (true)
		{
			//if low fps, trigger simple CSS animation instead
			me.low=true;
			me.l.style.cssText=me.baseCSS+'opacity:0;left:'+Math.floor(me.x)+'px;top:'+Math.floor(me.y)+'px;';
			triggerAnim(me.l,'particlePop');
		}
		else {me.low=false;me.l.classList.remove('particlePop');}
		G.particlesI++;
		if (G.particlesI>=G.particlesN) G.particlesI=0;
	}
	G.particlesLogic=function()
	{
		for (var i=0;i<G.particlesN;i++)
		{
			var me=G.particles[i];
			if (!me.low && me.t>=0)
			{
				var r=Math.pow(me.t/20,0.15);
				var r2=Math.pow(me.t/20,5);
				me.l.style.cssText=me.baseCSS+'opacity:'+(1-r2)+';transform:translate('+me.x+'px,'+me.y+'px) rotate('+(me.r*(1-r))+'deg) scale('+(0.5+0.5*r)+','+(1.5-0.5*r)+');transform-origin:50% 100%;';
				me.x+=me.xd;
				me.y+=me.yd;
				me.xd*=0.95;
				me.yd+=1;
				me.yd=Math.min(me.yd,6);
				me.t++;
				if (me.t>20)
				{
					me.t=-1;
					me.l.style.cssText='display:none;';
					me.lt.innerHTML='';
				}
			}
		}
	}
		
    G.popupsL=document.getElementById('popups');
    G.popups=[];
    G.popup=function(el,o)
    {
        //TODO : handle el
        var me={};
        for (var i in o){me[i]=o[i];}
        me.l=document.createElement('div');
        var classes='popup';
        if (me.classes) classes+=' '+me.classes;
        me.l.className=classes;
        me.l.innerHTML=(me.text||'');
        if (me.init) me.init(me);
        var buttonl=document.createElement('div');
        buttonl.innerHTML='x';
        buttonl.className='closeButton closesThePopup';
        me.l.insertBefore(buttonl,me.l.firstChild);
        var closers=me.l.getElementsByClassName('closesThePopup');
        for (var i in closers)
        {AddEvent(closers[i],'click',function(me){return function(){G.closePopup(me);}}(me));}
        G.popupsL.appendChild(me.l);
        G.popups.push(me);
        G.addCallbacks();
        return me;
    }
    G.closePopup=function(me)
    {
        if (!me) var me=G.popups[G.popups.length-1];
        if (me.onClose) me.onClose(me);
        G.popups.splice(G.popups.indexOf(me),1);
        me.l.parentNode.removeChild(me.l);
    }
    G.popupDraw=function()
    {
        var topb=0;
        var bottomb=G.h;
        var leftb=0;
        var rightb=G.w;
        for (var i in G.popups)
        {
            var me=G.popups[i];
            if (me.func) me.func(me);
            me.l.style.left=Math.floor((rightb-leftb)/2-me.l.clientWidth/2)+'px';
            me.l.style.top=Math.floor((bottomb-topb)/2-me.l.clientHeight/2)+'px';
            me.l.style.opacity=1;
        }
    }
    let globalid = 0;
    function AddEvent(html_element,event_name,event_function)
    {
	    if(html_element.attachEvent) html_element.attachEvent("on" + event_name, function() {event_function.call(html_element);});
	    else if(html_element.addEventListener) html_element.addEventListener(event_name, event_function, false);
    }
    
	G.toastsL=document.getElementById('toasts');
	G.toasts=[];
	G.toast=function(o)
	{
		var me={};
		for (var i in o){me[i]=o[i];}
		me.l=document.createElement('div');
		var classes='toast popInVertical';
		if (me.classes) classes+=' '+me.classes;
		me.l.className=classes;
		me.l.innerHTML=(me.text||'');
		me.t=0;
		me.toDie=0;
		if (me.init) me.init(me);
		var buttonl=document.createElement('div');
		buttonl.innerHTML='x';
		buttonl.className='closeButton closesThePopup';
		me.l.insertBefore(buttonl,me.l.firstChild);
		var closers=me.l.getElementsByClassName('closesThePopup');
		for (var i in closers)
		{AddEvent(closers[i],'click',function(me){return function(){G.closeToast(me);}}(me));}
		G.toastsL.appendChild(me.l);
		G.toasts.push(me);
		G.addCallbacks();
		return me;
	}
	G.closeToast=function(me)
	{
		if (!me) var me=G.toasts[G.toasts.length-1];
		if (me.toDie) return false;
		me.toDie=1;
		me.l.classList.remove('popInVertical');
		me.l.classList.add('popOutVertical');
		if (me.onClose) me.onClose(me);
	}
	G.killToast=function(me)
	{
		if (!me) var me=G.toasts[G.toasts.length-1];
		G.toasts.splice(G.toasts.indexOf(me),1);
		me.l.parentNode.removeChild(me.l);
	}
	G.toastLogic=function()
	{
		for (var i in G.toasts)
		{
			var me=G.toasts[i];
			if (me.toDie)
			{
				me.toDie++;
				if (me.toDie>=30*0.3) G.killToast(me);
			}
			else
			{
				me.t++;
				if (me.dur>0 && me.t>=me.dur*30) G.closeToast(me);
			}
		}
	}
    G.tooltipL=document.getElementById('tooltip');
    G.tooltipContentL=document.getElementById('tooltipContent');
    G.tooltipPU=document.getElementById('tooltipPU');
    G.tooltipPD=document.getElementById('tooltipPD');
    G.tooltipPL=document.getElementById('tooltipPL');
    G.tooltipPR=document.getElementById('tooltipPR');
    G.pseudoHover=new Event('pseudoHover');
    G.tooltip={
        parent:0,origin:0,classes:'',text:'',on:false,settled:false,t:0,
    };
    G.tooltipReset=function()
    {
        G.tooltip={
            parent:0,origin:0,classes:'',text:'',on:false,settled:false,t:0,
        };
    }
    G.tooltipReset();
    G.addTooltip=function(el,o)
    {
        AddEvent(el,'mouseover',function(el,o){return function(){
            var settled=(el==G.tooltip.parent);
            G.showTooltip(el,o);
            if (settled) G.tooltip.settled=true;
        }}(el,o));
        AddEvent(el,'pseudoHover',function(el,o){return function(){
            G.showTooltip(el,o);
        }}(el,o));
        AddEvent(el,'mouseout',function(el,o){return function(){
            G.hideTooltip(el);
        }}(el,o));
    }
    G.showTooltip=function(el,o)
    {
        G.tooltipReset();
        var me=G.tooltip;
        me.on=true;
        for (var i in o){me[i]=o[i];}
        me.parent=el;
        if (!me.origin) me.origin='top';
    }
    G.hideTooltip=function(el)
    {
        var prev=G.tooltip.parent;
        if (el==-1) G.tooltipReset();
        else if (!el || el==prev)
        {
            G.tooltipReset();
            if (!prev) G.tooltip.settled=true;
            var underneath=document.elementFromPoint(G.mouseX,G.mouseY);
            if (underneath && prev && underneath!=prev)
            {
                underneath.dispatchEvent(G.pseudoHover);
                G.tooltip.settled=true;
            }
        }
    }
    G.tooltipDraw=function()
    {
        var me=G.tooltip;
        if (me.on)
        {
            if (!me.parent || !document.body.contains(me.parent)) {G.hideTooltip();}
            else
            {
                if (!me.settled)
                {
                    if (me.classes) G.tooltipL.className=me.classes;
                    if (me.text) G.tooltipContentL.innerHTML=me.text;
                    G.tooltipL.style.opacity='0';
                    G.tooltipL.style.display='block';
                    G.tooltipL.classList.remove('stretchIn');
                    G.tooltipL.classList.remove('stretchInV');
                }
                if (me.func && me.t%10==0) G.tooltipContentL.innerHTML=me.func();
                
                var div=me.parent;
                var box=div.getBoundingClientRect();
                
                var topb=0;
                var bottomb=G.h;
                var leftb=0;
                var rightb=G.w;
                var margin=8;
                var tx=G.tooltipL.offsetLeft;
                var ty=G.tooltipL.offsetTop;
                var tw=G.tooltipL.clientWidth;
                var th=G.tooltipL.clientHeight;
                var x=0;
                var y=0;
                var i=0;
                var origin=me.origin;
                
                //try to fit within the screen
                var spins=[];
                if (origin=='top') spins=['top','bottom','right','left'];
                else if (origin=='bottom') spins=['bottom','top','right','left'];
                else if (origin=='left') spins=['left','right','top','bottom'];
                else if (origin=='right') spins=['right','left','top','bottom'];
                
                for (var i=0;i<4;i++)
                {
                    var spin=spins[i];
                    origin=spin;
                    if (spin=='top')
                    {
                        x=(box.left+box.right)/2;
                        y=box.top;
                        x=x-tw/2;
                        y=y-th-margin;
                        x=Math.max(0,Math.min(G.w-tw,x));
                    }
                    else if (spin=='bottom')
                    {
                        x=(box.left+box.right)/2;
                        y=box.bottom;
                        x=x-tw/2;
                        y=y+margin;
                        x=Math.max(0,Math.min(G.w-tw,x));
                    }
                    else if (spin=='left')
                    {
                        x=box.left;
                        y=(box.top+box.bottom)/2;
                        x=x-tw-margin;
                        y=y-th/2;
                        y=Math.max(0,Math.min(G.h-th,y));
                    }
                    else if (spin=='right')
                    {
                        x=box.right;
                        y=(box.top+box.bottom)/2;
                        x=x+margin;
                        y=y-th/2;
                        y=Math.max(0,Math.min(G.h-th,y));
                    }
                    if (y>=topb && y+th<=bottomb && x>=leftb && x+tw<=rightb) break;
                }
                
                G.tooltipPU.style.display='none';
                G.tooltipPD.style.display='none';
                G.tooltipPL.style.display='none';
                G.tooltipPR.style.display='none';
                if (origin=='top')
                {
                    G.tooltipPD.style.display='block';
                    G.tooltipPD.style.left=Math.floor((box.left+box.right)/2-x-6)+'px';
                    G.tooltipPD.style.bottom=Math.floor(-6)+'px';
                }
                else if (origin=='bottom')
                {
                    G.tooltipPU.style.display='block';
                    G.tooltipPU.style.left=Math.floor((box.left+box.right)/2-x-6)+'px';
                    G.tooltipPU.style.top=Math.floor(-6)+'px';
                }
                else if (origin=='left')
                {
                    G.tooltipPR.style.display='block';
                    G.tooltipPR.style.right=Math.floor(-6)+'px';
                    G.tooltipPR.style.top=Math.floor((box.top+box.bottom)/2-y-6)+'px';
                }
                else if (origin=='right')
                {
                    G.tooltipPL.style.display='block';
                    G.tooltipPL.style.left=Math.floor(-6)+'px';
                    G.tooltipPL.style.top=Math.floor((box.top+box.bottom)/2-y-6)+'px';
                }
                
                if (!me.settled) triggerAnim(G.tooltipL,(origin=='top' || origin=='bottom')?'stretchIn':'stretchInV');
                me.settled=true;
                
                G.tooltipL.style.left=Math.floor(x)+'px';
                G.tooltipL.style.top=Math.floor(y)+'px';
                G.tooltipL.style.opacity='1';
                me.t++;
            }
        }
        else
        {
            if (!me.settled)
            {
                me.settled=true;
                G.tooltipL.classList.remove('stretchIn');
                G.tooltipL.classList.remove('stretchInV');
                G.tooltipL.style.opacity='0';
                triggerAnim(G.tooltipL,'fadeOutQuick');
                //G.tooltipL.style.display='none';
                //G.tooltipL.className='';
            }
        }
    }
    G.popupsL=document.getElementById('popups');
    G.popups=[];
    G.popup=function(el,o)
    {
        //TODO : handle el
        var me={};
        for (var i in o){me[i]=o[i];}
        me.l=document.createElement('div');
        var classes='popup';
        if (me.classes) classes+=' '+me.classes;
        me.l.className=classes;
        me.l.innerHTML=(me.text||'');
        if (me.init) me.init(me);
        var buttonl=document.createElement('div');
        buttonl.innerHTML='x';
        buttonl.className='closeButton closesThePopup';
        me.l.insertBefore(buttonl,me.l.firstChild);
        var closers=me.l.getElementsByClassName('closesThePopup');
        for (var i in closers)
        {AddEvent(closers[i],'click',function(me){return function(){G.closePopup(me);}}(me));}
        G.popupsL.appendChild(me.l);
        G.popups.push(me);
        G.addCallbacks();
        return me;
    }
    G.closePopup=function(me)
    {
        if (!me) var me=G.popups[G.popups.length-1];
        if (me.onClose) me.onClose(me);
        G.popups.splice(G.popups.indexOf(me),1);
        me.l.parentNode.removeChild(me.l);
    }
    G.popupDraw=function()
    {
        var topb=0;
        var bottomb=G.h;
        var leftb=0;
        var rightb=G.w;
        for (var i in G.popups)
        {
            var me=G.popups[i];
            if (me.func) me.func(me);
            me.l.style.left=Math.floor((rightb-leftb)/2-me.l.clientWidth/2)+'px';
            me.l.style.top=Math.floor((bottomb-topb)/2-me.l.clientHeight/2)+'px';
            me.l.style.opacity=1;
        }
    }
    G.buttonsN=0;
	G.settingsbutton=function(obj)
	{
		//returns a string for a new button; creates a callback that must be applied after the html has been created, with G.addCallbacks()
		//obj can have text, tooltip (text that shows on hover), onclick (function executed when button is clicked), classes (CSS classes added to the button), id (force button to have that id)
		var id=obj.id||('button-'+G.buttonsN);
		var str='<div '+(obj.style?('style="'+obj.style+'" '):'')+'class="systemButton'+(obj.classes?(' '+obj.classes):'')+'" id="'+id+'">'+(obj.text||'-')+'</div>';
		if (obj.onclick || obj.tooltip)
		{
			G.pushCallback(function(id,obj){return function(){
				if (document.getElementById(id))
				{
					if (typeof obj.tooltip==='function') G.addTooltip(document.getElementById(id),{func:obj.tooltip});
					else G.addTooltip(document.getElementById(id),{text:obj.tooltip});
					if (obj.onclick) document.getElementById(id).onclick=obj.onclick;
				}
			}}(id,obj));
		}
		G.buttonsN++;
		return str;
	}
    G.tooltipdN=0;
    G.tooltipped=function(text,obj,style)
	{
		var id='tooltippedspan-'+G.tooltipdN;
		//var str='<span class="tooltippedspan"'+(style?' style="'+style+'"':'')+' id="'+id+'">'+text+'</span>';
		var div=document.createElement('div');
		//weird trickery here, don't even ask
		div.innerHTML=text;
		if (div.firstChild.nodeType==3) div.innerHTML='<span>'+div.innerHTML+'</span>';
		if (!div.firstChild.id) div.firstChild.id=id;
		else id=div.firstChild.id;
		var str=div.innerHTML;
		G.pushCallback(function(id,obj){return function(){
			if (typeof obj==='string') G.addTooltip(document.getElementById(id),{text:obj});
			else G.addTooltip(document.getElementById(id),obj);
		}}(id,obj));
		G.tooltipdN++;
		return str;
	}
    
	G.shiniesE=[];
	G.shiniesL=document.getElementById('shinies');
	G.shiniesN=0;
	G.spawnShiny=function(type)
	{
		var fail=false;
		var me={
			type:type,
			x:0,
			y:0,
			t:0,
			tm:Math.max(0,30*type.dur*type.durMult),
		};
		me.l=document.createElement('div');
		var moves=me.type.moves;
		if ('anywhere' in moves)
		{
			me.x=Math.random()*G.w;
			me.y=Math.random()*(G.h);
		}
		else if ('onRight' in moves)
		{
			me.x=G.w;
			me.y=Math.random()*(G.h);
		}
		else if ('onLeft' in moves)
		{
			me.x=0;
			me.y=Math.random()*(G.h);
		}
		else if ('onBottom' in moves)
		{
			me.x=Math.random()*G.w;
			me.y=(G.h);
		}
		else if ('onTop' in moves)
		{
			me.x=Math.random()*G.w;
			me.y=0;
		}
		else if ('onMouse' in moves)
		{
			me.x=G.mouseX;
			me.y=G.mouseY;
		}
		me.a=0;
		if ('randomAngle' in moves)
		{
			me.a=Math.random()*360;
		}
		me.d=0;
		if ('moveRandom' in moves)
		{
			me.d=Math.random();
		}
		
		if (fail) return false;
		
		var classes='thing shiny';
		if (me.type.classes) classes+=' '+me.type.classes;
		if (!me.type.noClick)
		{
			AddEvent(me.l,'click',function(me){return function(){
				if (me.t<me.tm) {me.type.click();me.t=me.tm;}
			}}(me));
		}
		var str='';
		if (!me.type.icon) classes+=' noIcon';
		else
		{
			var icon=G.resolveIcon(me.type.icon);
			str+='<div class="thing-icon shiny-icon" style="'+icon+'"></div>';
		}
		if (me.type.noText || !me.type.customName) classes+=' noText';
		else str+='<div class="thing-text shiny-text">'+me.type.name+'</div>';
		me.l.innerHTML=str;
		me.l.className=classes;
		G.shiniesL.appendChild(me.l);
		me.offx=-me.l.clientWidth/2;
		me.offy=-me.l.clientHeight/2;
		me.id=G.shiniesN;
		G.shiniesN++;
		G.shiniesE.push(me);
	}
	G.shiniesLogic=function()
	{
		var shinies=[];
		for (var i in G.shiniesE)
		{
			var me=G.shiniesE[i];
			me.t++;
			if (me.t>=me.tm)
			{
				me.l.parentNode.removeChild(me.l);
			}
			else shinies.push(me);
		}
		G.shiniesE=shinies;
	}
	G.shiniesDraw=function()
	{
		for (var i in G.shiniesE)
		{
			var me=G.shiniesE[i];
			var moves=me.type.moves;
			var r=me.t/me.tm;
			var x=me.x;
			var y=me.y;
			var o=1;
			var a=me.a;
			var s=1;
			if ('fade' in moves)
			{
				/*if (r<0.10) o=r/0.10;
				else if (r<0.90) o=1;
				else o=1-(r-0.90)/0.10;*/
                o=r
			}
			if ('grow' in moves) s*=r;
			else if ('shrink' in moves) s*=1-r;
			else if ('growShrink' in moves) s*=Math.sqrt(1-(1-r*2)*(1-r*2));
			if ('wiggle' in moves)
			{
				a+=Math.sin(me.t*(moves['wiggle']||0.25)+me.id)*18;
			}
			if ('spinCW' in moves) a+=me.t*(moves['spinCW']||1);
			else if ('spinCCW' in moves) a-=me.t*(moves['spinCCW']||1);
			else if ('spinRandom' in moves) a+=me.t*(me.id%2==0?1:-1)*(moves['spinRandom']||1);
			if ('pulse' in moves)
			{
				s*=1+0.05*Math.sin(me.t*(moves['pulse']||0.35)+me.id);
			}
			if ('followMouse' in moves)
			{
				x=G.mouseX;
				y=G.mouseY;
			}
			else if ('followMouseSlow' in moves)
			{
				x+=(G.mouseX-x)*(moves['followMouseSlow']||0.1);
				y+=((G.mouseY)-y)*(moves['followMouseSlow']||0.1);
				me.x=x;
				me.y=y;
			}
			else if ('moveRandom' in moves)
			{
				x+=Math.sin(me.d*Math.PI*2)*(moves['moveRandom']||3);
				y+=Math.cos(me.d*Math.PI*2)*(moves['moveRandom']||3);
				me.x=x;
				me.y=y;
			}
			else if ('moveLeft' in moves) x=moves['moveLeft']||(me.x*(1-r));
			else if ('moveRight' in moves) x=moves['moveRight']||(me.x+(G.w-me.x)*(r));
			else if ('moveTop' in moves) y=moves['moveTop']||(me.y*(1-r));
			else if ('moveBottom' in moves) y=moves['moveBottom']||(me.y+(G.h-me.y)*(r));
			if ('bobVertical' in moves)
			{
				y+=Math.sin(me.t*(moves['bobVertical']||0.2)+me.id)*8;
			}
			if ('bobHorizontal' in moves)
			{
				x+=Math.cos(me.t*(moves['bobHorizontal']||0.2)+me.id)*8;
			}
			var sx=s;
			var sy=s;
			if ('bounce' in moves)
			{
				var bounce=me.t*(moves['bounce']||0.05)+me.id;
				y-=Math.abs(Math.cos(bounce)*128)-64;
				/*sx=1+Math.sin(bounce*2+0.3*(Math.PI*2))*0.2;
				sy=1+Math.sin(bounce*2-0.2*(Math.PI*2))*0.2;
				a+=Math.sin(bounce*2-0.15*(Math.PI*2))*18+12;*/
			}
			x+=me.offx;
			y+=me.offy;
			me.l.style.transform='translate('+(x)+'px,'+(y)+'px) rotate('+(a)+'deg) scale('+(sx)+','+(sy)+')';
			me.l.style.opacity=1-o;
            if (me.l.style.opacity === 0) {
                me.l.remove()
            }
		}
	}
    G.bulkDisplay=document.getElementById('bulkDisplay')||0;
    // Initialize game state to match your HTML IDs
    G.resources.push(
        G.Thing("resource", "cookie", "Cookies", 0, 0, [],["noBackground"], [{tile: true, url: 'https://orteil.dashnet.org/cookieclicker/img/icons.png', x: -0, y: -5}], () => (true), 0,0,function(){}, "These are your cookies. You can use them to purchase things. Your goal is to have as many cookies as possible!")  // thing-0
    );

    G.buildings.push(
        G.Thing("building", "cursor", "Cursor", 0,    
            [G.idlessThing("resource", "cookie", "Cookies", 15, 0)],
            [{ type: "tick", effect: "add", arg1: "cookie", arg2: 0.1 }], [],
            [{tile: true, url: 'https://orteil.dashnet.org/cookieclicker/img/icons.png', x: -0, y: -29}],
            () => (true), 0,0,function(){},"A tiny little cursor clicking your cookie.</div><div><b>Effect:</b></div><div>&bull; Produces 1 cookie every 10 seconds.",true
        ),
    );

    G.upgrades.push(
        G.Thing("upgrade", "u1", "Machine", 0,    
            [G.idlessThing("resource", "cookie", "Cookies", 100, 0)],
            [{ type: "gain", effect: "multiply", arg1: "cookie", arg2: 2 }], ["noText"],
            [{tile: true, url: 'https://orteil.dashnet.org/cookieclicker/img/icons.png', x: -0, y: -0}],
            () => (G.resources[0].totalAmount >= 10), 0,0,function(){},"A nice little supplement to your cookie production&apos; diet.</div><div><b>Effect:</b></div><div>&bull; 2x cookies"
        )
    );

    G.buttons.push(
        G.button("bu1", "Make cookies", () => {     
            // add bunnies
            G.resources[0].clickAmount += 1;
            applyEffects(G.buttons[0].effects, 1);
        }, [{ type: "instant", effect: "add", arg1: "cookie", arg2: 1 }],["bigButton","hasFlares","noText"], [{url: "https://orteil.dashnet.org/cookieclicker/img/icon.png"}]
        ,  "Click this cookie to get more cookies!"
        ),
        
      /*  G.button("bu2", "Get 1 Golden Carrot", () => {    
            G.resources[1].clickAmount += 1;
            applyEffects(G.buttons[1].effects);
        }, [{ type: "instant", effect: "add", arg1: "goldenCarrot", arg2: 1 }]
        ,["noIcon"], [],"Get 1 Golden Carrot"),*/
    );
    G.shinies = [
        // G.shiny = function(key, name, moves, icon, effects, timeLeft)
        G.shiny("luckyBunny","luckyBunny",{onRight: 0, moveLeft: 0, fade: 0, bounce: 0.05},
            [{url: 'https://orteil.dashnet.org/igm/stuff/luckyBunny.png', x: 0, y: 0}],
            [{ type: "instant", effect: "add", arg1: "cookie", arg2: 1000 }], 60
        )
    ];
    G.achievement = function(id,name,desc,icon,req,noTooltip){
        var achievement = {
            id  ,
            type: "achiev",
            name,
            desc,
            classes: "",
            icon,
            req, 
            getQuickDom:function(id){
                //returns simplified non-gameplay DOM with no bindings save for tooltip, such as something you'd see in the stats page
                me = this;
                var classes='thing '+me.type;
                if (me.cssClasses) classes+=' '+me.cssClasses;
                //if (!me.icon) classes+=' noIcon';
                classes+=' noText';
                //if (me.tags) classes+=' tag-'+me.tags.join(' tag-');
                classes+=" tag-"
                var iconClasses='thing-icon';
                //if (me.iconClasses) iconClasses+=' '+me.iconClasses;
                var icon=G.resolveIcon(me.icon);
                var str='';
                str+='<div '+(id?'id="'+id+'" ':'')+'class="'+classes+'">';
                str+='<div class="'+iconClasses+'" style="'+icon+'"></div>';
                if (!me.icon) str+='<div class="thing-text">'+me.name+'</div>';
                str+='</div>';
                if (me.tooltip && !me.noTooltip)
                {
                    var obj={func:function(me){return function(){return me.tooltip();}}(me)};
                    if (me.tooltipClasses) obj.classes=me.tooltipClasses;
                    str=G.tooltipped(str,obj,'display:inline-block;');
                }
            
                return str;
            },
            owned: false,
            tooltipClasses: "achiev",
            noTooltip,
            tooltip:function()
            {
                var me=this;
                var str='';
                if (me.icon) str+='<div class="thing-icon" style="'+G.resolveIcon(me.icon,true)+'"></div>';
                if (me.name) str+='<div class="title">'+me.name+'</div>';
                if ((me.type=='upgrade' || me.type=='achiev') && me.owned) str+='<div class="subtitle">(owned)</div>';
                if (me.desc) str+='<div class="desc"><div>'+`<div>`+me.desc+`</div>`+'</div></div>';
                return str;
            }
        }
        return achievement
    }
    G.achievs = [
        G.achievement( // function(id,name,desc,icon,req,noTooltip)
            "template",
            "Locked Achievement",
            "You dont have this achievement yet!",
            [
                {tile: true, url: 'https://orteil.dashnet.org/cookieclicker/img/icons.png', x: -0, y: -7},
            ],
        
            () => (false), // we should never unlock this, its what is rendered if we dont have a achievement. since false will never become true we will never meet the criteria
            false
        ),
        G.achievement( // function(id,name,desc,icon,req,noTooltip)
            "a1",
            "Run rabbit run",
            "Have <b>1</b> cookie.",
            [
                {tile: true, url: 'https://orteil.dashnet.org/cookieclicker/img/icons.png', x: -0, y: -5},
            ],
        
            () => (G.resources[0].amount >= 1),
            false
        ),
        G.achievement( // function(id,name,desc,icon,req,noTooltip)
            "a2",
            "Bunniest home videos",
            `Have <b>${B(1000)}</b> cookies.`,
            [
                {tile: true, url: 'https://orteil.dashnet.org/cookieclicker/img/icons.png', x: -1, y: -5}
            ],
        
            () => (G.resources[0].amount >= 1000),
            false
        ),
        G.achievement( // function(id,name,desc,icon,req,noTooltip)
            "a3",
            "You've got buns, hun",
            `Have <b>${B(1000000)}</b> cookies.`,
            [
                {tile: true, url: 'https://orteil.dashnet.org/cookieclicker/img/icons.png', x: -2, y: -5}
            ],
        
            () => (G.resources[0].amount >= 1000000),
            false
        ),
        G.achievement( // function(id,name,desc,icon,req,noTooltip)
            "a4",
            "Casual baking",
            `Produce <b>${B(1)}</b> cookies per second.`,
            [
                {tile: true, url: 'https://orteil.dashnet.org/cookieclicker/img/icons.png', x: -0, y: -5}
            ],
        
            () => (getProductionRate("cookie") >= 1),
            false
        ),
        G.achievement( // function(id,name,desc,icon,req,noTooltip)
            "a5",
            "Hardcore baking",
            `Produce <b>${B(10)}</b> cookies per second.`,
            [
                {tile: true, url: 'https://orteil.dashnet.org/cookieclicker/img/icons.png', x: -1, y: -5}
            ],
        
            () => (getProductionRate("cookie") >= 10),
            false
        ),
        G.achievement( // function(id,name,desc,icon,req,noTooltip)
            "a6",
            "Steady tasty stream",
            `Produce <b>${B(100)}</b> cookies per second.`,
            [
                {tile: true, url: 'https://orteil.dashnet.org/cookieclicker/img/icons.png', x: -2, y: -5}
            ],
        
            () => (getProductionRate("cookie") >= 100),
            false
        ),
        G.achievement( // function(id,name,desc,icon,req,noTooltip)
            "a7",
            "Cookie monster",
            `Produce <b>${B(1000)}</b> cookies per second.`,
            [
                {tile: true, url: 'https://orteil.dashnet.org/cookieclicker/img/icons.png', x: -3, y: -5}
            ],
        
            () => (getProductionRate("cookie") >= 1000),
            false
        )
    ]
    
	function updateBuildingDisplay(building) {
	    const textEl = document.getElementById(`thing-text-${building.id}`);
	    const costEl = document.querySelector(`#thing-costs-${building.id} .cost`); 
        const costEl2 = document.querySelector(`#thing-costs-${building.id} .secondCost`); 
	    const container = document.getElementById(`thing-${building.id}`);  
	    // Get the associated resource information
        var nextCost = {}
        var resource = {}
        var hasEnougharray = {} //false
        var hasEnough = false
        if (building.cost) {
            resource[0] = G.resources.find(r => r.key === building.cost[0].key);
            if (building.cost[1]) {
                resource[1] = G.resources.find(r => r.key === building.cost[1].key);
            }
	        nextCost[0] = Math.round(building.cost[0].amount * Math.pow(1.15, building.amount));
            if (building.cost[1]) {
                nextCost[1] = Math.round(building.cost[1].amount * Math.pow(1.15, building.amount));
            }
	        hasEnougharray[0] = resource[0].amount >= nextCost[0];
            if (building.cost[1]) {
                hasEnougharray[1] = resource[1].amount >= nextCost[1];
            }
            hasEnough = hasEnougharray[0];
            if (building.cost[1]) {
                hasEnough = hasEnougharray[0] && hasEnougharray[1];
            }
        }
        // check if building.req() is true
	    if (textEl) textEl.textContent = `${building.name}: ${building.amount}`;
	    if (costEl) {
	        // Use the resource's actual name from game state instead of "R1"
            if (building.cost && resource) {
	            costEl.textContent = `${B(nextCost[0])} ${resource[0].name}`;
                if (building.cost[1] && resource[1]) {
                    costEl2.textContent =`${B(nextCost[1])} ${resource[1].name}`;
                }
            }
            
	        costEl.classList.toggle('notEnough', !hasEnough);
	        costEl.classList.toggle('hasEnough', hasEnough);
            if (building.cost[1] && resource[1]) {
                costEl2.classList.toggle('notEnough', !hasEnougharray[1]);
	            costEl2.classList.toggle('hasEnough', hasEnougharray[1]);
            }
	    }
	    if (container) {
            container.classList.toggle('visible', building.req() === true);
            container.classList.toggle('hidden', building.req() === false);
	        container.classList.toggle('cantAfford', !hasEnough);
	        // Update visibility classes based on ownership
	        container.classList.toggle('notOwned', building.amount === 0);
	    }
	}
	function createThingElement(thing) {
	    const container = document.createElement('div');
	    container.id = `thing-${thing.id}`;
        var b = ""
        thing.cssClasses.forEach((a) => (b = b+" "+a))
	    container.className = `thing ${thing.type} dim tag-`/*+(thing.req() ? "visible" : "hidden")*/+b;

	    // Create text element
	    var textEl = document.createElement('div');
	    textEl.id = `thing-text-${thing.id}`;
	    textEl.className = 'thing-text';
	    textEl.textContent = thing.text || thing.name; // Handle both buttons and other things
        //if (thing.iconUrl) {
            const iconEl = document.createElement('div');
            iconEl.id = `thing-icon-${thing.id}`;
            iconEl.className = 'thing-icon shadowed';/*
            iconEl.style.backgroundImage = `url(${thing.iconUrl})`;
            iconEl.style.backgroundPosition = "center";*/
            iconEl.setAttribute("style",G.resolveIcon(thing.icon, false, thing.type=="button"));
            container.appendChild(iconEl);
           // textEl = null
        //}
	    // Create cost element for buildings and upgrades
	    if (thing.type === 'building') {
	        const costsEl = document.createElement('div');
	        costsEl.id = `thing-costs-${thing.id}`;
	        costsEl.className = 'thing-costs';
		
	        const costEl = document.createElement('div');
	        costEl.className = 'cost';
	        costsEl.appendChild(costEl);
            if (thing.cost[1]) {
                const costEl2 = document.createElement('div');
                costEl2.className = 'cost secondCost';
                costsEl.appendChild(costEl2);
            }
		
	        container.appendChild(textEl);
	        container.appendChild(costsEl);
	    } else {
            if (textEl) {
	            container.appendChild(textEl);
            }
	    }
	    return container;
	}
    G.l = document.body
	function populateContainers() {
	    const containers = {
	        resource: document.getElementById('box-things-Resources'),
	        building: document.getElementById('box-things-Buildings'),
	        upgrade: document.getElementById('box-things-Upgrades'),
	        button: document.getElementById('box-things-Buttons')
	    };

	    G.Things.forEach(thing => {
	        const container = containers[thing.type];
	        if (container) {
	            const el = createThingElement(thing);
	            container.appendChild(el);
                thing.l=document.getElementById('thing-'+thing.id)||0;
                thing.iconl=document.getElementById('thing-icon-'+thing.id)||0;
                thing.textl=document.getElementById('thing-text-'+thing.id)||0;
                thing.costsl=document.getElementById('thing-costs-'+thing.id)||0;
                if (thing.l)
                {
                    if (thing.tooltip)
                    {
                        var obj={func:function(thing){return function(){return thing.tooltip();}}(thing)};/*
                        if (thing.tooltipOrigin) obj.origin=thing.tooltipOrigin;
                        else if (thing.box.tooltipOrigin) obj.origin=thing.box.tooltipOrigin;
                        if (thing.tooltipClasses) obj.classes=thing.tooltipClasses;
                        else if (thing.box.tooltipClasses) obj.classes=thing.box.tooltipClasses;*/
                        G.addTooltip(thing.l,obj);
                    }
                }
	        }
	    });
	}
	populateContainers();
	// In the getProductionRate function, modify the upgrade effect check:
	function getProductionRate(resourceKey) {
	    return G.buildings.reduce((total, building) => {
	        building.effects.forEach(effect => {
	            if (effect.type === 'tick' && effect.arg1 === resourceKey) {
	                let multiplier = 1;
				
	                // Only apply upgrades that specifically target this building
	                G.upgrades.forEach(upgrade => {
	                    if (upgrade.amount > 0) {
	                        upgrade.effects.forEach(upEffect => {
	                            if (upEffect.type === 'gain' && 
	                                upEffect.arg1 === building.key) {  // This is the crucial check
	                                multiplier *= upEffect.arg2;
	                            }
	                        });
	                    }
	                });
				
	                total += building.amount * effect.arg2 * multiplier;
	            }
	        });
	        return total;
	    }, 0);
	}

	// Update resource display to show proper names
	function updateResourceDisplay(resource) {
	    const el = document.getElementById(`thing-text-${resource.id}`);
	    if (el) {
	        const rate = getProductionRate(resource.key);
	        // Use the resource's own name property
            var rateText = "";
            if (rate != 0){
                rateText = `(${B(rate, 1)}/s)`
            }
	        el.textContent = `${resource.name}: ${B(Math.round(resource.amount))} ${rateText}`;
	    }
	}

    function updateUpgradeDisplay(upgrade) {
        const el = document.getElementById(`thing-${upgrade.id}`);
        const textEl = document.getElementById(`thing-text-${upgrade.id}`);
        if (el && textEl) {
            var canBuy = upgrade.amount === 1
            canBuy = canBuy && G.resources.find(r => r.key === upgrade.cost[0].key).amount >= upgrade.cost[0].amount
            if (upgrade.cost[1]) canBuy = canBuy && G.resources.find(r => r.key === upgrade.cost[1].key).amount >= upgrade.cost[1].amount
            el.classList.toggle('cantAfford', !canBuy);
            el.classList.toggle('visible', upgrade.req() === true);
            el.classList.toggle('hidden', upgrade.req() === false);
            el.classList.toggle("owned", upgrade.amount === 1)
        }
    }

    // Initialize reactivity
    G.resources.forEach(resource => {
        let _amount = resource.amount;
        Object.defineProperty(resource, "amount", {
            get: () => _amount,
            set: (v) => {
                _amount = v;
                updateResourceDisplay(resource);
                G.buildings.forEach(updateBuildingDisplay);
                G.upgrades.forEach(updateUpgradeDisplay);
            }
        });
    });
   // Helper functions for cost calculations
	function calculateTotalCost(base, currentAmount, transactionAmount) {
	    let total = 0;
	    for (let i = 0; i < transactionAmount; i++) {
	        const cost = base * Math.pow(1.15, currentAmount + i);
	        total += Math.round(cost);
	    }
	    return total;
	}

	function calculateRefund(base, currentAmount, transactionAmount) {
	    let total = 0;
	    const start = currentAmount - transactionAmount;
	    for (let i = start; i < currentAmount; i++) {
	        const cost = base * Math.pow(1.15, i);
	        total += Math.round(cost);
	    }
	    return total;
	}

    // Initialize reactivity with rounding
    G.resources.forEach(resource => {
        let _amount = resource.amount;
        Object.defineProperty(resource, "amount", {
            get: () => _amount,
            set: (v) => {
                _amount = (v);
                updateResourceDisplay(resource);
                G.buildings.forEach(updateBuildingDisplay);
                G.upgrades.forEach(updateUpgradeDisplay);
            }
        });
    });

    G.buildings.forEach(building => {
        let _amount = building.amount;
        Object.defineProperty(building, "amount", {
            get: () => _amount,
            set: (v) => {
                _amount = v;
                updateBuildingDisplay(building);
                G.resources.forEach(updateResourceDisplay);
            }
        });

        const el = document.getElementById(`thing-${building.id}`);
        if (el) {
            el.addEventListener('click', (e) => {
                var resource = {};
                resource[0] = G.resources.find(r => r.key === building.cost[0].key);
                if (building.cost[1]) {
                    resource[1] = G.resources.find(r => r.key === building.cost[1].key);
                }
                var isBuying = !e.ctrlKey;
                var isShift = e.shiftKey;
                var baseCost = {};
                baseCost[0] = building.cost[0].amount;
                if (building.cost[1]) {
                    baseCost[1] = building.cost[1].amount;
                }
                const currentOwned = building.amount;
                if (isBuying) {
                    let buyAmount = isShift ? 50 : 1;
                    var totalCost = []
                    // function calculateTotalCost(base, currentAmount, transactionAmount) {totalCost}
                    totalCost[0] = calculateTotalCost(baseCost[0], currentOwned, buyAmount)
                    if (building.cost[1]) {
                        totalCost[1] = calculateTotalCost(baseCost[1], currentOwned, buyAmount)
                    }
                    var canAfford = resource[0].amount >= totalCost[0]
                    if (building.cost[1]) {
                        canAfford = resource[0].amount >= totalCost[0] && resource[1].amount >= totalCost[1]
                    }
                    if (canAfford) {
                        resource[0].amount -= totalCost[0];
                        if (building.cost[1]) {
                            G.resources.find(r => r.key === building.cost[1].key).amount -= totalCost[1];
                        }
                        building.amount += buyAmount;
                    }
                } else {
                    let sellAmount = Math.min(isShift ? 50 : 1, building.amount);
                    if (sellAmount > 0) {
                        const refund = calculateRefund(baseCost, building.amount, sellAmount);
                        resource.amount += refund;
                        building.amount -= sellAmount;
                    }
                }
            });
        }
    });

	G.upgrades.forEach(upgrade => {
    	let _amount = upgrade.amount;
    	Object.defineProperty(upgrade, "amount", {
        	get: () => _amount,
        	set: (v) => {
            	_amount = v;
            	updateUpgradeDisplay(upgrade);
            	G.resources.forEach(updateResourceDisplay);
        	}
    	});
	
    const el = document.getElementById(`thing-${upgrade.id}`);
    if (el) {
			el.addEventListener('click', () => {
				// Only allow purchase if not already owned
				if (upgrade.amount === 0) {
                    var resource = {}
					resource[0] = G.resources.find(r => r.key === upgrade.cost[0].key);
                    if (upgrade.cost[1]) resource[1] = G.resources.find(r => r.key === upgrade.cost[1].key);
                    // if both resource.amounts are enough for the upgrade to be purchased, purchase the upgrade by setting upgrade.amount to 1
                    var canAfford = resource[0].amount >= upgrade.cost[0].amount;
                    if (upgrade.cost[1] && resource[1]) canAfford = canAfford && resource[1].amount >= upgrade.cost[1].amount;
					if (canAfford) {
						resource[0].amount -= upgrade.cost[0].amount;
                        if (upgrade.cost[1] && resource[1]) resource[1].amount -= upgrade.cost[1].amount;
						upgrade.amount = 1; // Set to 1 when purchased
					}
				}
			});
		}
	});
    G.fileLoad=function(e)
	{
		if (e.target.files.length==0) return false;
		var file=e.target.files[0];
		var reader=new FileReader();
		reader.onload=function(e)
		{
			G.load(e.target.result);
		}
		reader.readAsText(file);
	}
    G.fileSave=function()
    {
        var filename='IGM-'+(G.name.replace(/[^a-zA-Z0-9]+/g,'')||'game');
        var text=G.save();
        var blob=new Blob([text],{type:'text/plain;charset=utf-8'});
        saveAs(blob,filename+'.txt');
        G.toast({text:'File saved to '+filename+'.txt',classes:'center',dur:3});
    }
    // Button handlers
    G.buttons.forEach(button => {
        const el = document.getElementById(`thing-${button.id}`);
        if (el) {
            el.addEventListener('click', button.onclick);
        }
    });

    // Game logic
    function applyEffects(effects, amount = 1) {
        effects.forEach(effect => {
            const target = G.Things.find(r => r.key === effect.arg1);
            let multiplier = amount;
				
            // Only apply upgrades that specifically target this building
            G.upgrades.forEach(upgrade => {
                if (upgrade.amount > 0) {
                    upgrade.effects.forEach(upEffect => {
                        if (upEffect.type === 'gain' && 
                            upEffect.arg1 === target.key) {  // This is the crucial check
                            multiplier *= upEffect.arg2;
                        }
                    });
                }
            });
            if (target) {
                if (effect.effect === "add") {target.amount += effect.arg2*multiplier;target.totalAmount += effect.arg2*multiplier}
                if (effect.effect === "multiply") {target.amount *= effect.arg2*multiplier;target.totalAmount *= effect.arg2*multiplier}
            }
        });
    }

    function gameTick() {
        G.buildings.forEach(building => {
        if (building.amount > 0) applyEffects(building.effects, building.amount);
        });
        for (var i in G.achievs)
        {
            var me=G.achievs[i];
            if (me.owned === false && me.req() === true) {
                me.owned = true;
                var str='';
				if (me.icon) str+='<div class="thing-icon" style="'+G.resolveIcon(me.icon,true)+'"></div>';
				if (me.name) str+='Got achievement :<div class="title">'+me.name+'</div>'; else str+='Got achievement!';
				G.toast({text:str,dur:10});
            }
        }
    }

    // Initial updates
    G.resources.forEach(updateResourceDisplay);
    G.buildings.forEach(updateBuildingDisplay);
    G.upgrades.forEach(updateUpgradeDisplay);
    setInterval(gameTick, 1000);
     G.save=function() {
        const saveData = {
            resources: G.resources.map(r => ({ 
                key: r.key, 
                amount: r.amount,
                clickAmount: r.clickAmount,
                totalAmount: r.totalAmount 
            })),
            buildings: G.buildings.map(b => ({ 
                key: b.key, 
                amount: b.amount 
            })),
            upgrades: G.upgrades.map(u => ({ 
                key: u.key, 
                amount: u.amount 
            })),
            achievements: G.achievs.map(u => ({ 
                key: u.key, 
                owned: u.owned 
            })),
            settings: JSON.stringify(G.settings)
        };
        window.localStorage.setItem('bunnyGameSave', btoa(JSON.stringify(saveData)));
        return btoa(JSON.stringify(saveData));
    }
    
    G.load = function(save) { //localStorage.getItem('bunnyGameSave')
        const saved = atob(save);
        if (saved) {
            try {
                const saveData = JSON.parse(saved);
                // Load resources
                saveData.resources.forEach(savedRes => {
                    const res = G.resources.find(r => r.key === savedRes.key);
                    if (res) {
                        res.amount = savedRes.amount;
                        res.totalAmount = savedRes.totalAmount !== undefined ? savedRes.totalAmount : savedRes.amount;
                    }
                });
                // Load buildings
                saveData.buildings.forEach(savedBldg => {
                    const bldg = G.buildings.find(b => b.key === savedBldg.key);
                    if (bldg) {
                        bldg.amount = savedBldg.amount;
                    }
                });
                // Load upgrades
                saveData.upgrades.forEach(savedUpg => {
                    const upg = G.upgrades.find(u => u.key === savedUpg.key);
                    if (upg) {
                        upg.amount = savedUpg.amount;
                    }
                });
                saveData.achievements.forEach(savedAch => {
                    const ach = G.achievs.find(u => u.key === savedAch.key);
                    if (ach) {
                        ach.owned = savedAch.owned;
                    }
                });
                G.settings = JSON.parse(saveData.settings);
                // Update all displays
                G.resources.forEach(updateResourceDisplay);
                G.buildings.forEach(updateBuildingDisplay);
                G.upgrades.forEach(updateUpgradeDisplay);
            } catch (e) {
                alert('Failed to load save: ' + e.message);
            }
        } else {
            alert('No save game found!');
        }
    }
    G.bulk = 1;
    G.Draw = function() {
        G.popupDraw();
        G.shiniesDraw();

        G.tooltipDraw();
        var oldBulk = G.bulk
        if (G.keys[16]) G.bulk=50;//shift
        if (!G.keys[16]) G.bulk=1;
		if (G.keys[17]) G.bulk=-G.bulk;//ctrl
        document.querySelector("#bulkDisplay > div").innerHTML=(G.bulk>0?'Buying':'Selling')+' <b>'+B(Math.abs(G.bulk))+'</b>';
        if (G.bulk!=oldBulk ) G.particleAt(G.l,0,(G.bulk<0?'Selling '+B(-G.bulk):'Buying '+B(G.bulk)));
        // update these really fast
        G.resources.forEach(updateResourceDisplay);
        G.buildings.forEach(updateBuildingDisplay);
        G.upgrades.forEach(updateUpgradeDisplay);
    }
    setInterval(G.Draw, 10);
    
	/*=====================================================================================
	SETTINGS
	=======================================================================================*/
	G.settings={
		'vol':{val:100},
		'autosave':{val:1},
		'numdisp':{val:0,onchange:function(val){
			val=parseInt(val);
			if (val>=0 && val<=2) numberFormatter=numberFormatters[val];
		}},
		'cssfilts':{val:1,onchange:function(val){
			if (val)
			{
				G.l.classList.remove('filtersOff');
				G.l.classList.add('filtersOn');
			}
			else
			{
				G.l.classList.remove('filtersOn');
				G.l.classList.add('filtersOff');
			}
		}},
		'particles':{val:2},
		'showFPS':{val:0,onchange:function(val){
			/*if (val)
			{
				G.fpsGraph.style.display='block';
				G.fpsCounter.style.display='block';
			}
			else
			{
				G.fpsGraph.style.display='none';
				G.fpsCounter.style.display='none';
			}*/console.log("this setting doesnt work!")
		}},
	};
	for (var i in G.settings){G.settings[i].key=i;}
	G.setSetting=function(what,val)
	{
		G.settings[what].val=val;
		if (G.settings[what].onchange) G.settings[what].onchange(G.settings[what].val);
	}
	G.getSetting=function(what)
	{
		return G.settings[what].val;
	}
	G.loadSettings=function()
	{
		for (var i in G.settings)
		{
			if (G.settings[i].onchange) G.settings[i].onchange(G.settings[i].val);
		}
	}
	
	G.makeChoices=function(o)
	{
		var str='';
		var buttonIds=[];
		for (var i in o.list)
		{
			buttonIds.push('button-'+(G.buttonsN+parseInt(i)));
		}
		for (var i in o.list)
		{
			var id=parseInt(i);
			str+=G.settingsbutton({
				text:o.list[i].text,
				classes:'tickbox '+(o.val()==id?'on':'off'),
				tooltip:o.list[i].tooltip,
				onclick:function(e){
					for (var i in buttonIds)
					{
						document.getElementById(buttonIds[i]).classList.remove('on');
						document.getElementById(buttonIds[i]).classList.add('off');
						if (e.target.id==buttonIds[i])
						{
							var id=parseInt(i);
							o.func(id);
						}
					}
					e.target.classList.remove('off');
					e.target.classList.add('on');
					triggerAnim(e.target,'glow');
				},
			});
		}
		return str;
	}
    G.clear = function()
    {
        window.localStorage.setItem('bunnyGameSave', "")
        location.reload() // its alot easier to just reload since it resets everything perfectly
    }
	G.makeTick=function(o)
	{
		if (!o.off) o.off=o.on;
		return G.settingsbutton({
			text:(o.val()?o.on:o.off),
			classes:'tickbox '+(o.val()?'on':'off'),
			tooltip:o.tooltip,
			onclick:function(e){
				if (o.val()) o.func(0); else o.func(1);
				if (o.val())
				{
					e.target.classList.remove('off');
					e.target.classList.add('on');
					e.target.innerHTML=o.on;
				}
				else
				{
					e.target.classList.remove('on');
					e.target.classList.add('off');
					e.target.innerHTML=o.off;
				}
				triggerAnim(e.target,'glow');
			},
		});
	}
	G.mainPopup=0;
	G.mainPopupEl=0;
    G.darkenL = document.getElementById('darken');
	G.setMainPopup=function(what)
	{
		if (what && what!=G.mainPopup)
		{
			if (G.mainPopupEl) G.closePopup(G.mainPopupEl);
			G.darkenL.className='on';
			if (what=='settings')
			{
				var text=`
				<div class="headerTitle">Settings</div>
				<div style="padding:4px;overflow-y:auto;">
				
					<div style="display:flex;justify-content:space-evenly;align-items:center;padding:8px;text-align:center;">
						<div>`+
						G.settingsbutton({
							text:'Save',
							tooltip:'Save your game.<br>You may also save with Ctrl+S.',
							onclick:function(e){
								triggerAnim(e.target,'glow');
								G.save();
							},
						})
						+`<br>`+
						G.settingsbutton({
							text:'Load',
							tooltip:'Reload your game.',
							onclick:function(e){
								triggerAnim(e.target,'glow');
                                if (window.localStorage.getItem('bunnyGameSave')) G.load(window.localStorage.getItem('bunnyGameSave'));
							},
						})
						+`</div>
						<div>`+
						G.settingsbutton({
							text:'Export',
							tooltip:'Export your save data to a file.<br>Use this to backup your save or to share it with other players.',
							onclick:function(e){
								triggerAnim(e.target,'glow');
								/*G.popup(0,{text:`
									<div class="headerTitle">Export save</div>
									<div style="padding:4px;overflow-y:auto;overflow-x:hidden;text-align:center;">
									<div>This is your save code.<br>Copy it and keep it somewhere safe!</div>
										<textarea id="textareaPrompt" style="margin-top:8px;width:100%;height:128px;overflow-x:hidden;
										overflow-y:scroll;" readonly>`+(G.save())+`</textarea>
										<div class="footerTitle hoverShine closesThePopup">Done</div>
									</div>
								`});*/
								G.fileSave();
							},
						})
						+`<br>`+
						G.settingsbutton({
							text:'Import<input id="FileLoadInput" type="file" style="cursor:pointer;opacity:0;position:absolute;left:0px;top:0px;width:100%;height:100%;" onchange="G.fileLoad(event);"/>',
							tooltip:'Import save data from a file that was previously exported.',
							onclick:function(e){
								triggerAnim(e.target,'glow');
								/*G.popup(0,{text:`
									<div class="headerTitle">Import save</div>
									<div style="padding:4px;overflow-y:auto;overflow-x:hidden;text-align:center;">
									<div>Please paste in the code that was given to you on save export.</div>
										<textarea id="textareaPrompt" style="margin-top:8px;width:100%;height:128px;overflow-x:hidden;
										overflow-y:scroll;">`+(0)+`</textarea>
										<div class="footerTitle hoverShine closesThePopup">Load</div>
									</div>
								`});*/
                                G.fileLoad();
							},
						})
						+`</div>
						<div>`+
						G.settingsbutton({
							text:'Wipe',
							classes:'red',
							tooltip:'Wipe your data for this game.<br>You will lose all your progress.<br>This cannot be undone!',
							onclick:function(e){
								triggerAnim(e.target,'glow');
								//G.clear();
                                /*document.querySelectorAll(".box-things").forEach((a) => (a.innerHTML = ""))
                                G.init(); // since our data gets defined in init anyway */
                                window.localStorage.setItem('bunnyGameSave', "")
                                location.reload() // its alot easier to just reload since it resets everything perfectly
							},
						})
						+`</div>
					</div>
				</div>
                
				<div class="listing b">Autosave : `+G.makeTick({
					val:function(){return G.getSetting('autosave');},
					on:'On',off:'Off',
					func:function(val){G.setSetting('autosave',val);},
					tooltip:'If this is enabled, the game will auto-save every 30 seconds.',
				})+`</div>
				<div class="listing b">Number display : `+G.makeChoices({
					val:function(){return G.getSetting('numdisp');},
					func:function(val){G.setSetting('numdisp',val);},
					list:
					[
						{text:'Shortest',tooltip:'Numbers will be displayed in the form<br><b>1k, 1T, 1UnD</b>.'},
						{text:'Short',tooltip:'Numbers will be displayed in the form<br><b>1 thousand, 1 trillion, 1 undecillion</b>.'},
						{text:'Full',tooltip:'Numbers will be displayed in the form<br><b>1,000, 1,000,000,000,000, 1e+36</b>.'},
					],
				})+`</div>
				<div class="listing b">Particles : `+G.makeChoices({
					val:function(){return G.getSetting('particles');},
					func:function(val){G.setSetting('particles',val);},
					list:
					[
						{text:'None',tooltip:'No particles will be displayed.'},
						{text:'Low',tooltip:'Particles are displayed in low-performance mode.'},
						{text:'Auto',tooltip:'Particles are displayed in high-performance mode, but switch to low-performance mode in low fps.'},
						{text:'Full',tooltip:'Particles are displayed in high-performance mode.'},
					],
				})+`</div>
				<div class="listing b">CSS filters : `+G.makeTick({
					val:function(){return G.getSetting('cssfilts');},
					on:'On',off:'Off',
					func:function(val){G.setSetting('cssfilts',val);},
					tooltip:'CSS filters are visual effects such as blur and shadows which may lower performance in some browsers.',
				})+`</div>
				<div class="listing b">Show fps : `+G.makeTick({
					val:function(){return G.getSetting('showFPS');},
					on:'On',off:'Off',
					func:function(val){G.setSetting('showFPS',val);},
					tooltip:'Display the framerate graph in the bottom-left.',
				})+`</div>
				</div>
				`;
			}
			else if (what=='info')
			{
                G.name = "Fake IGM";
				var text=`
				<div class="headerTitle">Info</div>
				<div style="padding:4px;overflow-y:auto;">
					<div class="sectionTitle">About</div>
					<div class="listing">You are playing <b>`+G.name+`</b>`+`, by <b>`+(G.author||'Anonymous')+`</b>.
					`+`
					</div>
					`+(G.desc?'<div class="listing desc"><div>'+`<div>`+G.desc+'</div>'+'</div></div>':'')+`
					</div>
					<div class="sectionTitle">Achievements</div>
					<div class="listing b" style="max-width:640px;margin:auto;">
						`+G.selfUpdatingText(function(){
							var str='';
							var owned=0;
							var total=0;
							for (var i in G.achievs)
							{
                                if (i == 0) { continue; }
								var me=G.achievs[i];
								if (me.owned === true) {
                                    str+=me.getQuickDom();
                                    owned++;
                                } else {
                                    str+=G.achievs[0].getQuickDom();
                                }
								total++;
							}
							str='<div>Owned : '+B(owned)+'/'+B(total)+'</div><div style="padding:8px;">'+str+'</div>';
							return str;
						},5)+`
					</div>
				</div>
				`;
				//TODO : custom stats
			}
			G.mainPopupEl=G.popup(0,{
				text:text+'<div class="footerTitle hoverShine closesThePopup">Close</div>',
				classes:'mainPopup',
				onClose:function(me){G.mainPopup=0;G.mainPopupEl=0;G.darkenL.className='off';},
			});
		}
		else if (G.mainPopupEl) {G.closePopup(G.mainPopupEl);what=0;}
		G.mainPopup=what;
		G.hideTooltip();
	}
    var me=document.getElementById('meta-button-info');
    G.addTooltip(me,{func:function(){return '<div class="title">Info & Stats</div><div class="desc"><div>View information about this game, and statistics about your playthrough.</div></div>';}});
    AddEvent(me,'click',function(){G.setMainPopup('info');});
    
    var me=document.getElementById('meta-button-settings');
    G.addTooltip(me,{func:function(){return '<div class="title">Settings</div><div class="desc"><div>Import and export your game data, and edit settings for video, audio and gameplay.</div></div>';}});
    AddEvent(me,'click',function(){G.setMainPopup('settings');});
    G.bulkDisplay=document.getElementById('bulkDisplay')||0;
    if (G.bulkDisplay)
    {
        G.addTooltip(G.bulkDisplay,{func:function(){return '<div class="title">Bulk-buying and selling</div><div class="desc"><div>Buy 50 at once by pressing Shift.</div><div>Sell 1 by pressing Ctrl.</div><div>Sell 50 at once by pressing Shift+Ctrl.</div></div>';}});
        G.bulkDisplay=G.bulkDisplay.getElementsByClassName('box-bit-content')[0];
    }
    // make a function that gets called every frame
    G.Logic=function(){
        if (G.keysD[27])//esc
		{
			if (G.popups.length>0) G.closePopup();
		}
		if (G.keys[17] && G.keysD[83])//ctrl-s
		{
			G.save();
		}
        G.particlesLogic();
        // loop over G.shinies and call their .logic() function
        for (var i in G.shinies) G.shinies[i].logic();
        G.shiniesLogic();
        G.toastLogic();
    };
    G.Logic();
    // make the G.Logic() function be called every frame
    AddEvent(window,'load',function(){
        G.Logic();
        setInterval(G.Logic,1000/30);
    });
};
document.addEventListener("DOMContentLoaded",G.init)