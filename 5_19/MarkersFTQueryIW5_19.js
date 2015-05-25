
//Variable Declaration	
var map, mapCenter, locCol, fTableID, legend, markers, pointLayer, Column, subLayer, zoomLevel, firms;
var layFirms, catBox, FirmsBox, laySA, selCat, selFir;


function initialize() {

//Variable Definition
  mapCenter = new google.maps.LatLng(46.7649885,-92.1112232);  
  fTableID = "1jPai26FlSqYV8QlaQtHSptgD3jIA9eNZGC4iWOoP";
  locCol = 'Address';
  
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: mapCenter,
    zoom: 10
  });
  
  
  /*var contentString = 'div id="content">'+
		'<div id="siteNotice">'+
		'</div>'+
		'<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
		'<div id="bodyContent">'+
		'<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
		'sandstone rock formation in the southern part of the '+
		'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
		'south west of the nearest large town, Alice Springs; 450&#160;km '+
		'(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
		'features of the Uluru - Kata Tjuta National Park. Uluru is '+
		'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
		'Aboriginal people of the area. It has many springs, waterholes, '+
		'rock caves and ancient paintings. Uluru is listed as a World '+
		'Heritage Site.</p>'+
		'<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
		'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
		'(last visited June 22, 2009).</p>'+
		'</div>'+
		'</div>';
	var infowindow = new google.maps.InfoWindow({
		content: contentString
	});

	var marker = new google.maps.Marker({
		position: mapCenter,
		map: map,
		title: 'Firms'
	});
	google.maps.event.addListener(marker,'click',function() {
		infowindow.open(map,marker);
	});
	
  */
  //Initialize the Google Fusion Tables Layer
  layFirms = new google.maps.FusionTablesLayer({
	query: { 
		select: locCol,
		from: fTableID
	}
  });

  
  legend = document.getElementById('legend');
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legend);
  pointLayer = document.getElementById('Point');
  
 
  catBox = document.getElementById('Niche');
  FirmsBox = document.getElementById('Firms');
  
  getData("Niche");
  getData("Firms");
  getData("LatDec");
  getData("LonDec");
  
  
  layFirms.setMap(null);
/*laySA = new google.maps.FusionTablesLayer({
	 query: { 
		select: '\'ServiceArea\'',
		from: ServArea
	}
  })*/
  
  legendWrapper = document.createElement('div');
  legendWrapper.id = 'legendeWrapper';
  legendWrapper.index = 1;
  map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(
	legendWrapper);
  legend1 = document.getElementById('legend1');
  title = document.createElement('p');
  
}
			

function getData(Column) {
	var firms = new Array();
	var latList = new Array();
	var lonList = new Array();
	var query = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT "+Column +" FROM "+ fTableID +" ORDER BY "+ Column +"&key=AIzaSyAjYEWvtUDpX0WkI7_pKmlzwrMKgJnore4";
	var queryurl = encodeURI(query);
	if (Column =="Niche") {
		var dataQuer = $.get(queryurl, function(data) {
		dropdownFill(catBox, data);
		});
	}else if(Column == "Firms"){
		var dataQuer = $.get(queryurl, function(data) {
			dropdownFill(FirmsBox, data);
		});
	}else if(Column =="LatDec") {
		var dataQuer = $.get(queryurl,function(data) {
			latList.push(data.rows[i][0]);
		});
	}else if(Column =="LonDec") {
		var dataQuer = $.get(queryurl,function(data) {
			lonList.push(data.rows[i][0]);
		});
	}
}
			
function dropdownFill(selectbox, data) {
	var List = new Array();
	for (var i=0; i <data.rows.length; i++) {
		if (List.indexOf(data.rows[i][0])==-1){
			List.push(data.rows[i][0]);
			addOption(selectbox, data.rows[i][0], data.rows[i][0]);
		}
	}
}

function addOption(selectbox,text, value){
	var entry = document.createElement("Option");
	entry.text = text;
	entry.value = value;
	selectbox.options.add(entry);
}


