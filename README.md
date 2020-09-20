# ngx-quill-upload (Angular 4+)
A module for images and videos to be uploaded to a server instead of being base64 encoded, in ngx-quill from toolbar editor.

## Features

- Written in typescript
- Just 6.4KB (2.4 KB gzipped)
- Gives you full control over API call, upload to S3 bucket or server as required
- Supports png, jpg and jpeg for image uploads
- Supports mp4 and webm for video uploads
- Supports ```<img>``` tag for image uploads, ```<video>``` tag for video uploads
- Based on quill-upload by [john-techfox](https://github.com/john-techfox/quill-upload)

## Installation

- `npm install ngx-quill-upload`
- install `quill` and `ngx-quill` for usage with ngx-quill
- Make sure you have registered QuillModule as per ngx-quill documentation


## Usage

### In your component.ts

```javascript
import Quill from 'quill';
import { VideoHandler, ImageHandler } from 'ngx-quill-upload';

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
       return // your uploaded image URL in Promise
      }
    },
    videoHandler: {
      upload: file => {
        return // your uploaded video URL in Promise
      }
    }
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

- As of now ngz-quill-upload isn't optimized for Server side rendering. Consider adding a plaform-browser check on your own if you plan to use SSR.

### Suppress global register warnings

ngx-quill-upload uses `Quill.register` for overwriting an existing module for Image and Video handler, QuillJS logs a warning.
To supress those expected warnings you can turn them off by passing `suppressGlobalRegisterWarning: true` in ngx-quill config.
Read more [here](https://github.com/KillerCodeMonkey/ngx-quill)
