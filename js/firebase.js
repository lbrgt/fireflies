function writeFile(path, file, data) {
    console.log("Write file to firebase");
    console.log(file);

    var storage = firebase.storage();
    var storageRef = storage.ref();

    var spaceRef = storageRef.child(path.concat('/', file));

    
    try {
      var uploadTask = spaceRef.put(data);
      console.log("put myfile");
      uploadTask.on('state_changed', function progress(snapshot) {
     console.log(snapshot.totalBytesTransferred); // progress of upload
     });
    } catch (error) {
      console.error(error);
   }
}

function export_csv(arrayHeader, arrayData, delimiter, fileName) {
	let header = arrayHeader.join(delimiter) + '\n';
	let csv = header;
	arrayData.forEach( obj => {
		let row = [];
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				row.push(obj[key]);
			}
		}
		csv += row.join(delimiter)+"\n";
	});

	let csvData = new Blob([csv], { type: 'text/csv' }); 
    return csvData;
}

