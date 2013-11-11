import Image
from os import listdir
from os.path import isfile, join

photo_path = "/Users/adrian/Documents/git/EarthFissureViewer/assets/field_photos"
resize_path = "/Users/adrian/Documents/git/EarthFissureViewer/assets/resized_field_photos"

def listFiles():
	these_files = [f for f in listdir(photo_path) if isfile(join(photo_path, f)) if not f.startswith('.')]
	return [join(photo_path, f) for f in these_files]

def resizeThemAll(file):
	file_name = file.rsplit('/', 1)[1]
	save_file = join(resize_path, file_name)
	img = Image.open(file)
	width, height = img.size
	if height > width:
		try:
			size = 600, 400
			img.thumbnail(size, Image.ANTIALIAS)
			img.save(save_file, "JPEG")
		except IOError:
			print "Uh-oh spaghetti-o's"
	elif width > height:
		try:
			size = 400, 600
			img.thumbnail(size, Image.ANTIALIAS)
			img.save(save_file, "JPEG")
		except IOError:
			print "Dangerously Cheesy"
	else:
		try:
			size = 600, 600
			img.thumbnail(size, Image.ANTIALIAS)
			img.save(save_file, "JPEG")
		except IOError:
			print "Shamalamadingdong"

files = listFiles()

for file in files:
	resizeThemAll(file)