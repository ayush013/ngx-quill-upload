import BaseHandler from '../BaseHandler';
import { Constants } from '../../utils';
import Quill from 'quill';
import { ImageBlot } from '../../blots';

class ImageHandler extends BaseHandler {
  constructor(quill, options) {
    super(quill, options);

    this.handler = Constants.blots.image;
    this.applyForToolbar();
    Quill.register('formats/image', ImageBlot);
  }

}

export default ImageHandler;