function clickCat(){
	selCat = catBox.value;
	selFir = FirmsBox.value;
	
	if (selCat != 0) {
		var query = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT Firms FROM "+ fTableID +"  WHERE Niche='" + selCat + "'&key=AIzaSyAjYEWvtUDpX0WkI7_pKmlzwrMKgJnore4";
		var queryurl = encodeURI(query);
		var dataQuer = $.get(queryurl, CatUpdateHandler);
		updateMap();
	}else {
		var i;
		for (i = FirmsBox.options.length-1;i>=0;i--)
		{
			FirmsBox. remove(i);
		}
		addOption(FirmsBox, "Browse Creative Firms", "1");
	}
}

function CatUpdateHandler(data) {
	var i;
	for(i=FirmsBox.options.length-1;i>=0;i--)
	{
		FirmsBox.remove(i);
	}
	
	addOption(FirmsBox, "All", "0");
	
	dropdownFill(FirmsBox, data);
}

function clickFirms(){
	selCat = catBox.value;
	selFir = FirmsBox.value;
	
	if (selFir != 0) {
		var query = "https://www.googleapis.com/fusiontables/v1/query?sql=SELECT Firms FROM "+ fTableID +"  WHERE Firms='" + selFir + "'&key=AIzaSyAjYEWvtUDpX0WkI7_pKmlzwrMKgJnore4";
		var queryurl = encodeURI(query);
		var dataQuer = $.get(queryurl, FirmsUpdateHandler);
	}else {
		var i;
		for (i = FirmsBox.options.length-1;i>=0;i--)
		{
			
		}
		storeLocationInfo(firms, latList, lonList, firmLoc);
	}
	
	
}

var firmLoc = []

function storeLocationInfo(n,x,y,firmLoc) {

	for(i=0; i< firms.length; i++) {
	firmLoc.push(n);
	}
	for(i=0; i< latList.length; i++) {
	firmLoc.push(x);
	}
	for(i=0; i < lonList.length; i++) {
	firmLoc.push(y);
	}
}
	
function setMarkers(map, firmLoc) {
	var image = { url: 'lightbulb.png',
	suze: new google.maps.Size(20,32),
	origin: new google.maps.Point(0,0),
	anchor: new google.maps.Point(0,32)
	};

	var shape = {
		coords:[1,1,1,20,18,20,18,1],
		type: 'poly'
	};
	for (var i = 0; firmLoc.length;i++) {
		var firm = firmLoc[i];
		var myLatLng = new google.maps.LatLng(firm[1],firm[2]);
		var marker = new google.maps.Marker({
			position: myLatLng,
			map: map,
			icon: image,
			shape: shape,
			title: firm[0]
		});
	};
}
			


function FirmsUpdateHandler(data) {
	var i;
	for(i=FirmsBox.options.length-1;i>=0;i--)
	{
		setMarkers(map,firmLoc);
	}
	
}



		
		
function searchCriteria(Column, dataHandlerType) {
	if (selCat ==0) {
		if (selFir ==0) {
			sendRequest(" GROUP BY LatDec,LonDec", Column, dataHandlerType);
		}else { sendRequest("WHERE Firms ='"+ selFir + "'", Column, dataHandlerType);
		};
	}else { 
		if(selFir == 0) {
			sendRequest("WHERE Niche ='" + selCat + "'GROUP BY LatDec, LonDec", Column, dataHandlerType);
		}else { 
			sendRequest("WHERE Niche ='" + selCat + "'AND Firms='" + SelFir + "'", Column, dataHandlerType);
		}
	}
}

function updateMap() {
		
	if(selCat == 0) {
		layFirms.setMap(map);
	}else if(selCat !=0){
		subLayer = new google.maps.FusionTablesLayer({
			query: {
				select: locCol,
				from: fTableID,
				where:" Niche = '" +selCat + "'"
			}
			
		});
		subLayer.setMap(map);
	}		
		
}



/*function updateMap() {
		
	if(selCat !=0) {
		subLayer = new google.maps.FusionTablesLayer({
			query: {
				select: locCol,
				from: fTableID,
				where:" Niche = '" +selCat + "'"
			}
			
		});
	subLayer.setMap(map);
	
	}else if(selCat == 0){
		layFirms.setMap(map);
	}		
		
}*/


google.maps.event.addDomListener(window, 'load', initialize);