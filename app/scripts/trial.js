
function Trial(screen, position) {

	this.screen = screen || {};
	this.screen.trialnumber = position + 1;
	this.screen.uniquekey = exp.getCurrentScreen().item + Math.floor(Math.random()*1000000); /// to be improved?

	this.screen.HORIZONTAL = 1;
	this.screen.VERTICAL = 2;

	this.screen.parts = new Array();
	this.screen.partOrder = new Array();
	this.screen.currentPart = 0;
	this.screen.soundbuttoncounter = 0;

	this.screen.advance = function() {
		$("#" + exp.getCurrentScreen().uniquekey + 'part' + exp.getCurrentScreen().currentPart).show();
		exp.getCurrentScreen().currentPart++;
	}
	
	this.screen.makeScale = function(obj) {
		var direction = obj.direction || Trial.VERTICAL;
		var buttons = obj.buttons || ["1","2","3","4","5","6","7"];
		var labels = obj.labels || [""];
		var serverValues = obj.serverValues || buttons;
		var labelposition = 0;
		
		var str = "";
		str += '<div style="text-align: left; margin-left: 50%; padding: 20px 0px 20px 0px;">';
		for (var i=0; i<buttons.length; i++) {
			str += '<div><input type="button" value=" '+ buttons[i] +' " id="' + exp.getCurrentScreen().uniquekey + 'button' + i + '" style="margin-right: 10px;" onClick="exp.advance();">';
			str += labels[labelposition];
			labelposition++;
			if(labelposition>=labels.length) labelposition=0;
			str += '</div>';
		}
		str += '</div>';
		return str;
	}
	
	this.screen.makeSoundButton = function (obj) {
		var label = obj.label || "    ►    ";
		var soundID  = obj.soundID || exp.getCurrentScreen().uniquekey + exp.getCurrentScreen().soundbuttoncounter;
		var soundFile = obj.soundFile;
		exp.getCurrentScreen().soundbuttoncounter++;
		
		soundManager.createSound({
			id: soundID,
			url: soundFile,
			autoPlay: false, 
			autoLoad: true,
			onload:function() {
			},
			onfinish:function() {
				exp.getCurrentScreen().advance();
			}
		});

		var str = "";
		str += '<input type="button" ';
		str += ' id="' + soundID +'"';
		str += ' value="' + label + '"';
		str += ' onClick="soundManager.play(\'' + soundID + '\');"'
		str += ' style="margin-left: 10px;"'
		str += ' data-played="0"'
		str += '>';
		return str;
	}
	
	this.screen.addPart = function (content) {
		content = content || "";
		var str ="";
		str += '<div id="' + exp.getCurrentScreen().uniquekey + 'part' + exp.getCurrentScreen().parts.length + '" style="text-align:center; display:none;">';
		str += content;
		str += '</div>';
		exp.getCurrentScreen().parts.push(str);
	}
	
	this.screen.order = function(arr) {
		if (typeof arr != "object") {
			alert("Please supply an array to the order function.");
			return false;
		}
		if(arr.length==exp.getCurrentScreen().parts.length) {
			for (var i=0; i<arr.length; i++) {
				if(typeof arr[i]!="number") {
					alert("Not a number at "+i+".");
					return false;
				}
			}
			exp.getCurrentScreen().partOrder = arr;
		} else {
			alert("The order array you supplied doesn't match the number of parts you supplied.");
		}
		
	}




	this.html = function() {


		var singular = (this.screen.finalConsonant=="l") ? exp.getCurrentScreen().item : exp.getCurrentScreen().item_j;

		var sound_pl1 = "data/sounds/" + exp.getCurrentScreen()["file_" + exp.getCurrentScreen().finalConsonant];
		var sound_pl2 = "data/sounds/" + exp.getCurrentScreen()["file_pl_" + exp.getCurrentScreen().finalConsonant];

		var f1 = this.screen.frame.text.replace(/_+/, "<b><i>" +  singular + "</i></b>");
		f1 += exp.getCurrentScreen().makeSoundButton({soundFile: sound_pl1});

		var f2 = this.screen.frame.text.replace(/_+/, "<b><i>" +  singular + "</i></b>");
		f2 += exp.getCurrentScreen().makeSoundButton({soundFile: sound_pl2});

		if (exp.getCurrentScreen().rand == "x-first") {
			[f1 ,f2] = [f2 ,f1];
		}

		exp.getCurrentScreen().addPart(f1);

		exp.getCurrentScreen().addPart(f2);

		scale = exp.getCurrentScreen().makeScale({buttons: ["1","2","3","4","5","6","7"], direction: Trial.HORIZONTAL, labels: ['⬆ I prefer the first plural','','','No preference','','','⬇ I prefer the second plural']});
		exp.getCurrentScreen().addPart(scale);
		
		exp.getCurrentScreen().order([0, 2, 1]);
		

		var str = "";
		for (var i=0; i<exp.getCurrentScreen().partOrder.length; i++) {
			str += exp.getCurrentScreen().parts[exp.getCurrentScreen().partOrder[i]];
		}
		return str;
	}

}