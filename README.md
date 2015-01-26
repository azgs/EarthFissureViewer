EarthFissureViewer
==================
Mapped earth fissures in the state of Arizona. 

Preview here: 
http://azgs.github.io/EarthFissureViewer/

### Development mode

After cloning the repository, move into the folder and then

    python -m SimpleHTTPServer

The site will be visible at  http://localhost:8000

### Data Formats

Both the fissures and the study areas are served out to the viewer as geojson files, located in the `/data` folder. The structure for the data must remain consistent.

**earth_fissures.json**

There must be a field called **Label** which contains one of the following 3 values, exactly as written below.
- Continuous earth fissure
- Discontinuous earth fissure
- Reported, unconfirmed earth fissure

**earth_fissure_study_areas.json** 

There must be the fields **Label** and **Pdf**. The **Pdf** field contains the name of any associated pdf files (.pdf) and the thumbnail image (.png) file without the file type extension. (The pdf and thumbnail must be named the same.) If there are mulitiple pdfs they must be separated with a comma. Only one thumbnail is allowed per study area. For example:
```
Label: "Greene Wash",
Pdf: "greene-wash"
```
or
```
Label: "Picacho Peak and Friendly Corner",
Pdf: "picacho-1,picacho-2,picacho-3"
```

The pdfs and pngs associated with the study areas are located in the folder `/assests`.

### Updating the Fissures and the Study Areas

Starting with updated shapefiles exported from the ArcGIS Fissures project:

 - Project the shapefile to WGS 84
 - Convert to json using tool in ArcTools
 - Then convert the json feature to geojson at http://ogre.adc4gis.com/
 - Copy converted text to notepad and save as .json
 - Replace file in data folder
 
*Don't forget to add the new pdfs and pngs to the assests folder.*

See AZGS/development for updating the live server.
