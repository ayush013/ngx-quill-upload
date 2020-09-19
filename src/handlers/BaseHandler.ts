import Styled from './Styled';
import { Constants, Helpers } from '../utils';

interface Range {
  index: number;
  length: number;
}

export interface Options {
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

    if (!this.isImage(extension) && !this.isVideo(extension)) {
      console.warn(
        '[Wrong Format] Format was wrong, please try with image format correctly!!'
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

  isImage(extension) {
    return /(jpg|jpeg|png)$/i.test(extension);
  }

  isVideo(extension) {
    return /(mp4|webm)$/i.test(extension);
  }

  isNotExistLoading() {
    const loading = document.getElementById(
      `${Constants.ID_SPLIT_FLAG}.QUILL-LOADING`
    );

    return loading == null;
  }
}

export default BaseHandler;
