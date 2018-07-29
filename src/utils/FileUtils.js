import FileSaver from 'file-saver';

export default class FileUtils {
	// static saveFile(filename) {
	// 	let sampleBytes = new Int8Array(4096);

	// 	let saveByteArray = (function() {
	// 		let a = document.createElement("a");
	// 		document.body.appendChild(a);
	// 		a.style = "display: none";
	// 		return function(data, name) {
	// 			let blob = new Blob(data, { type: "octet/stream" }),
	// 				url = window.URL.createObjectURL(blob);
	// 			a.href = url;
	// 			a.download = name;
	// 			a.click();
	// 			window.URL.revokeObjectURL(url);
	// 		};
	// 	})();

	// 	saveByteArray([sampleBytes], filename);
	// }

	// static saveByteArray(data, name) {
	// 	let blob = new Blob(data, { type: "octet/stream" }),
	// 		url = window.URL.createObjectURL(blob);
	// 	a.href = url;
	// 	a.download = name;
	// 	a.click();
	// 	window.URL.revokeObjectURL(url);
  // }
  
  static saveFile(blob, name){
//     var FileSaver = require('file-saver');
// var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, name);
  }

  static loadJsonFile(callback){
    let input = document.createElement("input");
    input.type="file";
    input.accept =".json"
    // input.multiple = true; // 多选
    document.body.appendChild(input);
    input.click();
    input.onchange = function(e){
      
      var file = this.files[0];
      if(!file) {
        callback("");
        console.log('请选择文件');
        return;
      }

      let reader = new FileReader();  
      reader.onload = function( ev ) {
          console.log('>>>>>',ev.target.result );
          callback(ev.target.result);
     };

     // default, UTF-8
     reader.readAsText(file);
    }
  }
}
