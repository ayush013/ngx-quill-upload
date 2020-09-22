import Styled from './Styled';
import { Constants, Helpers } from '../utils';

interface Range {
  index: number;
  length: number;
}

export interface Options {
  accepts: string[];
  upload(file): Promise<any>;
}

class BaseHandler {
  quill: any;
  options: Options;
  range: Range | null;
  handler: string;
  loading: HTMLElement;
  fileHolder: HTMLInputElement;
  handlerId: string;
  helpers = new Helpers();
  allowedFormatRegex: RegExp;
  possibleExtension: Set<string>;

  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.range = null;

    new Styled().apply();

    if (this.isNotExistLoading()) {
      const node = document.createElement('div');
      node.innerHTML = this.helpers.loadingHTML();

      this.quill.container.appendChild(node);
    }

    if (typeof this.options.upload !== 'function') {
      console.warn('[Missing config] upload function that returns a promise is required');
    }

    setTimeout(() => {
      if (!this.options.accepts) {
        if (this.handler === Constants.blots.image) {
          this.options.accepts = ['jpg', 'jpeg', 'png'];
        }
        if (this.handler === Constants.blots.video) {
          this.options.accepts = ['mp4', 'webm'];
        }
      }

      if (this.handler === Constants.blots.image) {
        this.possibleExtension = new Set(['jpg', 'png', 'gif', 'webp', 'tiff', 'psd', 'raw', 'bmp', 'heif', 'indd', 'jpeg', 'jfif', 'svg', 'ai', 'eps']);
      }
      if (this.handler === Constants.blots.video) {
        this.possibleExtension = new Set(['mkv', 'mp4', 'webm', 'aec', 'wlmp', 'mpv', '3gp', 'vob', 'wmv', 'mpv2', 'mpeg', 'video', 'avi', 'wmmp', 'flv', 'vid', 'ismv', '3gp2', 'mpg']);
      }

      this.allowedFormatRegex = new RegExp('^(' + this.options.accepts.filter((el) => this.possibleExtension.has(el.toLowerCase())).reduce((acc, el, i) => acc.concat(i !== 0 ? `|${el}` : `${el}`), '') + ')$', 'i');
    }, 1);
  }

  applyForToolbar() {
    const toolbar = this.quill.getModule('toolbar');
    this.loading = document.getElementById(
      `${Constants.ID_SPLIT_FLAG}.QUILL-LOADING`
    );
    toolbar.addHandler(this.handler, this.selectLocalFile.bind(this));
  }

  selectLocalFile() {
    this.range = this.quill.getSelection();
    this.fileHolder = document.createElement('input');
    this.fileHolder.setAttribute('type', 'file');
    this.fileHolder.setAttribute('accept', `${this.handler}/*`);
    this.fileHolder.onchange = this.fileChanged.bind(this);
    this.fileHolder.click();
  }

  loadFile(context) {
    this.loading.removeAttribute('class');
    this.loading.setAttribute('class', Constants.LOADING_CLASS_NAME);

    const file = context.fileHolder.files[0];
    this.handlerId = this.helpers.generateID();

    const fileReader = new FileReader();
    fileReader.addEventListener('load', () => {
      this.insertBase64Data(fileReader.result, this.handlerId);
    }, false);

    if (!file) {
      console.warn('[File not found] Something was wrong, please try again!!');
      return;
    }

    fileReader.readAsDataURL(file);

    return file;
  }

  fileChanged() {
    const file = this.loadFile(this);
    const extension = file.name.split('.').pop();

    if (!this.isValidExtension(extension)) {
      console.warn(
        '[Wrong Format] Format was wrong, please try with correct format!!'
      );
    }

    if (!this.hasValidMimeType(file.type)) {
      console.warn(
        `[Incorrect Mime Type] The MIME Type of uploaded file is not ${this.handler}!!`
      );
    }

    this.embedFile(file);
  }

  embedFile(file) {
    this.options.upload(file).then(
      (url) => {
        this.insertFileToEditor(url);
        this.loading.removeAttribute('class');
        this.loading.setAttribute('class', Constants.NONE_DISPLAY_CLASS_NAME);
      },
      (error) => {
        this.loading.removeAttribute('class');
        this.loading.setAttribute('class', Constants.NONE_DISPLAY_CLASS_NAME);
        setTimeout(() => {
          const el = document.getElementById(this.handlerId);
          el.remove();
        }, 1000);
      }
    );
  }

  insertBase64Data(url, handlerId) {
    const range = this.range;
    this.quill.insertEmbed(
      range.index,
      this.handler,
      `${handlerId}${Constants.ID_SPLIT_FLAG}${url}`
    );

    const el = document.getElementById(handlerId);

    if (el) {
      el.setAttribute('class', Constants.QUILL_UPLOAD_HOLDER_CLASS_NAME);
    }
  }

  insertFileToEditor(url) {
    const el = document.getElementById(this.handlerId);
    if (el) {
      el.setAttribute('src', url);
      el.removeAttribute('id');
      el.removeAttribute('class');
    }
  }

  isValidExtension(extension) {
    return extension && this.allowedFormatRegex.test(extension);
  }

  hasValidMimeType(type) {
    return type && type.startsWith(this.handler);
  }

  isNotExistLoading() {
    const loading = document.getElementById(
      `${Constants.ID_SPLIT_FLAG}.QUILL-LOADING`
    );

    return loading == null;
  }
}

export default BaseHandler;
