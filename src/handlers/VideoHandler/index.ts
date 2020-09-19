import BaseHandler from '../BaseHandler';
import { Constants } from '../../utils';
import { VideoBlot } from '../../blots';
import Quill from 'quill';

class VideoHandler extends BaseHandler {
  constructor(quill, options) {
    super(quill, options);

    this.handler = Constants.blots.video;
    this.applyForToolbar();
  }

}

export default VideoHandler;

Quill.register('formats/video', VideoBlot);
