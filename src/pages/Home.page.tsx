
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Nav } from '../components/Nav/Nav';
import { DropzoneFullScreenComp } from '../components/DropzoneFullScreen/DropzoneFullScreen';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
export function HomePage() {
  function str2xml(str: string) {
    if (str.charCodeAt(0) === 65279) {
      // BOM sequence
      str = str.substr(1);
    }
    return new DOMParser().parseFromString(str, "text/xml");
  }
  
  // Get paragraphs as javascript array
  function getParagraphs(content: string) {
    const zip = new PizZip(content);
    const xml = str2xml(zip.files["word/document.xml"].asText());
    const paragraphsXml = xml.getElementsByTagName("w:p");
    const paragraphs = [];
  
    for (let i = 0, len = paragraphsXml.length; i < len; i++) {
      let fullText = "";
      const textsXml = paragraphsXml[i].getElementsByTagName("w:t");
      for (let j = 0, len2 = textsXml.length; j < len2; j++) {
        const textXml = textsXml[j];
        if (textXml.childNodes) {
          fullText += textXml.childNodes[0].nodeValue;
        }
      }
      if (fullText) {
        paragraphs.push(fullText);
      }
    }
    return paragraphs;
  }
  
  function dropFile(file: File){
    var reader = new FileReader();
    reader.onload = function(e) {
      if (e.target) {
        const extension = file.name.split(".")[file.name.split(".").length - 1]
        var contents = " "; // Initialize the contents variable
        if( extension == "docx" ||extension == "doc" )
        {
          //var doc = new Docxtemplater(new PizZip(e.target.result || ""));
          if (e.target.result) {
            contents = getParagraphs(e.target.result.toString()).join('\n'); // Convert e.target.result to string and join the array of strings
          }
        }
         
        console.log(contents)
      }
    };
    reader.readAsBinaryString(file);
  }
  return (
    <>
      <DropzoneFullScreenComp dropFile={dropFile}/>
      <Nav />
      
    </>
  );
}
