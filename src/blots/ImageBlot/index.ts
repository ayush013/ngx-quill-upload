import Quill from 'quill';
import { Constants } from '../../utils';

const blotPath = 'formats/image';
const BlockEmbed: EmbedBlot = Quill.import(blotPath);

interface EmbedBlot {
  new(...args: any[]): EmbedBlot;
  domNode: any;
  format(name, value);
  create(value?);
}

const SUPPORTED_ATTRIBUTES = [
  'alt',
  'height',
  'width',
  'style'
];

class ImageBlot extends BlockEmbed {
  static tagName: string;
  static blotName: string;
  static className: string;

  static create(value): HTMLElement {
    let id: string;
    let src: string;

    if (typeof value === 'object' && !value.url) {
      return super.create();
    }

    const arr = value.url
      ? value.url.split(Constants.ID_SPLIT_FLAG)
      : value.split(Constants.ID_SPLIT_FLAG);
    if (arr.length > 1) {
      id = arr[0];
      src = arr[1];
    } else {
      src = value;
    }

    const node = super.create(src);
    if (typeof src === 'string') {
      node.setAttribute('src', src);
    }

    if (typeof src === 'object') {
      node.setAttribute('src', (src as any).url);
    }

    if (id) {
      node.setAttribute('id', id);
    }

    return node;
  }

  static value(node): object {
    return {
      alt: node.getAttribute('alt'),
      url: node.getAttribute('src'),
    };
  }

  static formats(domNode) {
    return SUPPORTED_ATTRIBUTES.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }

  format(name, value) {
    if (SUPPORTED_ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}

ImageBlot.tagName = 'img';
ImageBlot.blotName = Constants.blots.image;
ImageBlot.className = 'quill-upload-image';

export default ImageBlot;
