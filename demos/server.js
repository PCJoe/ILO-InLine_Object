// accept data push
var Server = {
	Update: function(modelID, rowID, targetID, value){
		// get the relevent ID for the selected model
		var objectIndex = $ilo.tools.getObjectIndex(modelID);
		
		// in this function we don't know the actual model object index so we need to find it
		// you could create a class that parses the model index, but for demo purposes
		for (var i in $ilo.objects[objectIndex].model)
		{
			if($ilo.objects[objectIndex].model[i].id === rowID)
			{
				$ilo.objects[objectIndex].model[i][targetID] = value;
			}
		}
		
		$ilo.tools.setHtml(modelID);
		if(document.getElementById('panel_window').innerHTML!='') $ilo.tools.setHtml('panel_window');
	},
	
	Insert: function(modelID, row){
		// get the relevent ID for the selected model
		var objectIndex = $ilo.tools.getObjectIndex(modelID);
		
		// add our new row to the end
		$ilo.objects[objectIndex].model.push(row);
		
		// reset any views that use this model
		$ilo.tools.setHtml(modelID);
	}
}