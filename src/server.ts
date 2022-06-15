import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  //filteredImage enpoint
  app.get( "/filteredimage", async ( req, res ) => {
    //get url from the request
    const {image_url} = req.query 

    //validate input    
    if (!image_url) {
      return res.status(400).send("Please input the image url")
    }
    //call filterImageFromURL(image_url) to filter the image
    const imagePath  = await filterImageFromURL(image_url)

    return  await res.status(200).sendFile(imagePath, err => {
      if (err) {
        console.log(err)
      }
     // deletes any files on the server on finish of the response
      const localfiles : string[] = [imagePath]
      deleteLocalFiles(localfiles)
    })
        
  } );

   // Root Endpoint.
  app.get("/", (req , res ) => {
    return res.status(200).send("Welcome to ImagefilterAPI")
  })

  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();