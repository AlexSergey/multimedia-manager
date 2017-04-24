# What is it?

This is my first project to build my Smart House.

I want to build few services for optimization routine deals and security my house. 

Phase 1. Photo Finder.

I have very large photo and video collections. In my collections contains many files and I want to manage it more efficient.
 
Multimedia Manager it is first step to build my Smart House.

Multimedia Manager will able to check my Photo collection and parse it.
After parsed all my photos EXIF information, palette information, directories etc. It will be send to elasticsearch and track this.
My Home Server will be share Client App for search this photos and show it from different devices in my flat.

## Plans

The second part Multimedia Manager will be build similar parser for Video files (movies). I want to connect this parser to some free API DB films for get mode information.

3th - I will make motion detector for security my House

4th - water/steam sensors for protected my House

...

## Architecture

It will be microservice architecture.

### devices
- miniPC (Windows)
- RaspberryPI 2 and 3

miniPC will be TV-set station for playing Photos and Videos

Raspberries will be work with sensors and cameras.

### Stack
- NodeJS
- Python
- React / Redux
- React-Native
- Elasticsearch
- Sequelize
- OpenCV

### Tools
1. Image-ExifTool
2. Node 7+
3. Elasticsearch 5+
4. Python2
