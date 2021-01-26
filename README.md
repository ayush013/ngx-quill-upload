# ngx-quill-upload (Angular 4+) (v2.0)

<img src="https://www.code-inspector.com/project/13693/score/svg"> <img src="https://www.code-inspector.com/project/13693/status/svg"> <img src="https://img.shields.io/npm/dw/ngx-quill-upload"> <img src="https://img.shields.io/npm/l/ngx-quill-upload">

A module for images and videos to be uploaded to a server instead of being base64 encoded, in ngx-quill from toolbar editor.

## Features

- Written in typescript
- Bundled in both FESM2015 and UMD formats
- Just 6.4KB (2.4 KB gzipped)
- Gives you full control over API call, upload to S3 or server as required
- Supports png, jpg and jpeg for image uploads
- Supports mp4 and webm for video uploads
- Supports ```<img>``` tag for image uploads, ```<video>``` tag for video uploads
- Based on quill-upload by [john-techfox](https://github.com/john-techfox/quill-upload)

## Updates

- Image Attribute support added for ['style','alt','width','height']
- Concurrent upload handling for images, videos
- MIME Type check added for files
- Added Support for providing extensions for the following image and video formats -
  - Supported Image Extensions - 
    - 'apng', 'bmp', 'gif', 'ico', 'cur', 'jpg', 'jpeg', 'jfif', 'pjpeg', 'pjp', 'png', 'svg', 'tif', 'tiff', 'webp'
  - Supported Video Extensions - 
    - 'mp4', 'webm', '3gp', 'mp4', 'mpeg', 'quickTime', 'ogg'

## Installation

- `npm install ngx-quill-upload`
- install `quill` and `ngx-quill` for usage with ngx-quill
- Make sure you have registered QuillModule as per ngx-quill documentation

## NPM Directory

[ngx-quill-upload](https://www.npmjs.com/package/ngx-quill-upload)

## Usage

### In your component.ts

```javascript
import Quill from 'quill';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);


  modules = {
    toolbar: [
    ....
    ....
      ['image', 'video']
    ],
    imageHandler: {
      upload: (file) => {
       return // your uploaded image URL as Promise<string>
      },
      accepts: ['png', 'jpg', 'jpeg', 'jfif'] // Extensions to allow for images (Optional) | Default - ['jpg', 'jpeg', 'png']
    } as Options,
    videoHandler: {
      upload: (file) => {
        return // your uploaded video URL as Promise<string>
      },
      accepts: ['mpeg', 'avi']  // Extensions to allow for videos (Optional) | Default - ['mp4', 'webm']
    } as Options
  };
```

### In your component.html  markup

```html
 <quill-editor [modules]="modules"></quill-editor>
```

### A sample upload function for imageHandler

```javascript
   upload: (file) => {
        return new Promise((resolve, reject) => {

      if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') { // File types supported for image
        if (file.size < 1000000) { // Customize file size as per requirement
        
        // Sample API Call
          const uploadData = new FormData();
          uploadData.append('file', file, file.name);

          return this.http.post('YOUR API URL', uploadData).toPromise()
            .then(result => {
                resolve(result.message.url); // RETURN IMAGE URL from response
            })
            .catch(error => {
              reject('Upload failed'); 
              // Handle error control
              console.error('Error:', error);
            });
        } else {
          reject('Size too large');
         // Handle Image size large logic 
        }
      } else {
        reject('Unsupported type');
       // Handle Unsupported type logic
      }
    });
  }
```

## Angular Universal

- As of now ngx-quill-upload isn't optimized for Server side rendering. Consider adding a plaform-browser check on your own if you plan to use SSR.


### Suppress global register warnings

ngx-quill-upload uses `Quill.register` for overwriting an existing module for Image and Video handler, QuillJS logs a warning.
To supress those expected warnings you can turn them off by passing `suppressGlobalRegisterWarning: true` in ngx-quill config.
Read more [here](https://github.com/KillerCodeMonkey/ngx-quill)
