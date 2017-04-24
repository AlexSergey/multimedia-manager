import palette from 'palette';
import exif from 'exif2';
import convert from 'color-convert';
import Canvas, {Image as CanvasImage} from 'canvas';

export default class Image {
    constructor(props) {
        this.root = props.root;
        this.path = props.path;
        this.folder = props.folder;
    }

    getImagedata() {
        var imageData = {};
        return new Promise((resolve, reject) => {
            exif(this.path, (err, obj) => {
                if(err) {
                    return reject(err);
                } else {
                    var category = !!obj["directory"] ? obj["directory"].slice(this.root.length) : '';

                    imageData.id = this.path;
                    imageData.category = category;
                    imageData.orientation = obj["orientation"];
                    imageData.flash = obj["flash"];
                    imageData.lens = obj["lens"];
                    imageData.aperture = obj["aperture"];
                    imageData.megapixels = obj["megapixels"];
                    imageData.file_name = obj["file name"];
                    imageData.directory = obj["directory"];
                    imageData.file_size = obj["file size"];
                    imageData.make = obj["make"];
                    imageData.camera_model_name = obj["camera model name"];
                    imageData.x_resolution = obj["x resolution"];
                    imageData.y_resolution = obj["y resolution"];
                    imageData.resolution_unit = obj["resolution unit"];
                    imageData.create_Date = obj["create date"];
                    imageData.focal_length = obj["focal length"];
                    imageData.focus_position = obj["focus position"];
                    imageData.focus_distance = obj["focus distance"];
                    imageData.lens_f_stops = obj["lens f stops"];
                    imageData.shutter_speed = obj["shutter speed"];
                    imageData.depth_of_field = obj["depth of field"];
                    imageData.GPS_Altitude = obj["gps altitude"];
                    imageData.GPS_Date_Time = obj["gps date/time"];
                    imageData.GPS_Latitude = obj["gps latitude"];
                    imageData.GPS_Longitude = obj["gps longitude"];
                    imageData.gps_altitude = obj["gps altitude"];
                    obj["gps position"] >"" ? imageData.location = this._gpstodd(obj["gps position"]): 1;

                    return this._makePalette(this.path)
                        .then(rgb => {
                            imageData.colors = rgb;

                            return resolve(imageData);
                        })
                }
            });
        });
    }

    _gpstodd (input) {
        input = input.replace(/\'/g," min").replace(/\"/g,' sec').replace(/\,/g,"").split(" ")

        var lat= (parseFloat(input[0])+parseFloat(input[2]/60)+parseFloat(input[4]/(60*60)) )* (input[6] =="S" ? -1 : 1);
        var lng=(parseFloat(input[7])+parseFloat(input[9]/60)+parseFloat(input[11]/(60*60)) ) *  (input[13] =="W" ? -1 : 1);

        return {"lat": lat, "lon":lng}
    }

    _makePalette(file) {
        return new Promise((resolve, reject) => {
            var img = new CanvasImage;
            img.src = file;
            var canvas = new Canvas(img.width, img.height);
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, img.width/4, img.height/4);

            var colors  = palette(canvas, 2);

            var rgb = colors.map(color => ({
                r: color[0],
                g: color[1],
                b: color[2]
            }));

            return resolve(rgb);
        });
    }
}
