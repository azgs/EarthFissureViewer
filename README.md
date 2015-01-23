EarthFissureViewer
==================
Mapped earth fissures in the state of Arizona. 

Preview here: 
http://azgs.github.io/EarthFissureViewer/

==================
### Development mode

After cloning the repository, move into the folder and then

    python -m SimpleHTTPServer

The site will be visible at  http://localhost:8000

==================
### Updates to Fissure feature

Project the updated shape-file to WGS 84
Convert to json using tool in Arc
Then convert the json feature to geojson at http://ogre.adc4gis.com/
Copy converted code to note pad and save as .json
Add file back to data folder
 