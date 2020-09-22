import BaseHandler, { Options } from '../BaseHandler';
import { Constants } from '../../utils';
import { VideoBlot } from '../../blots';
import Quill from 'quill';

class VideoHandler extends BaseHandler {
  constructor(quill, options: Options) {
    super(quill, options);

    this.handler = Constants.blots.video;
    this.applyForToolbar();
    Quill.register('formats/video', VideoBlot);
  }

}

export default VideoHandler;
