// core tools
var $ilo = {
	// the array which will hold all the $ilo objects
	objects: [],
	
	// create an array for any plugins
	plugin: [],
	
	// all the tools used for $ilo objects
	tools: {
		// create an inline object from the html
		createObject: function(options){
			// collect the objects html template
			var getHtml = document.getElementById(options.id).innerHTML;
			// now the template is collected, clear the template from the page
			document.getElementById(options.id).innerHTML = '';
			// create an array of all the properties of the object as declared in the template
			var getVars = function(template){
				var ilVariables = template.split('{{');
				var resultArray = [];
				for(var i in ilVariables)
				{
					if(i>0) 
					{
						varTemp = ilVariables[i].split('}}');
						// iloModelIndex is a global command is ignored as a variable
						if(varTemp[0]!=='iloModelIndex')
						{
							resultArray[i-1] = varTemp[0];
						}
					}
				}
				
				return resultArray;
			}
			// create the object and store it in the $ilo array
			$ilo.objects.push({
				element: options.id,
				model: options.model,
				//modelOrg: JSON.parse(stringify(options.model)),
				template: getHtml,
				variables: getVars(getHtml),
				filters: options.filters
			});
			// if the object has a model than generate the html
			if(options.model!==undefined)
			{
				$ilo.tools.setHtml(options.id);
			}
			// update the super model if this is an extension
			if(options.modelExtend!==undefined)
			{
				var objectIndex = $ilo.tools.getObjectIndex(options.modelExtend);
				
				$ilo.objects[objectIndex].modelExtend = [options.id];
			}
		},
		
		// get the array index for the target object
		getObjectIndex:  function(objectID){
			for (var i in $ilo.objects) {
				if($ilo.objects[i].element === objectID)
				{
					return i;
				}
			}
		},
		
		// add/update the model for a $ilo object
		attachModel: function(objectID, model){
			// get the object index
			var objectIndex = $ilo.tools.getObjectIndex(objectID);
			// inject model into object
			$ilo.objects[objectIndex].model = model;
			// refresh HTML
			$ilo.tools.setHtml(objectID);
		},
		
		// return the objects model from the objects ID
		getModelObject: function(objectID){
			// get the object index
			var objectIndex = $ilo.tools.getObjectIndex(objectID);
			// return the model object as an array
			return $ilo.objects[objectIndex].model;
		},
		
        // this process is still being refined 
		filter: function(objectID, filters){
			this.setHtml(objectID, filters);
		},
		
		// based on the set model update the html
		setHtml: function(objectID, filters){
			// method properties
			var objectIndex = $ilo.tools.getObjectIndex(objectID);
			var htmlTemplate = $ilo.objects[objectIndex].template;
			var resultHtml = '';
			var bufferHtml = '';
			// by default we should display the row
			var showRow = true;
			// loop through each model row
			for(var row in $ilo.objects[objectIndex].model)
			{
				// if filters are set then the default is false
				if(filters!=undefined) showRow = false;
				// move a copy of the template into a buffer
				bufferHtml = htmlTemplate;
				// set the current model index - this is for amendments of the model table
				var myPattern = new RegExp('{{iloModelIndex}}','gi');
				bufferHtml = bufferHtml.replace(myPattern, row);				
				// loop through each property of the object and update the buffer with the model value
				for(var indexID in $ilo.objects[objectIndex].variables)
				{
					var field = $ilo.objects[objectIndex].variables[indexID];
					// test if field needs t be filtered
					if(filters!=undefined)
					{
						for(var filterID in filters)
						{
							if(filters[filterID].field === field)
							{
								modelField = $ilo.objects[objectIndex].model[row][field].toLowerCase();
								searchField = filters[filterID].value.toLowerCase();
								
								if(modelField.indexOf(searchField)>=0)
								{
									showRow = true;
								}
							}
						}
					}
					var myPattern = new RegExp('{{'+field+'}}','gi');
					bufferHtml = bufferHtml.replace(myPattern, $ilo.objects[objectIndex].model[row][field]);
				}
				// update the final html var for the selected object
				if(showRow) resultHtml += bufferHtml;
			}
			// update the page with the object html and 
			document.getElementById(objectID).innerHTML = resultHtml;
		}
	}
}