// create a sort tools plug-in
$ilo.plugin.sortModel = function(objectID, sortBy){
	//console.log(objectID + ' - ' + sortBy);
	
	var objectIndex = $ilo.tools.getObjectIndex(objectID);
	
	$ilo.objects[objectIndex].model.sort(function(a, b){ 
		return (a[sortBy] > b[sortBy]); 
	});
	
	$ilo.tools.setHtml(objectID);
}